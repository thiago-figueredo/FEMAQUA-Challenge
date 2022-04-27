import { IUser } from "../../domain/models"

export interface IUserValidateReturnValue {
  readonly isValid: boolean
  readonly error?: string
}

export interface IUserValidation {
  validate(user: IUser): IUserValidateReturnValue
}