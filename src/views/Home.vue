<template>
  <div class="home-container">
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header">
        <div class="header-content">
          <h1 class="logo">零九cdn免费SSL证书申请系统</h1>
          <div class="header-actions">
            <a-link href="https://09cdn.com" target="_blank">
              <template #icon>
                <icon-key />
              </template>
              零九cdn
            </a-link>
          </div>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <a-spin :loading="pageLoading" tip="处理中，请稍候…" class="page-spin">
          <div class="content-wrapper">
          <!-- 申请证书卡片 -->
          <a-card class="apply-card" :bordered="true">
            <template #title>
              <div class="card-title">
                <icon-plus-circle />
                <span>申请新证书</span>
              </div>
            </template>
            <a-form
              :model="formData"
              :rules="rules"
              ref="formRef"
              @submit="handleSubmit"
              layout="vertical"
            >
              <a-form-item label="证书品牌" field="channelType">
                <a-select
                  v-model="formData.channelType"
                  placeholder="请选择证书品牌"
                  allow-clear
                >
                  <a-option value="zerossl">ZeroSSL（推荐，记录方式：CNAME，速度较快）</a-option>
                  <a-option value="letsencrypt">Let&apos;s Encrypt（记录方式：TXT，验证较慢）</a-option>
                  <a-option value="google">Google（记录方式：TXT，验证耗时较长）</a-option>
                </a-select>
                <template #extra>
                  <span class="form-tip">{{ getChannelTip(formData.channelType) }}</span>
                </template>
              </a-form-item>

              <a-form-item label="域名" field="domain">
                <a-input
                  v-model="formData.domain"
                  placeholder="请输入域名，例如：example.com"
                  allow-clear
                >
                  <template #prefix>
                    <icon-link />
                  </template>
                </a-input>
                <template #extra>
                  <span class="form-tip">支持主域名和子域名</span>
                </template>
              </a-form-item>

              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="submitting"
                  long
                  size="large"
                >
                  <template #icon>
                    <icon-check-circle />
                  </template>
                  提交申请
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>

          <!-- 证书列表 -->
          <a-card class="cert-list-card" :bordered="true">
            <template #title>
              <div class="card-title">
                <icon-list />
                <span>我的证书列表</span>
              </div>
            </template>
            <template #extra>
              <a-button
                type="text"
                @click="refreshList"
                :loading="loading"
              >
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
            </template>

            <a-empty v-if="certList.length === 0 && !loading" description="暂无证书，请先申请" />

            <a-list
              v-else
              :data="certList"
              :loading="loading"
              :pagination="false"
            >
              <template #item="{ item }">
                <a-list-item class="cert-item">
                  <a-list-item-meta>
                    <template #title>
                      <div class="cert-domain">
                        <icon-link />
                        <span>{{ item.domain }}</span>
                        <a-tag
                          :color="getStatusColor(item.status)"
                          class="status-tag"
                        >
                          {{ getStatusText(item.status) }}
                        </a-tag>
                      </div>
                    </template>
                    <template #description>
                      <div class="cert-info">
                        <div v-if="item.dnsRecord" class="dns-info">
                          <a-alert
                            type="info"
                            :closable="false"
                            style="margin-bottom: 12px"
                          >
                            <template #title>DNS解析记录</template>
                            <div class="dns-record">
                              <div class="dns-record-line">
                                <div><strong>类型：</strong>{{ getDnsRecordType(item) }}</div>
                              </div>
                              <div class="dns-record-line">
                                <div><strong>主机：</strong>{{ item.dnsRecord.host }}</div>
                                <a-button
                                  type="text"
                                  size="small"
                                  @click="copyToClipboard(item.dnsRecord.host, '主机记录')"
                                >
                                  复制
                                </a-button>
                              </div>
                              <div class="dns-record-line">
                                <div><strong>值：</strong>{{ item.dnsRecord.value }}</div>
                                <a-button
                                  type="text"
                                  size="small"
                                  @click="copyToClipboard(item.dnsRecord.value, '记录值')"
                                >
                                  复制
                                </a-button>
                              </div>
                              <div class="dns-hint">
                                {{ getChannelDnsHint(item) }}
                              </div>
                            </div>
                          </a-alert>
                        </div>
                        <div v-if="item.certInfo" class="cert-details">
                          <div><strong>颁发机构：</strong>{{ item.certInfo.issuer || '-' }}</div>
                          <div><strong>有效期至：</strong>{{ item.certInfo.expireTime || '-' }}</div>
                          <div><strong>申请时间：</strong>{{ item.createTime || '-' }}</div>
                        </div>
                      </div>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-dropdown>
                      <a-button type="text" size="small">
                        <template #icon>
                          <icon-more />
                        </template>
                      </a-button>
                      <template #content>
                        <a-doption
                          @click="handleVerifyStatus(item)"
                          :disabled="item.status === 'verified'"
                        >
                          <template #icon>
                            <icon-check-circle />
                          </template>
                          验证状态
                        </a-doption>
                        <a-doption
                          @click="handleVerifyDns(item)"
                        >
                          <template #icon>
                            <icon-search />
                          </template>
                          验证DNS解析
                        </a-doption>
                        <a-doption
                          @click="handleGetInfo(item)"
                        >
                          <template #icon>
                            <icon-info-circle />
                          </template>
                          查看证书信息
                        </a-doption>
                        <a-doption
                          @click="handleDelete(item)"
                          class="danger-option"
                        >
                          <template #icon>
                            <icon-delete />
                          </template>
                          删除域名
                        </a-doption>
                      </template>
                    </a-dropdown>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
          </div>
        </a-spin>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer class="footer">
        <div class="footer-content">
          <p>免费SSL证书 | 地址：<a-link href="https://ssl.aa1.cn/" target="_blank">感谢夏柔免费提供ssl证书</a-link></p>
          <p>零九cdn | 地址：<a-link href="https://09cdn.com" target="_blank">作者主页</a-link></p>
        </div>
      </a-layout-footer>
    </a-layout>

    <!-- 证书详情模态框 -->
    <a-modal
      v-model:visible="certInfoVisible"
      title="证书详细信息"
      :footer="false"
      width="900px"
    >
      <a-descriptions
        :data="certInfoData"
        :column="2"
        bordered
        size="small"
        style="margin-bottom: 16px"
      />

      <a-tabs type="card">
        <a-tab-pane key="cert" title="证书 (crt_pem)">
          <a-space direction="vertical" fill>
            <a-space justify="space-between" align="center">
              <span>证书内容（用于 Nginx / Apache 等服务器配置）</span>
              <a-button
                type="primary"
                size="small"
                @click="copyToClipboard(certContent.crtPem, '证书内容')"
              >
                复制证书
              </a-button>
            </a-space>
            <a-textarea
              v-model="certContent.crtPem"
              :auto-size="{ minRows: 8, maxRows: 20 }"
              readonly
            />
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="key" title="私钥 (crt_key)">
          <a-space direction="vertical" fill>
            <a-space justify="space-between" align="center">
              <span>私钥内容（请妥善保管，不要泄露）</span>
              <a-button
                type="primary"
                size="small"
                @click="copyToClipboard(certContent.crtKey, '私钥内容')"
              >
                复制私钥
              </a-button>
            </a-space>
            <a-textarea
              v-model="certContent.crtKey"
              :auto-size="{ minRows: 8, maxRows: 20 }"
              readonly
            />
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="bundle" title="链证书 (crt_bundle)">
          <a-space direction="vertical" fill>
            <a-space justify="space-between" align="center">
              <span>证书链内容（某些环境需要一起配置）</span>
              <a-button
                type="primary"
                size="small"
                @click="copyToClipboard(certContent.crtBundle, '证书链内容')"
              >
                复制证书链
              </a-button>
            </a-space>
            <a-textarea
              v-model="certContent.crtBundle"
              :auto-size="{ minRows: 8, maxRows: 20 }"
              readonly
            />
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="download" title="一键下载">
          <a-result
            status="success"
            title="证书打包下载"
            :sub-title="certContent.downloadUrl ? '点击下面按钮可下载包含证书、私钥、链证书的ZIP文件' : '当前接口未返回下载链接'"
          >
            <template #extra>
              <a-button
                type="primary"
                :disabled="!certContent.downloadUrl"
                @click="openDownload(certContent.downloadUrl)"
              >
                下载ZIP压缩包
              </a-button>
            </template>
          </a-result>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Message,
  Modal,
  Notification
} from '@arco-design/web-vue'
import {
  createCertificate,
  verifyStatus,
  deleteDomain,
  getCertificateInfo,
  verifyDnsStatus
} from '@/api/ssl'
import { API_CONFIG } from '@/config/api'

