import axios from 'axios'
import { API_CONFIG } from '@/config/api'

// API基础URL - 根据实际API地址修改
// 创建axios实例
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  // 申请证书接口可能比较慢，524 也常见（上游超时），这里放宽超时
  timeout: 120000
})

// 确保每次请求都读取最新的 BASE_URL（配合 Vite HMR / 环境变量切换）
api.interceptors.request.use((config) => {
  config.baseURL = API_CONFIG.BASE_URL
  return config
})

function toFormData(obj) {
  const fd = new FormData()
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, String(v))
  })
  return fd
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function requestWithRetry(fn, { retries = 2, baseDelayMs = 800 } = {}) {
  let lastErr
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const status = err?.response?.status
      // 524/502/503/504：上游/网关超时或抖动，适合重试
      const retryable = status === 524 || status === 502 || status === 503 || status === 504
      if (!retryable || i === retries) break
      await sleep(baseDelayMs * Math.pow(2, i))
    }
  }
  throw lastErr
}

function getApiKey (overrideKey) {
  return overrideKey || API_CONFIG.API_KEY || ''
}

/**
 * 创建证书
 * @param {string} domain - 域名
 * @param {string} [apiKey] - API密钥（不传则使用环境变量中的密钥）
 * @param {object} options - 可选参数
 * @param {'zerossl'|'google'|'letsencrypt'} options.channelType
 * @returns {Promise}
 */
export const createCertificate = (domain, apiKey, options = {}) => {
  const channelType = options.channelType || 'zerossl'
  const key = getApiKey(apiKey)
  return requestWithRetry(
    () =>
      api.post(
        '/v1/create',
        toFormData({
          channel_type: channelType,
          certificate_domain: domain,
          validation_method: 'DNS'
        }),
        { params: { api_key: key } }
      ),
    { retries: 2, baseDelayMs: 800 }
  )
}

/**
 * 验证状态
 * @param {string} domain - 域名
 * @param {string} [apiKey] - API密钥
 * @returns {Promise}
 */
export const verifyStatus = (domain, apiKey) => {
  const key = getApiKey(apiKey)
  return api.get('/v1/verify', {
    params: {
      api_key: key,
      domain
    }
  })
}

/**
 * 删除域名
 * @param {string} domain - 域名
 * @param {string} [apiKey] - API密钥
 * @returns {Promise}
 */
export const deleteDomain = (domain, apiKey) => {
  const key = getApiKey(apiKey)
  return api.get('/v1/delete', {
    params: {
      api_key: key,
      domain
    }
  })
}

/**
 * 获取证书信息
 * @param {string} domain - 域名
 * @param {string} [apiKey] - API密钥
 * @returns {Promise}
 */
export const getCertificateInfo = (domain, apiKey) => {
  const key = getApiKey(apiKey)
  return api.get('/v1/get_info', {
    params: {
      api_key: key,
      domain
    }
  })
}

/**
 * 本地验证解析状态
 * @param {string} domain - 域名
 * @param {string} [apiKey] - API密钥
 * @param {'zerossl'|'google'|'letsencrypt'} [channelType]
 * @returns {Promise}
 */
export const verifyDnsStatus = (domain, apiKey, channelType) => {
  const key = getApiKey(apiKey)
  const type = channelType === 'zerossl' ? 'CNAME' : 'TXT'
  return api.post(
    '/v1/dns_query',
    toFormData({
      queryValue: domain,
      queryType: type
    }),
    {
      params: { api_key: key }
    }
  )
}

export default api

