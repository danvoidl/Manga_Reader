import FetchFactory from '../factory'
import type { IApiError } from '~/src/types/api'
import { config } from '~/src/config'
import { IAuth } from '~/src/types/auth'
import { myCache } from '~/src/cache'

class PostModule extends FetchFactory<any> {
  async login(): Promise<[null, IAuth] | [IApiError]> {
    const formData = new URLSearchParams()

    formData.set('grant_type', config.GRANT_TYPE || '')
    formData.set('username', config.USERNAME || '')
    formData.set('password', config.PASSWORD || '')
    formData.set('client_id', config.CLIENT_ID || '')
    formData.set('client_secret', config.CLIENT_SECRET || '')

    return this.call({
      method: 'POST',
      url: '/realms/mangadex/protocol/openid-connect/token',
      data: formData,
      fetchOptions: {
        baseURL: config.AUTH_BASE_URL,
      }
    })
  }

  async refreshToken(): Promise<[null, IAuth] | [IApiError]> {
    const formData = new URLSearchParams()

    formData.set('grant_type', config.GRANT_TYPE || '')
    formData.set('refresh_token', myCache.get('REFRESH_TOKEN') || '')
    formData.set('client_id', config.CLIENT_ID || '')
    formData.set('client_secret', config.CLIENT_SECRET || '')

    return this.call({
      method: 'POST',
      url: '/realms/mangadex/protocol/openid-connect/token',
      data: formData,
      fetchOptions: {
        baseURL: config.AUTH_BASE_URL,
      }
    })
  }
}

export default PostModule
