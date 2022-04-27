import { useRef, MouseEvent, Dispatch, SetStateAction } from "react"
import { HttpHeader, HttpMethod, HttpStatusCode } from "../../../../../data/protocols/http"
import { makeLocalStorageAdapter } from "../../../../../main/factories/cache"
import { makeFetchHttpClient } from "../../../../../main/factories/http"
import { AiOutlineClose } from "react-icons/ai"
import { ITool } from "../../../../../domain/models"
import "./index.css"

interface IAddToolModalProps {
  readonly setIsLogged: Dispatch<SetStateAction<boolean>>
  readonly setAddToolModalVisible: Dispatch<SetStateAction<boolean>>
  readonly setTools: Dispatch<SetStateAction<ITool[]>>
}

export default function AddToolModal(
  { setAddToolModalVisible, setTools, setIsLogged }: IAddToolModalProps
) {
  const titleRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const tagRef = useRef<HTMLInputElement>(null)

  const saveTool = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const tool: Partial<ITool> = {
      title: titleRef.current?.value as string,
      link: linkRef.current?.value as string,
      description: descriptionRef.current?.value as string,
      tags: tagRef.current?.value.split(/[,]+/) 
    }

    const httpClient = makeFetchHttpClient()
    const localStorageAdapter = makeLocalStorageAdapter()

    const { statusCode, body } = await httpClient.request({
      method: HttpMethod.Post,
      url: `${process.env.REACT_APP_API_LOGIN_URL}/tools`,
      headers: {
        [HttpHeader.contentType]: "application/json",
        [HttpHeader.authorization]: "Bearer " + localStorageAdapter.get("access_token")
      },
      body: {
        title: tool.title,
        link: tool.link,
        description: tool.description,
        tags: tool.tags
      }
    })

    const addToolStrategies = {
      [HttpStatusCode.created]: () => {
        setTools(tools => [...tools, body])
        setAddToolModalVisible(false)
      },
      [HttpStatusCode.badRequest]: () => alert(body),
      [HttpStatusCode.unauthorized]: () => {
        alert(body.status)
        setIsLogged(false)
        localStorageAdapter.set("isLogged", false)
      },
    }

    return addToolStrategies[statusCode as keyof typeof addToolStrategies]()
  }

  return (
    <form className="add-tool-modal">
      <header>
        <h2>Nova Ferramenta</h2>
        <AiOutlineClose 
          style={{ cursor: "pointer" }}
          onClick={ () =>  setAddToolModalVisible(false) } 
        />
      </header>

      <hr style={{ color: "black",  opacity: "0.6", width: "100%" }} />
      <br />

      <div className="name-link">
        <div className="input-container">
          <label htmlFor="title">Nome</label>
          <input id="title" type="text" ref={ titleRef } />
        </div>

        <div className="input-container">
          <label htmlFor="link">Link</label>
          <input id="link" type="text" ref={ linkRef} />
        </div>
      </div>


      <div className="description">
        <label htmlFor="description">Descrição</label>
        <textarea id="description" cols={ 80 } rows={ 8 } ref={ descriptionRef } />
      </div>

      <div className="input-container tags">
        <label htmlFor="tags">Tags</label>
        <input id="tags" type="text" ref={ tagRef } />
      </div>

      <button onClick={ saveTool }>Salvar</button>
    </form>
  )
}