export type Tag = string

export interface ITool {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly tags: Tag[]
  readonly link: string
}