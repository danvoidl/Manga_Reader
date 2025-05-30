import { $fetch, type FetchOptions, type FetchError } from 'ofetch'
import { myCache } from '../cache'
import { config } from '../config'

import AuthModule from './modules/auth.module'
import MangaModule from './modules/manga.module'

interface IApiInstance {
  auth: AuthModule
  manga: MangaModule
}

const fetchOptions: FetchOptions = {
  baseURL: config.BASE_URL,
  onRequest({ options, request }) {
    console.log(request, options.params)
    const token = myCache.get('AUTH_TOKEN')

    console.log('MY TOKEN', token)

    if (token && request !== '/auth/login') {
      options.headers.append('Authorization', `Bearer ${token}`)
    }
  },
  onResponse({ response }) {},
  onRequestError({ request, response }) {}
}

const apiFecther = $fetch.create(fetchOptions)

const modules: IApiInstance = {
  auth: new AuthModule(apiFecther),
  manga: new MangaModule(apiFecther)
}

export default modules