// 表单数据（apiKey 仅在内部使用，不在界面展示）
const formData = reactive({
  apiKey: '',
  domain: '',
  channelType: 'zerossl'
})

// 表单引用
const formRef = ref(null)

// 表单验证规则
const rules = {
  channelType: [
    { required: true, message: '请选择证书品牌' }
  ],
  domain: [
    { required: true, message: '请输入域名' },
    {
      pattern: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      message: '请输入正确的域名格式'
    }
  ]
}

// 状态
const submitting = ref(false)
const loading = ref(false)
const certList = ref([])
const certInfoVisible = ref(false)
const certInfoData = ref([])
const certContent = ref({
  crtPem: '',
  crtKey: '',
  crtBundle: '',
  downloadUrl: ''
})
const pageLoading = ref(false)

// 从环境变量/API配置加载API密钥（不在前端展示或编辑）
onMounted(() => {
  if (API_CONFIG.API_KEY) {
    formData.apiKey = API_CONFIG.API_KEY
  } else {
    Notification.warning({
      title: '缺少API密钥',
      content: '未从环境变量读取到 VITE_API_KEY。请在项目根目录创建/修改 .env，设置 VITE_API_KEY=你的密钥，并重启 npm run dev。',
      duration: 10000
    })
  }
  loadCertList()
})

