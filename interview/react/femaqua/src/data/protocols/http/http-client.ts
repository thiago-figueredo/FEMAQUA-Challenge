export enum HttpMethod {
  Post = "POST",
  Get =  "GET",
  Put = "PUT",
  Delete = "DELETE"
}

export enum HttpHeader {
  contentType =  "Content-Type",
  authorization =  "Authorization"
}

export interface IHttpRequest {
  readonly url: string
  readonly method: HttpMethod
  readonly body?: any
  readonly headers?: any
}

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  serverError = 500,
}

export interface IHttpResponse<T = any> {
  readonly statusCode: HttpStatusCode
  readonly body?: T
}

export interface IHttpClient {
  request(data: IHttpRequest): Promise<IHttpResponse>
}