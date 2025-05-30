import NodeCache from 'node-cache'
import modules from '../repository/api'

export const myCache = new NodeCache()

async function login() {
  const [error, data] = await modules.auth.login()

  console.log(error, data)

  if (error) return

  myCache.set('AUTH_TOKEN', data.access_token, data.expires_in)
  myCache.set('REFRESH_TOKEN', data.refresh_token, data.refresh_expires_in)
}

async function refreshToken() {
  const [error, data] = await modules.auth.refreshToken()

  console.log(error, data)

  if (error) return

  myCache.set('AUTH_TOKEN', data.access_token, data.expires_in)
}

export async function authenticate() {
  const refresh = myCache.get('REFRESH_TOKEN')

  if (refresh) {
    await refreshToken()
    return
  }

  await login()
}
