// API配置
export const API_CONFIG = {
  /**
   * API基础URL
   * - 开发环境：建议使用 Vite 代理（/api）避免 CORS
   * - 生产环境：建议同样走反向代理（/api），或自行部署后端转发
   */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

  /**
   * 平台密钥
   * - 强烈建议只通过环境变量配置：VITE_API_KEY
   * - 前端页面不再展示或编辑密钥，如需更改请修改 .env 并重新构建
   */
  API_KEY: import.meta.env.VITE_API_KEY || ''
}

