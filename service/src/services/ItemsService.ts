import { injectable } from "inversify"
import { EventDetails, IItemsService, Item } from "./interfaces/IItemsService.js"
import { ItemEntity } from "../model/ItemsEntity.js"
import {
  BaseItemModel,
  EventModel,
  ReminderModel,
  TaskModel
} from "../model/schemas/Items.schema.js"
import { isItemEntity } from "../controllers/ItemsController.js"
import { CategoryEntity } from "../model/CategoryEntity.js"
import Holidays from 'date-holidays'
import dayjs from "dayjs"


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
    const itemEntity = await this.getItemEntity(item, userId)
    console.log('New Item added successfully')
    return itemEntity
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

  public addOfficialHolidays = async (category: CategoryEntity, countryCode: string, userId: string): Promise<void> => {
    const holidays = this.getNationalHolidays(countryCode)

    await Promise.all(
      holidays.map(holiday =>
        this.insert(
          {
            type: 'event',
            title: holiday.title,
            date: holiday.date,
            categoryId: category.id,
            color: category.color,
            description: `Official holiday in ${countryCode}`,
            details: {
              allDay: true
            }
          },
          userId
        )
      )
    )

    console.log('Official holidays added successfully')
  }

  private getNationalHolidays = (countryCode: string, year: number = new Date().getFullYear()) => {
    const hd = new Holidays()
    hd.init(countryCode, 'en')

    const holidays = hd.getHolidays(year)

    return holidays.map(h => ({
      title: h.name,
      date: dayjs(h.date).format('DD-MM-YYYY')
    }))
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