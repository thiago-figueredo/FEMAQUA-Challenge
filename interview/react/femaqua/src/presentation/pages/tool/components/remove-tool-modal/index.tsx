import { HttpStatusCode, HttpMethod, HttpHeader } from "../../../../../data/protocols/http"
import { makeLocalStorageAdapter } from "../../../../../main/factories/cache"
import { Dispatch, SetStateAction } from "react"
import { AiOutlineClose } from "react-icons/ai"
import "./index.css"
import { makeFetchHttpClient } from "../../../../../main/factories/http"

interface IRemoveToolModalProps {
  readonly idToBeRemoved: number
  readonly setRemoveToolModalVisible: Dispatch<SetStateAction<boolean>>
}

export default function RemoveToolModal({ 
  idToBeRemoved,
  setRemoveToolModalVisible 
}: IRemoveToolModalProps) {
  const removeModal = () => setRemoveToolModalVisible(false) 
  const removeTool = async () => {
    const httpClient = makeFetchHttpClient()
    const localStorageAdapter = makeLocalStorageAdapter()

    const { statusCode, body } = await httpClient.request({
      method: HttpMethod.Delete,
      headers: {
        [HttpHeader.authorization]: "Bearer " + localStorageAdapter.get("access_token")
      },
      url: `${process.env.REACT_APP_API_LOGIN_URL}/tools/${idToBeRemoved}`,
    })

    const addToolStrategies = {
      [HttpStatusCode.ok]: () => alert("Ferrament Removida com Sucesso"),
      [HttpStatusCode.unauthorized]: () => {
        alert(body.status)
        localStorageAdapter.set("isLogged", false)
      },
      [HttpStatusCode.notFound]: () => {
        alert(body.status)
      },
    }
    
    return addToolStrategies[statusCode as keyof typeof addToolStrategies]()
  }

  return <div className="remove-tool">
    <header>
      <h2>Remover Ferramenta</h2>
      <AiOutlineClose style={{ cursor: "pointer" }} onClick={ removeModal} />
    </header>

    <br />
    <hr style={{ color: "black",  opacity: "0.6", width: "100%" }} />
    <br />

    <h4>Deseja realmente remover essa ferramenta ?</h4>

    <footer>
      <button id="cancel" onClick={ removeModal }>Cancelar</button>
      <button id="yes" onClick={ removeTool }>Sim</button>
    </footer>
  </div>
}