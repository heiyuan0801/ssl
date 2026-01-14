import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 解决开发环境 CORS：前端请求 /api/* -> 代理到 https://ssl.aa1.cn/api/*
      '/api': {
        target: 'https://ssl.aa1.cn',
        changeOrigin: true,
        secure: true
      }
    }
  }
})

