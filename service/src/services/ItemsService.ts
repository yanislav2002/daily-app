import { injectable } from "inversify"
import { IItemsService, Item } from "./interfaces/IItemsService.js"
import { ItemEntity } from "../model/ItemsEntity.js"
import {
  BaseItemModel,
  EventModel,
  ReminderModel,
  TaskModel
} from "../model/schemas/Items.schema.js"
import { isItemEntity } from "../controllers/ItemsController.js"


@injectable()
export class ItemsService implements IItemsService {

  getAllItems(): ItemEntity[] {
    throw new Error("Method not implemented.")
  }

  public fetchItems = async (userId: string): Promise<ItemEntity[]> => {
    const docs = await BaseItemModel.find({ userId }).lean()

    const itemEntities: ItemEntity[] = docs.map(doc => {
      const { _id, ...rest } = doc
      const itemEntity = {
        ...rest,
        id: _id.toString()
      }

      if (!isItemEntity(itemEntity)) {
        throw new Error('Invalid ItemEntity from DB')
      }

      return itemEntity
    })

    return itemEntities
  }

  public insertItem = async (item: Item, userId: string): Promise<ItemEntity> => {
    const test = await this.getItemEntity(item, userId)
    console.log('New Item added successfully')
    return test
  }

  private getItemEntity = async (item: Item, userId: string): Promise<ItemEntity> => {
    switch (item.type) {
      case 'task': {
        const itemDoc = await TaskModel.create({ ...item, userId })
        const { _id, ...rest } = itemDoc.toObject()

        const newItemEntity = {
          ...rest,
          id: _id.toString()
        }

        if (!isItemEntity(newItemEntity)) {
          throw new Error("Failed to create valid ItemEntity")
        }

        return newItemEntity
      }
      case 'event': {
        const itemDoc = await EventModel.create({ ...item, userId })
        const { _id, ...rest } = itemDoc.toObject()

        const newItemEntity = {
          ...rest,
          id: _id.toString()
        }

        if (!isItemEntity(newItemEntity)) {
          throw new Error("Failed to create valid ItemEntity")
        }

        return newItemEntity
      }
      case 'reminder': {
        const itemDoc = await ReminderModel.create({ ...item, userId })
        const { _id, ...rest } = itemDoc.toObject()

        const newItemEntity = {
          ...rest,
          id: _id.toString()
        }

        if (!isItemEntity(newItemEntity)) {
          throw new Error("Failed to create valid ItemEntity")
        }

        return newItemEntity
      }
      default: {
        throw new Error('Invalid CalendarItem type')
      }
    }
  }


}