// 加载证书列表
const loadCertList = () => {
  const savedList = localStorage.getItem('ssl_cert_list')
  if (savedList) {
    try {
      certList.value = JSON.parse(savedList)
    } catch (e) {
      console.error('加载证书列表失败', e)
    }
  }
}

// 保存证书列表
const saveCertList = () => {
  localStorage.setItem('ssl_cert_list', JSON.stringify(certList.value))
}

// 提交申请
const handleSubmit = async () => {
  try {
    if (!formRef.value) {
      Message.error('表单未初始化，请刷新页面重试')
      return
    }

    // Arco Form: validate() 校验通过时返回 undefined；有错误时返回错误信息
    const errors = await formRef.value.validate()
    if (errors) {
      Message.error('请检查表单填写是否正确')
      return
    }

    submitting.value = true
    pageLoading.value = true
    Message.info('正在提交申请，接口可能需要 30-120 秒响应，请耐心等待…')

    const response = await createCertificate(formData.domain, formData.apiKey, {
      channelType: formData.channelType
    })
    
    // 兼容不同返回结构：有的返回 code=200，有的直接 success=true，或 code 为其他业务码（如 2003=证书已存在）
    const ok =
      response?.status === 200 &&
      (response?.data?.success === true || response?.data?.code === 200 || response?.data?.status === 'success')

    if (ok) {
      const data = response.data?.data || {}

      // 根据 validation_status 映射本地状态：2/\"2\" 视为已签发，其它为待验证
      const validationStatus = String(data.validation_status ?? '')
      const mappedStatus = validationStatus === '2' ? 'verified' : 'pending'

      // 从 verify_info 中提取 DNS 解析信息
      let dnsRecord = null
      if (Array.isArray(data.verify_info) && data.verify_info.length > 0) {
        const info = data.verify_info[0]
        dnsRecord = {
          type: 'TXT',
          host: info.authKey || '',
          value: info.authValue || ''
        }
      }

      const certData = {
        domain: data.domain || formData.domain,
        status: mappedStatus,
        dnsRecord,
        createTime: data.created_at || new Date().toLocaleString('zh-CN'),
        ...data
      }

      // 检查是否已存在
      const index = certList.value.findIndex(item => item.domain === formData.domain)
      if (index >= 0) {
        certList.value[index] = certData
      } else {
        certList.value.unshift(certData)
      }

      saveCertList()

      // 根据业务码给出更友好的提示
      if (String(response.data?.code) === '2003') {
        Message.success('证书已存在，已为您加载最新证书信息')
      } else {
        Message.success('证书申请成功！请按照DNS解析记录配置DNS，等待3-5分钟后点击"验证状态"')
      }
      
      // 清空域名输入
      formData.domain = ''
    } else {
      Notification.error({
        title: '申请失败',
        content: response?.data?.message || JSON.stringify(response?.data || {}, null, 2) || '申请失败，请检查API密钥和域名',
        duration: 8000
      })
    }
  } catch (error) {
    console.error('申请证书失败', error)
    Notification.error({
      title: '申请证书失败',
      content:
        error.response?.data?.message ||
        (error.response?.status ? `HTTP ${error.response.status}：请求超时或上游繁忙，请稍后重试` : '') ||
        error.message ||
        '申请失败，请稍后重试',
      duration: 8000
    })
  } finally {
    submitting.value = false
    pageLoading.value = false
  }
}

