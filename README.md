# 基于腾讯云 EdgeOne Pages 的地理位置查询工具

使用 EdgeOne Pages 函数获取客户端的地理位置，并部署到 EO边缘函数节点

默认使用 EO边缘函数 内置地理信息字段，没有获取到 [城市] 或 [运营商] 信息时，使用第三方API获取，并缓存到 KV数据库

支持灵活配置各项环境变量：页面标题、页面介绍、首页一级标题、网站统计JS、自建IP转城市API


## 一键部署步骤（EO控制台操作）

【一】Fork本项目到你的仓库，在EO控制台创建项目-导入项目-框架预设 [Next] - 填写环境变量 - 开始部署

```
## 增强功能依赖KV存储和环境变量，不配置则仅运行基础功能

SITE_TITLE=IP信息查询

SITE_DESCRIPTION=IP信息查询

NEXT_PUBLIC_SITE_H1_TITLE=IP信息查询

ANALYTICS_CODE=<script src="https://tongji.test.cn/script.js" data-website-id="2f696503-af46-4820-bce6-3b7c1160f9d0"></script>

LBS_API_URL=https://lbs.test.cn
```

【二】在项目控制台-KV存储，新建命名空间 [任意名称] ，新建KV变量名称 [IP_KV] 绑定到该空间


【三】在项目控制台-构建部署-新建部署，浏览器访问默认预览域名或绑定你的自定义域名查看效果