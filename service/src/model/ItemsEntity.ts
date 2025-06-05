import { Item } from "../services/interfaces/IItemsService.js"


export type ItemEntity = Item & {
  id: string
  userId: string
}