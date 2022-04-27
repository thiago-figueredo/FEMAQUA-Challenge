import { CSSProperties } from "react"
import "./index.css"

interface IHeaderProps {
  readonly style?: CSSProperties
}

export default function Header({ style }: IHeaderProps) {
  return (
    <header style={ style }>
      <h1>Femaqua</h1>
      <br />
      <h2>Ferramentas Maravilhosas que Adoro</h2>
    </header>
  )
}