// 验证状态
const handleVerifyStatus = async (item) => {
  try {
    loading.value = true
    pageLoading.value = true
    const response = await verifyStatus(item.domain, formData.apiKey)
    
    const ok = response?.status === 200 && (response?.data?.code === 200 || response?.data?.success === true)
    if (ok) {
      const data = response.data.data || {}
      item.status = data.status || 'verified'
      item.certInfo = data.certInfo || item.certInfo
      
      saveCertList()
      
      if (item.status === 'verified') {
        Message.success('证书验证成功！')
      } else {
        Message.warning('证书尚未签发，请稍后再试')
      }
    } else {
      Message.error(response.data?.message || '验证失败')
    }
  } catch (error) {
    console.error('验证状态失败', error)
    Message.error(error.response?.data?.message || '验证失败，请稍后重试')
  } finally {
    loading.value = false
    pageLoading.value = false
  }
}

// 验证DNS解析
const handleVerifyDns = async (item) => {
  try {
    loading.value = true
    pageLoading.value = true
    const response = await verifyDnsStatus(
      item.domain,
      formData.apiKey,
      item.channel_type || formData.channelType || 'zerossl'
    )
    
    const ok = response?.status === 200 && (response?.data?.code === 200 || response?.data?.success === true)
    if (ok) {
      const data = response.data.data || {}
      if (data.verified) {
        Message.success('DNS解析验证成功！')
      } else {
        Message.warning('DNS解析尚未生效，请等待DNS传播（通常需要3-5分钟）')
      }
    } else {
      Message.error(response.data?.message || 'DNS验证失败')
    }
  } catch (error) {
    console.error('验证DNS失败', error)
    Message.error(error.response?.data?.message || 'DNS验证失败，请稍后重试')
  } finally {
    loading.value = false
    pageLoading.value = false
  }
}

// 获取证书信息
const handleGetInfo = async (item) => {
  try {
    loading.value = true
    pageLoading.value = true
    const response = await getCertificateInfo(item.domain, formData.apiKey)
    
    const ok = response?.status === 200 && (response?.data?.code === 200 || response?.data?.success === true)
    if (ok) {
      const data = response.data.data || {}
      item.certInfo = data

      // 如果返回里带有 verify_info，也同步出 DNS 解析记录
      if (Array.isArray(data.verify_info) && data.verify_info.length > 0) {
        const info = data.verify_info[0]
        item.dnsRecord = {
          type: 'TXT',
          host: info.authKey || '',
          value: info.authValue || ''
        }
      }

      saveCertList()
      
      // 显示证书信息
      certInfoData.value = [
        { label: '域名', value: item.domain },
        { label: '状态', value: getStatusText(item.status) },
        { label: '品牌', value: data.channel_type || '-' },
        { label: '验证方式', value: data.validation_method || data.verify_method || 'DNS' },
        { label: '有效期至', value: data.expiration_date || data.expireTime || '-' },
        { label: '申请时间', value: data.created_at || item.createTime || '-' },
        { label: '证书编号', value: data.certificate_no || '-' },
        { label: '是否包含证书内容', value: data.has_certificate_content ? '是' : '否' },
        { label: '是否包含私钥', value: data.has_private_key ? '是' : '否' },
        { label: '是否包含链证书', value: data.has_bundle ? '是' : '否' }
      ]

      // 证书原始内容
      certContent.value = {
        crtPem: data.crt_pem || '',
        crtKey: data.crt_key || '',
        crtBundle: data.crt_bundle || '',
        downloadUrl: data.download_url || ''
      }
      
      certInfoVisible.value = true
    } else {
      Message.error(response.data?.message || '获取证书信息失败')
    }
  } catch (error) {
    console.error('获取证书信息失败', error)
    Message.error(error.response?.data?.message || '获取证书信息失败，请稍后重试')
  } finally {
    loading.value = false
    pageLoading.value = false
  }
}

// 删除域名
const handleDelete = (item) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除域名 "${item.domain}" 及其证书信息吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        loading.value = true
        pageLoading.value = true
        const response = await deleteDomain(item.domain, formData.apiKey)
        
        const ok = response?.status === 200 && (response?.data?.code === 200 || response?.data?.success === true)
        if (ok) {
          const index = certList.value.findIndex(cert => cert.domain === item.domain)
          if (index >= 0) {
            certList.value.splice(index, 1)
            saveCertList()
          }
          Message.success('删除成功')
        } else {
          Message.error(response.data?.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败', error)
        Message.error(error.response?.data?.message || '删除失败，请稍后重试')
      } finally {
        loading.value = false
        pageLoading.value = false
      }
    }
  })
}

