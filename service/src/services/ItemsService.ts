import { injectable } from "inversify"
import { IItemsService, Item } from "./interfaces/IItemsService.js"
import { ItemEntity } from "../model/ItemsEntity.js"
import { BirthdayModel, EventModel, GoalModel, ReminderModel, TaskModel, TodoListModel } from "../model/schemas/Items.schema.js"
import { isItemEntity } from "../controllers/ItemsController.js"


@injectable()
export class ItemsService implements IItemsService {

  getAllItems(): ItemEntity[] {
    throw new Error("Method not implemented.")
  }

  async insertItem(item: Item, userId: string): Promise<ItemEntity> {
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
      case 'todoList': {
        const itemDoc = await TodoListModel.create({ ...item, userId })
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
      case 'goal': {
        const itemDoc = await GoalModel.create({ ...item, userId })
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
      case 'birthday': {
        const itemDoc = await BirthdayModel.create({ ...item, userId })
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

      default:
        throw new Error('Invalid CalendarItem type')
    }
  }


}