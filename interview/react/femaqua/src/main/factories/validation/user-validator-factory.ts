import { UserValidator } from "../../../validation/validators"
import { IUser } from "../../../domain/models"

export const makeUserValidator = (user: IUser) => new UserValidator(user)