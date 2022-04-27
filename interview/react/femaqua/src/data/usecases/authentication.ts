import { IHttpClient, HttpMethod, HttpStatusCode, HttpHeader } from "../protocols/http"
import { IAuthentication, ILoginResponse } from "../../domain/usecases"
import { IUser } from "../../domain/models"

export class Authentication implements IAuthentication {
  constructor (readonly url: string, readonly httpClient: IHttpClient) {}

  async login(user: IUser): Promise<ILoginResponse> {
    const { statusCode, body } = await this.httpClient.request({
      method: HttpMethod.Post,
      url: this.url,
      headers: { [HttpHeader.contentType]: "application/json" },
      body: user,
    })

    const httpResponseStrategies = {
      [HttpStatusCode.ok]: () => ({ isLogged: true, body }),
      [HttpStatusCode.badRequest]: () => ({ isLogged: false, body }),
      [HttpStatusCode.serverError]: () => ({ isLogged: false, body }),
      [HttpStatusCode.unauthorized]: () => ({ isLogged: false, body }),
    }

    return httpResponseStrategies[statusCode as keyof typeof httpResponseStrategies]()
  }
}