import { useState, Fragment, Dispatch, SetStateAction, useRef } from "react"
import { HttpMethod, HttpStatusCode, HttpHeader } from "../../../data/protocols/http"
import { makeLocalStorageAdapter } from "../../../main/factories/cache"
import { makeFetchHttpClient } from "../../../main/factories/http"
import { AiOutlineSearch } from "react-icons/ai"
import { ITool } from "../../../domain/models"
import AddToolModal from "./components/add-tool-modal"
import Header from "../../components/header"
import RemoveToolModal from "./components/remove-tool-modal"
import "./index.css"

export interface IToolProps {
  readonly setIsLogged: Dispatch<SetStateAction<boolean>>
}

export default function Tool({ setIsLogged }: IToolProps) {
  const filterTagRef= useRef<HTMLInputElement>(null)
  const [addToolModalVisible, setAddToolModalVisible] = useState(false)
  const [removeToolModalVisible, setRemoveToolModalVisible] = useState(false)
  const [tools, setTools] = useState<ITool[]>([])	
  const [idToBeRemoved, setIdToBeRemoved] = useState<number>()

  return (
    <div className="tool">
      <Header style={{
        width: "100%",
        textAlign: "start",
        marginTop: "5rem",
      }} />

      <div 
        className="tool-header" 
        style={ addToolModalVisible ? { display: "none" } : { display: "flex" } }
      >
        <div className="tool-search">
          <AiOutlineSearch />
          <input 
            type="text" 
            placeholder="Busca por tag" 
            ref={ filterTagRef }
            onKeyDown={ async ({ key }) => {
              if (key === "Enter") {
                const httpClient = makeFetchHttpClient()
                const localStorageAdapter = makeLocalStorageAdapter()
                const tag = filterTagRef.current?.value as string

                if (!tag) return alert("Por favor, digite uma tag")

                const { statusCode, body } = await httpClient.request({
                  method: HttpMethod.Get,
                  url: `${process.env.REACT_APP_API_LOGIN_URL}/tools?tag=${tag}`,
                  headers: {
                    [HttpHeader.authorization]: "Bearer " + localStorageAdapter.get("access_token")
                  }
                })

                const addToolStrategies = {
                  [HttpStatusCode.ok]: () => setTools(body),
                  [HttpStatusCode.badRequest]: () => alert(body),
                  [HttpStatusCode.notFound]: () => alert(body),
                  [HttpStatusCode.serverError]: () => setTools([]),
                  [HttpStatusCode.unauthorized]: () => {
                    alert(body.status)
                    setIsLogged(false)
                    localStorageAdapter.set("isLogged", false)
                  },
                }

                console.log({ tag })
                console.log({ statusCode, body })

                return addToolStrategies[statusCode as keyof typeof addToolStrategies]()
              }
            } } />
        </div>

        <button onClick={ () => setAddToolModalVisible(true) }>+ &nbsp; Novo</button>
      </div>

      <section 
        className="tools"
        style={ addToolModalVisible ? { display: "none" } : { display: "flex" } }
      >
        { 
          tools.length === 0 ? 
            <h2>Nenhum resultado encontrado</h2> :
            tools.map(({ id, title, link, description, tags }) => 
              <main 
                key={ id } 
                id={ id }
                className="tool-section" 
                style={ removeToolModalVisible ? { display: "none" } : { display: "flex" } }
              >
                <div className="tool-item">
                  <a href={ link }>{ title }</a>
                  <p>{ description }</p>
                  <span>
                    { 
                      tags?.map(tag => 
                        <Fragment key={ tag }>#{ tag } &nbsp;</Fragment>)
                    }
                  </span>
                </div>

                <div id="delete-tool">
                  <button onClick={ ({ currentTarget }) => {
                    const secondParentElement = currentTarget.parentElement?.parentElement
                    const toolId = secondParentElement?.id

                    setIdToBeRemoved(Number(toolId))
                    setRemoveToolModalVisible(true)
                  }}>Deletar</button>
                </div>
              </main>) 
        }
      </section>

      {
        addToolModalVisible &&  <AddToolModal 
          setIsLogged={ setIsLogged }
          setTools={ setTools }
          setAddToolModalVisible={ setAddToolModalVisible }
        />
      }

      {
        removeToolModalVisible && <RemoveToolModal 
          idToBeRemoved={ idToBeRemoved as number }
          setRemoveToolModalVisible={ setRemoveToolModalVisible } 
        />
      }
    </div>
  )
}