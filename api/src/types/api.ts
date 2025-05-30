export interface IApiError {
  statusCode: number
  message: string
  details: any
  errors: object[]
}

export interface IApiSucess {
  success: boolean
  message: string
}

export interface ListSuccess<D> extends IApiSucess {
  limit: number
  offset: number
  total: number
  result: string
  response: string
  data: D
}

export type ApiResp<T> = Promise<[null, T] | [IApiError]>