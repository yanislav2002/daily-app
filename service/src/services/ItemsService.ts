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

  public fetch = async (userId: string): Promise<ItemEntity[]> => {
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

    console.log('Fetched items successfully')
    return itemEntities
  }

  public insert = async (item: Item, userId: string): Promise<ItemEntity> => {
    const test = await this.getItemEntity(item, userId)
    console.log('New Item added successfully')
    return test
  }

  public update = async (item: ItemEntity, userId: string): Promise<ItemEntity> => {
    const { id, ...updateData } = item

    if (typeof id !== 'string') {
      throw new Error('Invalid item ID')
    }

    const updated = await BaseItemModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, lean: true }
    )

    if (!updated) {
      throw new Error('Item not found or not authorized')
    }

    const itemEntity = { ...updated, id: updated._id.toString() }

    if (!isItemEntity(itemEntity)) {
      throw new Error('Invalid updated ItemEntity from DB')
    }

    console.log('Item updated successfully')
    return itemEntity
  }

  public delete = async (id: string, userId: string): Promise<void> => {
    const result = await BaseItemModel.deleteOne({ _id: id, userId })

    if (result.deletedCount === 0) {
      throw new Error('Item not found or not authorized')
    }

    console.log('Item deleted successfully')
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