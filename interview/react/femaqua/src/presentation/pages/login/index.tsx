import { useRef, MouseEvent, Dispatch, SetStateAction } from "react"
import { makeLocalStorageAdapter } from "../../../main/factories/cache"
import { makeUserValidator } from "../../../main/factories/validation"
import { IAuthentication } from "../../../domain/usecases"
import { IUser } from "../../../domain/models"
import Header from "../../components/header"
import "./index.css"

interface ILoginProps {
  readonly authentication: IAuthentication
  readonly setIsLogged: Dispatch<SetStateAction<boolean>>
}

export default function Login({ authentication, setIsLogged }: ILoginProps) {
  const loginRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const loginUser = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const user: IUser = {
      email: loginRef.current?.value as string,
      password: passwordRef.current?.value as string
    }

    const userValidator = makeUserValidator(user)
    const { isValid, error } = userValidator.validate()

    if (!isValid) return alert(error)

    const { isLogged, body } = await authentication.login(user)
    const localStorageAdapter = makeLocalStorageAdapter()
    const access_token = body["access_token"]

    localStorageAdapter.set("isLogged", isLogged ? "true" : "false")
    localStorageAdapter.set("access_token", access_token)

    setIsLogged(isLogged)
  }

  return <>
    <div className="login">
      <Header style={{ margin: "5rem 9rem 5rem 0rem" }} />

      <form>
        <div className="login-field">
          <label htmlFor="login">Login</label>
          <input id="login" type="text" ref={ loginRef } />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" ref={ passwordRef } 
          />
        </div>

        <div className="button">
          <button onClick={ loginUser }>Entrar</button>
        </div>
      </form>
    </div>

    <div className="side-bar"></div>
  </>
}