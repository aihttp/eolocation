// EdgeOne KV存储变量声明
declare const IP_KV: any;

interface EORequest extends Request {
  eo: {
    geo: {
      asn: number;
      countryName: string;
      countryCodeAlpha2: string;
      countryCodeAlpha3: string;
      countryCodeNumeric: string;
      regionName: string;
      regionCode: string;
      cityName: string;
      latitude: number;
      longitude: number;
      cisp: string;
    };
    uuid: string;
    clientIp: string;
  };
}

// 增强地理位置信息获取函数
async function enhanceGeoInfo(clientIp: string, originalGeo: any, env: any) {
  const debugInfo = {
    step: '',
    originalCity: originalGeo.cityName,
    originalCisp: originalGeo.cisp,
    clientIp: clientIp
  };

  // 检查EO内置数据是否有效（严格按照用户要求）
  // cityName字段：空值或"Unknown"视为无效
  const needCityEnhance = !originalGeo.cityName || 
                          originalGeo.cityName.trim() === '' || 
                          originalGeo.cityName === 'Unknown';
  
  // cisp字段：空值或"Unknown"视为无效  
  const needCispEnhance = !originalGeo.cisp || 
                          originalGeo.cisp.trim() === '' || 
                          originalGeo.cisp === 'Unknown';
  
  debugInfo.step = `检查EO数据: cityName="${originalGeo.cityName}"(需要增强:${needCityEnhance}), cisp="${originalGeo.cisp}"(需要增强:${needCispEnhance})`;
  
  // 如果两个字段都有效，直接返回原始数据
  if (!needCityEnhance && !needCispEnhance) {
    return {
      ...originalGeo,
      _debug: debugInfo.step + ' - EO数据完整，直接返回'
    };
  }

  // 只要有任意一个字段无效，就需要调用lbs-api
  const needApiCall = needCityEnhance || needCispEnhance;
  debugInfo.step += ` - 需要调用lbs-api: ${needApiCall}`;

  // 如果需要调用API，先尝试从KV缓存获取
  if (needApiCall) {
    const cacheKey = `geo_cache_${clientIp}`;
    try {
      const cached = await IP_KV.get(cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        // 1天缓存有效期 = 1 * 24 * 60 * 60 * 1000 = 86400000毫秒
        if (Date.now() - cacheData.timestamp < 86400000) {
          // 只替换需要增强的字段
          const enhancedGeo = { ...originalGeo };
          if (needCityEnhance) {
            enhancedGeo.cityName = cacheData.city; // lbs-api的city字段 -> EO的cityName字段
          }
          if (needCispEnhance) {
            enhancedGeo.cisp = cacheData.isp; // lbs-api的organization字段 -> EO的cisp字段
          }
          
          return {
            ...enhancedGeo,
            _debug: debugInfo.step + ` - 从缓存增强: cityName="${enhancedGeo.cityName}", cisp="${enhancedGeo.cisp}"`
          };
        }
      }
    } catch (e) {
      debugInfo.step += ` - 缓存读取失败: ${e instanceof Error ? e.message : String(e)}`;
    }

    // 调用lbs-api获取增强数据
    try {
      debugInfo.step += ' - 开始调用lbs-api';
      // 从环境变量读取API地址，提供默认值作为fallback
      const lbsApiUrl = env.LBS_API_URL || '';
      const response = await fetch(`${lbsApiUrl}/${clientIp}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'EdgeOne-Function/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const lbsData = await response.json();
      debugInfo.step += ` - lbs-api调用成功，获得数据: city="${lbsData.city}", isp="${lbsData.organization}"`;
      
      // 缓存lbs-api结果到KV存储，设置1天TTL自动过期
      try {
        await IP_KV.put(cacheKey, JSON.stringify({
          city: lbsData.city, // 不进行任何校验，直接存储
          isp: lbsData.organization,   // 不进行任何校验，直接存储
          timestamp: Date.now()
        }), { expirationTtl: 86400 }); // 1天 = 1 * 24 * 60 * 60 = 86400秒
        debugInfo.step += ' - KV缓存写入成功';
      } catch (e) {
        debugInfo.step += ` - KV缓存写入失败: ${e instanceof Error ? e.message : String(e)}`;
      }

      // 只替换需要增强的字段，不对lbs-api返回值进行任何校验
      const enhancedGeo = { ...originalGeo };
      if (needCityEnhance) {
        enhancedGeo.cityName = lbsData.city; // lbs-api的city字段 -> EO的cityName字段
      }
      if (needCispEnhance) {
        enhancedGeo.cisp = lbsData.organization; // lbs-api的organization字段 -> EO的cisp字段
      }
      
      return {
        ...enhancedGeo,
        _debug: debugInfo.step + ` - 最终增强结果: cityName="${enhancedGeo.cityName}", cisp="${enhancedGeo.cisp}"`
      };
    } catch (error) {
      debugInfo.step += ` - lbs-api调用失败: ${error instanceof Error ? error.message : String(error)}`;
      // lbs-api无法连接，直接返回EO原始数据（即使无效）
      return {
        ...originalGeo,
        _debug: debugInfo.step + ' - lbs-api无法连接，返回EO原始数据'
      };
    }
  }

  // 理论上不会执行到这里，但作为保险
  return {
    ...originalGeo,
    _debug: debugInfo.step + ' - 未知情况，返回EO原始数据'
  };
}

export async function onRequestGet({ request, params, env }: { 
  request: EORequest; 
  params: any; 
  env: any; 
}) {
  const eo = request.eo;
  
  // 增强地理位置信息
  const enhancedGeo = await enhanceGeoInfo(eo.clientIp, eo.geo, env);
  
  return new Response(
    JSON.stringify({
      eo: {
        ...eo,
        geo: enhancedGeo
      }
    }),
    {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
 