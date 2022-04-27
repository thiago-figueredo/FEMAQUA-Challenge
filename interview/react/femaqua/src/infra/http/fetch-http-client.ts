import { HttpStatusCode, IHttpClient, IHttpRequest, IHttpResponse } from "../../data/protocols/http"

export class FetchHttpClient implements IHttpClient {
  async request({ method, body, headers, url }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: headers,
      })

      return { statusCode: response.status, body: await response.json() }
    } catch(exception: any) {
      return { statusCode: HttpStatusCode.serverError, body: exception.message }
    }
  }
}