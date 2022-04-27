import { useState, useCallback, useEffect } from 'react'
import { makeLocalStorageAdapter } from './main/factories/cache'
import { makeAuthentication } from './main/factories/usecases'
import Login from './presentation/pages/login'
import Tool from './presentation/pages/tool'

function App() {
  const [isLogged, setIsLogged] = useState(false)
  const url = `${process.env.REACT_APP_API_LOGIN_URL}/auth/login`
  const authentication = makeAuthentication(url)
  const localStorageAdapter = makeLocalStorageAdapter()

  const checkLogin = useCallback(async () => {
    const userLogged = await localStorageAdapter.get("isLogged")

    if (!userLogged) return setIsLogged(false)
    setIsLogged(true)
  }, [localStorageAdapter])

  useEffect(() => { checkLogin() }, [checkLogin])

  return <>
    { 
      isLogged ? 
        <Tool setIsLogged={ setIsLogged } /> : 
        <Login authentication={ authentication } setIsLogged={ setIsLogged } /> 
    }
  </>
}

export default App
