import type { $Fetch, FetchError } from 'ofetch'
import type { IHttpFactory } from '~/src/types/factory'
import type { IApiError } from '~/src/types/api'

class FetchFactory<T> {
  private $fetch: $Fetch

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher
  }

  /**
   * The HTTP client is utilized to control the process of making API requests.
   * @param method the HTTP method (GET, POST, ...)
   * @param url the endpoint url
   * @param data the body data
   * @param fetchOptions fetch options
   * @returns
   */
  async call({
    method,
    url,
    data,
    fetchOptions
  }: IHttpFactory): Promise<[null, T] | [IApiError]> {
    try {
      const result = await this.$fetch<T>(url, {
        method,
        body: data,
        ...fetchOptions
      })

      return [null, result]
    } catch (error: any) {
      const fetchError = error as FetchError

      if (fetchError?.data) {
        return [
          {
            statusCode: fetchError.status || 500,
            message: fetchError.data.detail || 'Erro desconhecido',
            details: fetchError.data,
            errors: fetchError.data.errors || ['Ocorreu um erro desconhecido']
          }
        ]
      }

      return [
        {
          statusCode: 503,
          message: (fetchError as Error)?.message,
          details: '',
          errors: []
        }
      ]
    }
  }
}

export default FetchFactory
