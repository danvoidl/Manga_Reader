import type { FetchOptions } from 'ofetch'

export interface IHttpFactory {
  method: string
  url: string
  fetchOptions?: FetchOptions<'json'>
  data?: object
}
