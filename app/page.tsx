'use client';

import { getGeo } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface GeoData {
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
}

interface EdgeOneData {
  geo: GeoData;
  uuid: string;
  clientIp: string;
}

export default function Home() {
  const [data, setData] = useState<EdgeOneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 从环境变量读取页面标题，提供默认值
  const pageTitle = process.env.NEXT_PUBLIC_SITE_H1_TITLE || "IP信息查询";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGeo();
        setData(response.eo);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen relative">
      {/* 星空背景 */}
      <div className="starry-background">
        <div className="stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="orbit orbit-3"></div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-7xl">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <a
                href="#"
                target="_blank"
                className="gradient-text inline-block hover:opacity-90 transition-opacity duration-300"
                rel="noopener noreferrer"
              >
                {pageTitle}
              </a>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              基于边缘计算的实时地理位置检测，为您提供精准的位置信息服务
            </p>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-pink-500 border-l-cyan-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <p className="gradient-text-blue mt-6 text-lg font-medium">
                🌍 正在检测您的位置信息...
              </p>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="glass-card border-red-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-red-300 text-lg font-medium">{error}</p>
            </div>
          )}

          {/* 数据展示 */}
          {data && (
            <div className="space-y-8">
              {/* 客户端信息 - 顶部卡片 */}
              <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 sm:mr-4 shadow-lg">
                      🖥️
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">客户端信息</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto">
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">IP 地址:</span>
                      <span className="gradient-text-blue font-bold text-base sm:text-lg">{data.clientIp}</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">UUID:</span>
                      <span className="gradient-text-blue font-bold text-xs sm:text-sm md:text-base truncate max-w-[150px] sm:max-w-[200px]">{data.uuid}</span> 
                    </div>
                  </div>
                </div>
              </div>

              {/* 地理位置信息 - 网格布局 */}
              {data.geo && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* 国家信息 */}
                  <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3 shadow-lg">
                        🌍
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">国家信息</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">国家名称:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.countryName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">二位代码:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.countryCodeAlpha2}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">三位代码:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.countryCodeAlpha3}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">数字代码:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.countryCodeNumeric}</span>
                      </div>
                    </div>
                  </div>

                  {/* 地区信息 */}
                  <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3 shadow-lg">
                        📍
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">地区信息</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">省份/州:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.regionName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">地区代码:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.regionCode}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">城市名称:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.cityName}</span>
                      </div>
                    </div>
                  </div>

                  {/* 坐标与网络信息 */}
                  <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3 shadow-lg">
                        🌐
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">坐标与网络</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">纬度:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.latitude}°</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">经度:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">{data.geo.longitude}°</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">ASN:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">
                          {data.geo.asn !== 0 ? data.geo.asn : '未知'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">运营商:</span>
                        <span className="text-white font-semibold bg-gray-700/30 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">
                          {data.geo.cisp !== 'Unknown' ? data.geo.cisp : '未知'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 页脚 */}
          <div className="text-center mt-8 sm:mt-12 space-y-4">
            <div className="glass-card rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto">
              <p className="text-gray-300 text-base sm:text-lg mb-2">
                ⚡ 由 <span className="gradient-text-blue font-semibold">Tencent Edgeone</span> 强力驱动 ⚡
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                实时地理位置检测 • 边缘计算加速 • 全球节点覆盖
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}