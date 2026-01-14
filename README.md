# 免费SSL证书申请系统

基于 Vue 3 + Arco Design 的免费 SSL 证书在线申请系统，支持 ZeroSSL、Let's Encrypt、Google 三大证书品牌。

## ✨ 功能特性

- ✅ **多品牌证书申请**：支持 ZeroSSL、Let's Encrypt、Google 三大证书品牌
- ✅ **智能DNS解析提示**：根据证书品牌自动显示 CNAME 或 TXT 解析方式
- ✅ **一键复制DNS记录**：快速复制主机名和解析值，方便配置DNS
- ✅ **证书详情查看**：完整展示证书内容、私钥、证书链
- ✅ **证书下载**：一键下载包含证书、私钥、证书链的 ZIP 压缩包
- ✅ **验证状态查询**：实时查询证书签发状态
- ✅ **DNS解析验证**：本地验证DNS解析是否生效
- ✅ **证书列表管理**：本地存储证书列表，方便管理多个域名
- ✅ **全屏加载动画**：优雅的转圈圈加载效果，提升用户体验

## 🛠 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Arco Design Vue** - 字节跳动企业级设计语言和组件库
- **Vue Router** - 官方路由管理器
- **Axios** - 基于 Promise 的 HTTP 客户端
- **Vite** - 下一代前端构建工具

## 📦 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# API基础URL（开发环境建议使用 /api，通过 Vite 代理）
VITE_API_BASE_URL=/api

# API密钥（从 https://ssl.aa1.cn/user/ 获取）
VITE_API_KEY=your_api_key_here
```

> ⚠️ **重要提示**：
> - API 密钥仅通过环境变量配置，前端页面不显示密钥输入框
> - 如需更改密钥，请修改 `.env` 文件后重启开发服务器
> - 生产环境部署时，请确保 `.env` 文件不被提交到代码仓库

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 🔧 配置说明

### Vite 代理配置

项目已配置 Vite 开发服务器代理，将 `/api` 请求代理到 `https://ssl.aa1.cn`，避免跨域问题。

配置文件：`vite.config.js`

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://ssl.aa1.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 生产环境部署

生产环境建议使用 Nginx 等反向代理服务器，将 `/api` 请求转发到 `https://ssl.aa1.cn`。

示例 Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location /api {
        proxy_pass https://ssl.aa1.cn;
        proxy_set_header Host ssl.aa1.cn;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📖 使用说明

### 1. 获取 API 密钥

访问 [ssl.aa1.cn/user/](https://ssl.aa1.cn/user/) 获取您的 API 密钥。

### 2. 配置环境变量

将获取到的 API 密钥配置到 `.env` 文件中：

```env
VITE_API_KEY=sk_xxxxxxxxxxxxx
```

### 3. 启动项目

```bash
npm run dev
```

### 4. 申请证书

1. 选择证书品牌（推荐 ZeroSSL，验证速度较快）
2. 输入要申请证书的域名
3. 点击"提交申请"

### 5. 配置 DNS 解析

申请成功后，系统会显示 DNS 解析记录：

- **ZeroSSL**：需要添加 **CNAME** 记录
- **Let's Encrypt / Google**：需要添加 **TXT** 记录

点击"复制"按钮，将主机名和解析值复制到您的域名服务商 DNS 控制台。

### 6. 验证证书

1. 等待 3-5 分钟让 DNS 解析生效
2. 点击"验证DNS解析"检查解析是否生效
3. 点击"验证状态"查询证书签发状态
4. 验证成功后，点击"查看证书信息"查看完整证书内容
5. 点击"下载ZIP压缩包"下载证书文件

## 🔌 API 接口说明

### 1. 创建证书

- **接口**: `POST /api/v1/create`
- **参数**: 
  - `api_key` (query): API密钥
  - `channel_type` (form-data): 证书品牌（zerossl/letsencrypt/google）
  - `certificate_domain` (form-data): 域名
  - `validation_method` (form-data): DNS

### 2. 验证状态

- **接口**: `GET /api/v1/verify`
- **参数**: 
  - `api_key` (query): API密钥
  - `domain` (query): 域名
- **说明**: DNS解析后等待3-5分钟左右请求验证即可

### 3. 删除域名

- **接口**: `GET /api/v1/delete`
- **参数**: 
  - `api_key` (query): API密钥
  - `domain` (query): 域名

### 4. 证书信息

- **接口**: `GET /api/v1/get_info`
- **参数**: 
  - `api_key` (query): API密钥
  - `domain` (query): 域名
- **返回**: 包含证书内容（crt_pem）、私钥（crt_key）、证书链（crt_bundle）、下载链接等

### 5. 本地验证解析状态

- **接口**: `POST /api/v1/dns_query`
- **参数**: 
  - `api_key` (query): API密钥
  - `queryValue` (form-data): 完整的验证URL
  - `queryType` (form-data): 验证方式（A/CNAME/TXT）

## 📚 API 文档

- [创建证书](https://ssl.aa1.cn/404246453e0.md)
- [验证状态](https://ssl.aa1.cn/404314821e0.md)
- [删除域名](https://ssl.aa1.cn/404352651e0.md)
- [证书信息](https://ssl.aa1.cn/404452917e0.md)
- [本地验证解析状态](https://ssl.aa1.cn/404465479e0.md)

## 🎯 证书品牌说明

### ZeroSSL
- **记录方式**: CNAME
- **验证速度**: 较快 ⚡
- **推荐指数**: ⭐⭐⭐⭐⭐
- **适用场景**: 快速申请，推荐优先选择

### Let's Encrypt
- **记录方式**: TXT
- **验证速度**: 相对较慢
- **推荐指数**: ⭐⭐⭐⭐
- **适用场景**: 免费证书，社区认可度高

### Google
- **记录方式**: TXT
- **验证速度**: 耗时较长
- **推荐指数**: ⭐⭐⭐
- **适用场景**: Google 生态相关项目

## ⚠️ 注意事项

1. **API 密钥安全**
   - API 密钥仅通过环境变量配置，不会在前端代码中暴露
   - 生产环境部署时，请确保 `.env` 文件不被提交到代码仓库
   - 建议使用环境变量管理工具（如 Docker secrets、Kubernetes secrets 等）

2. **DNS 解析**
   - DNS 解析通常需要 3-5 分钟才能生效，部分 DNS 服务商可能需要更长时间
   - 建议使用权威 DNS 服务商（如 Cloudflare、阿里云 DNS 等）以获得更快的解析速度

3. **证书有效期**
   - ZeroSSL 证书有效期为 90 天
   - Let's Encrypt 证书有效期为 90 天
   - Google 证书有效期根据具体类型而定
   - 建议设置自动续期提醒

4. **本地存储**
   - 证书列表保存在浏览器本地存储（localStorage）中
   - 清除浏览器数据会导致证书列表丢失
   - 建议定期备份重要证书信息

## 📁 项目结构

```
ssl/
├── src/
│   ├── api/
│   │   └── ssl.js              # API 接口封装
│   ├── config/
│   │   └── api.js              # API 配置（读取环境变量）
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── views/
│   │   └── Home.vue            # 主页面组件
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── index.html                  # HTML 模板
├── vite.config.js             # Vite 配置
├── package.json               # 项目依赖
├── .env                       # 环境变量（需自行创建）
├── .env.example               # 环境变量模板
└── README.md                  # 项目说明文档
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [API 文档](https://ssl.aa1.cn/)
- [获取 API 密钥](https://ssl.aa1.cn/user/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Arco Design Vue 文档](https://arco.design/vue/docs/start)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