// 刷新列表
const refreshList = () => {
  loadCertList()
  Message.success('已刷新')
}

// 证书品牌提示
const getChannelTip = (channel) => {
  switch (channel) {
    case 'zerossl':
      return 'ZeroSSL：记录方式 CNAME，验证速度较快，推荐优先选择'
    case 'letsencrypt':
      return 'Let\'s Encrypt：记录方式 TXT，验证速度相对较慢'
    case 'google':
      return 'Google：记录方式 TXT，验证耗时较长'
    default:
      return '请选择证书品牌，推荐 ZeroSSL'
  }
}

// DNS 记录展示类型
const getDnsRecordType = (item) => {
  const ch = item.channel_type || item.channelType
  if (ch === 'zerossl') return 'CNAME'
  if (ch === 'letsencrypt' || ch === 'google') return 'TXT'
  return item.dnsRecord?.type || 'TXT'
}

// 根据品牌给出解析提示
const getChannelDnsHint = (item) => {
  const ch = item.channel_type || item.channelType || formData.channelType
  const recordType = getDnsRecordType(item)
  if (!item.dnsRecord) return ''

  if (ch === 'zerossl') {
    return `在域名服务商中添加一条 ${recordType} 记录：主机=${item.dnsRecord.host}，值=${item.dnsRecord.value}`
  }
  if (ch === 'letsencrypt') {
    return `在域名服务商中添加一条 ${recordType} 记录：主机=${item.dnsRecord.host}，值=${item.dnsRecord.value}，验证可能需要数分钟`
  }
  if (ch === 'google') {
    return `在域名服务商中添加一条 ${recordType} 记录：主机=${item.dnsRecord.host}，值=${item.dnsRecord.value}，验证耗时较长，请耐心等待`
  }
  return `在域名服务商中添加一条 ${recordType} 记录：主机=${item.dnsRecord.host}，值=${item.dnsRecord.value}`
}

// 复制到剪贴板
const copyToClipboard = async (text, label) => {
  if (!text) {
    Message.warning(`${label}为空，无法复制`)
    return
  }
  try {
    await navigator.clipboard.writeText(text)
    Message.success(`${label}已复制`)
  } catch (e) {
    console.error('复制失败', e)
    Message.error('复制失败，请手动选中复制')
  }
}

// 打开下载链接
const openDownload = (url) => {
  if (!url) {
    Message.warning('当前证书暂未提供下载链接')
    return
  }
  window.open(url, '_blank')
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    pending: 'orange',
    verifying: 'blue',
    verified: 'green',
    failed: 'red'
  }
  return colorMap[status] || 'gray'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待验证',
    verifying: '验证中',
    verified: '已签发',
    failed: '失败'
  }
  return textMap[status] || '未知'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #165dff;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.content {
  padding: 24px;
  min-height: calc(100vh - 64px - 60px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-spin {
  width: 100%;
}

:deep(.page-spin > .arco-spin-mask) {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

:deep(.page-spin > .arco-spin) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
}

.apply-card,
.cert-list-card {
  margin-bottom: 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.form-tip {
  color: #86909c;
  font-size: 12px;
}

.cert-item {
  padding: 16px 0;
  border-bottom: 1px solid #f2f3f5;
}

.cert-item:last-child {
  border-bottom: none;
}

.cert-domain {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.status-tag {
  margin-left: 8px;
}

.cert-info {
  margin-top: 8px;
}

.dns-info {
  margin-bottom: 12px;
}

.dns-record {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.8;
}

.dns-record-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.dns-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #86909c;
}

.cert-details {
  font-size: 14px;
  color: #4e5969;
  line-height: 1.8;
}

.cert-details div {
  margin-bottom: 4px;
}

.danger-option {
  color: #f53f3f;
}

.footer {
  text-align: center;
  background: #fff;
  border-top: 1px solid #f2f3f5;
  padding: 16px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  color: #86909c;
  font-size: 14px;
}

:deep(.arco-card-body) {
  padding: 24px;
}

:deep(.arco-form-item-label) {
  font-weight: 500;
}
</style>

