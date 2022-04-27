import { makeFetchHttpClient } from "../http/fetch-http-client-factory"
import { IAuthentication } from "../../../domain/usecases"
import { Authentication } from "../../../data/usecases/authentication"
import { IHttpClient } from "../../../data/protocols/http"

export const makeAuthentication = (
  url: string,
  httpClient: IHttpClient = makeFetchHttpClient()
): IAuthentication => new Authentication(url, httpClient)