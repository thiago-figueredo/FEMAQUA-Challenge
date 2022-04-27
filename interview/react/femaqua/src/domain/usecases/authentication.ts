import { IUser } from "../models"

export interface ILoginResponse {
  readonly isLogged: boolean
  readonly body?: any
}

export interface IAuthentication {
  login(user: IUser): Promise<ILoginResponse>
}