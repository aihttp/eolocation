# EdgeOne地理位置增强功能部署检查清单

## 部署前检查
- [x] 代码TypeScript错误已修复
- [x] 使用正确的函数签名 `onRequestGet`
- [x] KV变量 `IP_KV` 已声明
- [x] 添加了详细的调试信息

## EdgeOne控制台配置
- [ ] 创建KV存储命名空间：`ip`
- [ ] 设置KV变量名称：`IP_KV`
- [ ] 将KV存储绑定到边缘函数
- [ ] 部署 `functions/geo/index.ts` 文件

## 部署后验证步骤
1. **访问边缘函数URL**（如 `ip.test.cn`）
2. **检查返回数据中的 `_debug` 字段**，应该显示：
   ```
   检查原始数据: hasCity=false, hasCisp=false - 开始调用API - API调用成功，获得数据: city=合肥, organization=中国联通 - KV缓存写入成功
   ```
3. **检查lbs-api后端日志**，确认收到EdgeOne请求
4. **检查EdgeOne KV存储**，查看是否有 `geo_cache_` 开头的数据

## 预期结果
- `cityName` 字段显示准确的城市信息（如"合肥"）
- `cisp` 字段显示准确的ISP信息（如"中国联通"）
- KV存储中有缓存数据
- 第二次访问时使用缓存，响应更快

## 故障排除
如果功能不正常，请检查 `_debug` 字段内容：
- 如果显示"数据完整，直接返回" → EO内置数据已经完整
- 如果显示"缓存读取失败" → KV存储配置有问题
- 如果显示"API调用失败" → 网络或API问题
- 如果没有 `_debug` 字段 → 函数没有被正确调用

## 生产环境优化
部署成功后，可以移除 `_debug` 字段以减少响应大小。