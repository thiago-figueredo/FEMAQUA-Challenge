import { IUserValidateReturnValue, IUserValidation } from "../protocols"
import { IUser } from "../../domain/models"

export class UserValidator implements IUserValidation {
  constructor(readonly user: IUser) {}

  validate(): IUserValidateReturnValue {
    const { email, password } = this.user
    return email && password ? 
      { isValid: true } : 
      { isValid: false, error: "Login e Senha são obrigatórios" }
  }
}