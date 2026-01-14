# 验证状态

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/verify:
    get:
      summary: 验证状态
      deprecated: false
      description: 验证接口，解析后等待3-5分钟左右请求验证即可
      tags: []
      parameters:
        - name: api_key
          in: query
          description: 平台密钥
          required: true
          example: ''
          schema:
            type: string
        - name: domain
          in: query
          description: 需要验证的证书域名
          required: true
          example: 77.aa1.cn
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties: {}
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                success: false
                message: '证书验证失败，请联系管理员QQ：15001904 '
                data:
                  domain: 22.aa1.cn
                  verification_status: 2
                  last_verified_at: '2026-01-13 10:38:09'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: ''
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7697463/apis/api-404314821-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```
# 删除域名

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/delete:
    get:
      summary: 删除域名
      deprecated: false
      description: 删除域名及域名对应的证书信息（如果已签发）
      tags: []
      parameters:
        - name: api_key
          in: query
          description: 平台密钥
          required: true
          schema:
            type: string
        - name: domain
          in: query
          description: 需要删除的证书域名
          required: true
          example: qq.com
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties: {}
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: ''
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7697463/apis/api-404352651-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```
# 证书信息

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/get_info:
    get:
      summary: 证书信息
      deprecated: false
      description: ''
      tags: []
      parameters:
        - name: domain
          in: query
          description: ''
          required: false
          example: 29.aa1.cn
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties: {}
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                success: true
                data:
                  domain: 29.aa1.cn
                  certificate_no: 021924406965bd7fe9b2f
                  channel_type: zerossl
                  validation_method: DNS
                  validity_days: '90'
                  expiration_date: '2026-04-13 23:59:59'
                  validation_status: '1'
                  last_verified_at: '2026-01-13 11:38:02'
                  verification_count: '3'
                  download_url: /download/29.aa1.cn_1lnfip.zip
                  created_at: '2026-01-13 11:35:40'
                  has_certificate_content: true
                  has_private_key: true
                  has_bundle: true
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: ''
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7697463/apis/api-404452917-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```
# 本地验证解析状态

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/dns_query:
    post:
      summary: 本地验证解析状态
      deprecated: false
      description: ''
      tags: []
      parameters:
        - name: api_key
          in: query
          description: 平台密钥
          required: false
          example: sk_782ec66f3987a91b79af2b9547933521
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                queryValue:
                  description: 完整的url
                  example: ''
                  type: string
                queryType:
                  description: 验证方式：A，CNAME，TXT
                  example: TXT
                  type: string
              required:
                - queryValue
                - queryType
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: ''
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7697463/apis/api-404465479-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```
https://ssl.aa1.cn/api/v1/get_info?domain=ssl.iyuns.com&api_key=sk_306c2c137d962233ffaa8f04b40c1b7d
{
  "success": true,
  "data": {
    "crt_pem": "-----BEGIN CERTIFICATE-----\n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\nMyugyQ==\n-----END CERTIFICATE-----\n",
    "crt_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0MePranLBpk9q\nZXbR7lSvZdkDg2bixqVEbJtJ6yQz/HHgrOR05610NFSaZFX760FtwVT3mrLe5Rtc\nxiQdpW779yXl41y5660w91Wkayt2ZyIcFVXav5rYWYWIGFk5CTHTi7EkgckjzrCa\nkpjKpS6UwtLTPbhqKQToEg+w5N80+uYyFJVybAKOV6pWF1fyAT+hSH7YX99HBh4b\nIswoPCKNZeCHBghbdVv9DfgETj5yDJOT2YbXhDKIVwuHdKRazmqgJTM8O+JqqL9A\ne0Ve6TRzFa1DnodoE1F8VQvx4B5RDYKfg2nN60qJ5LLXrUe69iMoUaUjmRSgsQVu\nq5Al85jdAgMBAAECggEAYZBRs3kjQS5m+ViOiQPd3knqwjg3ULn1aaLUQaWLKIqa\nredums2F4NEkraN92rR57I8tDhM4ne62bfjqPRMBkHM0ldAQuKmeUFDakfdkxOr6\nUPJMVfBASrvNzO5CANu1mrCb7QRIf5a9kDOnfrEJE4qY078rRm+HNI/y5vhE0k3M\n+xUN3TACDW9bQNfAAWIgyPuJhYceW7HHqzJrRr5BPKX/eCJpFpPyVqbFZQV3pZ+u\nbhWrZzwh2FGmHdp9NmgTo+XFojedWGmB9Y9pgmjRHVq4NT8Zj8+iOR/um5PfKT0g\ngtOKPePAySwrd7VmJA+2gDiiaeKVAaochKCkm/HhAQKBgQDs4AweyFWFsjU55IN7\n0KCkTs5kdh41I0VXke0Z7en68ef91kaO7/yfitJdTtQQCHLp2VqWF3Hsn2EQJQja\nbjDDpCMTSqUkotpFcAJI5b4gpEB3c8cx4AYhfk4HN5sS/kcIjEsz0nRPOz+K8Hla\nk0Xoc4yTwIA2CNYtAYxuNMimTQKBgQDCvlKfOQIl9TO4YqpGyBqcOSMit1NTmlRy\naFqsplrBK0wL+I/oSRC5mXFlPIMuIWb1fz/f8sdDXgNL/RiRnZ85hqHfPnUuuxah\n/dPd9QoJzrCT+d0OfaAIE3t2dfk+P/Uvei9Qm6Q9ncvDa5GOuIrluDXMI23V7xlk\n29d4FEUk0QKBgBnW0tukxNeBuhanm8Qs3Okvg4on7GGliFHmJDQY5NYv/zuMXUQI\nX8lTjmEJUU6ybT6fLCeFRTMnq6HkOFQDgyRESmM3WE5nyWGbt1QWY6gR4splAcyq\nAGE08vQMl8j5newLycRMZ82gy+yvEL3VpOGXgTU44YODcUGVkqkO7vhdAoGAP1Hc\n0XKa1Ta1+2TxUpRrupIFb5tGF6/dd1mg6fQpHBf04QuP1woyyvYuXalgSdaIgJhA\nb5Oj4K6nycRggbBLfkvdRBYtyeUBBejfQ5MSEYBH/8VFcBm+uAGFqk3PncLz+Nz0\nl3QT4gj1oPPP3yT33JuZumdmpiHZEuc8VwnYNZECgYEAnuQxwhFPouXkN6xPJCY/\nFeDG2zoGP59SV5ySjpdPlYsLuxrpbiWF1/J0BtBDfbrmarir1hW49ywt3opqqQqf\nnGGN6jEswZhZ/gDID85qQ8GRymf47Gca2OxtHLUPbXJjOUwouyxmkXfr9PMKYqS5\nqajt7gDBeBxPVqS/6I4ICQ8=\n-----END PRIVATE KEY-----\n",
    "crt_bundle": "-----BEGIN CERTIFICATE-----\nMIIG1TCCBL2gAwIBAgIQbFWr29AHksedBwzYEZ7WvzANBgkqhkiG9w0BAQwFADCB\niDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCk5ldyBKZXJzZXkxFDASBgNVBAcTC0pl\ncnNleSBDaXR5MR4wHAYDVQQKExVUaGUgVVNFUlRSVVNUIE5ldHdvcmsxLjAsBgNV\nBAMTJVVTRVJUcnVzdCBSU0EgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMjAw\nMTMwMDAwMDAwWhcNMzAwMTI5MjM1OTU5WjBLMQswCQYDVQQGEwJBVDEQMA4GA1UE\nChMHWmVyb1NTTDEqMCgGA1UEAxMhWmVyb1NTTCBSU0EgRG9tYWluIFNlY3VyZSBT\naXRlIENBMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAhmlzfqO1Mdgj\n4W3dpBPTVBX1AuvcAyG1fl0dUnw/MeueCWzRWTheZ35LVo91kLI3DDVaZKW+TBAs\nJBjEbYmMwcWSTWYCg5334SF0+ctDAsFxsX+rTDh9kSrG/4mp6OShubLaEIUJiZo4\nt873TuSd0Wj5DWt3DtpAG8T35l/v+xrN8ub8PSSoX5Vkgw+jWf4KQtNvUFLDq8mF\nWhUnPL6jHAADXpvs4lTNYwOtx9yQtbpxwSt7QJY1+ICrmRJB6BuKRt/jfDJF9Jsc\nRQVlHIxQdKAJl7oaVnXgDkqtk2qddd3kCDXd74gv813G91z7CjsGyJ93oJIlNS3U\ngFbD6V54JMgZ3rSmotYbz98oZxX7MKbtCm1aJ/q+hTv2YK1yMxrnfcieKmOYBbFD\nhnW5O6RMA703dBK92j6XRN2EttLkQuujZgy+jXRKtaWMIlkNkWJmOiHmErQngHvt\niNkIcjJumq1ddFX4iaTI40a6zgvIBtxFeDs2RfcaH73er7ctNUUqgQT5rFgJhMmF\nx76rQgB5OZUkodb5k2ex7P+Gu4J86bS15094UuYcV09hVeknmTh5Ex9CBKipLS2W\n2wKBakf+aVYnNCU6S0nASqt2xrZpGC1v7v6DhuepyyJtn3qSV2PoBiU5Sql+aARp\nwUibQMGm44gjyNDqDlVp+ShLQlUH9x8CAwEAAaOCAXUwggFxMB8GA1UdIwQYMBaA\nFFN5v1qqK0rPVIDh2JvAnfKyA2bLMB0GA1UdDgQWBBTI2XhootkZaNU9ct5fCj7c\ntYaGpjAOBgNVHQ8BAf8EBAMCAYYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHSUE\nFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwIgYDVR0gBBswGTANBgsrBgEEAbIxAQIC\nTjAIBgZngQwBAgEwUAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC51c2VydHJ1\nc3QuY29tL1VTRVJUcnVzdFJTQUNlcnRpZmljYXRpb25BdXRob3JpdHkuY3JsMHYG\nCCsGAQUFBwEBBGowaDA/BggrBgEFBQcwAoYzaHR0cDovL2NydC51c2VydHJ1c3Qu\nY29tL1VTRVJUcnVzdFJTQUFkZFRydXN0Q0EuY3J0MCUGCCsGAQUFBzABhhlodHRw\nOi8vb2NzcC51c2VydHJ1c3QuY29tMA0GCSqGSIb3DQEBDAUAA4ICAQAVDwoIzQDV\nercT0eYqZjBNJ8VNWwVFlQOtZERqn5iWnEVaLZZdzxlbvz2Fx0ExUNuUEgYkIVM4\nYocKkCQ7hO5noicoq/DrEYH5IuNcuW1I8JJZ9DLuB1fYvIHlZ2JG46iNbVKA3ygA\nEz86RvDQlt2C494qqPVItRjrz9YlJEGT0DrttyApq0YLFDzf+Z1pkMhh7c+7fXeJ\nqmIhfJpduKc8HEQkYQQShen426S3H0JrIAbKcBCiyYFuOhfyvuwVCFDfFvrjADjd\n4jX1uQXd161IyFRbm89s2Oj5oU1wDYz5sx+hoCuh6lSs+/uPuWomIq3y1GDFNafW\n+LsHBU16lQo5Q2yh25laQsKRgyPmMpHJ98edm6y2sHUabASmRHxvGiuwwE25aDU0\n2SAeepyImJ2CzB80YG7WxlynHqNhpE7xfC7PzQlLgmfEHdU+tHFeQazRQnrFkW2W\nkqRGIq7cKRnyypvjPMkjeiV9lRdAM9fSJvsB3svUuu1coIG1xxI1yegoGM4r5QP4\nRGIVvYaiI76C0djoSbQ/dkIUUXQuB8AL5jyH34g3BZaaXyvpmnV4ilppMXVAnAYG\nON51WhJ6W0xNdNJwzYASZYH+tmCWI+N60Gv2NNMGHwMZ7e9bXgzUCZH5FaBFDGR5\nS9VWqHB73Q+OyIVvIbKYcSc2w/aSuFKGSA==\n-----END CERTIFICATE-----\n",
    "download_url": "https://ssl.aa1.cn/download/ssl.iyuns.com_thdlmz.zip",
    "domain": "ssl.iyuns.com",
    "certificate_no": "6131719469679019a24fa"
  },
  "meta": {
    "attempts": 1,
    "auto_verified": false
  }
}