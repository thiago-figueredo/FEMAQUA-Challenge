import { IGetStorage, ISetStorage } from "../../data/protocols/cache"

export class LocalStorageAdapter implements ISetStorage, IGetStorage {
  public set(key: string, value: any): void {
    if (value) return localStorage.setItem(key, JSON.stringify(value))
  }

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(key) as string)
  }
}