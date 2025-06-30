import {
  EventDetails,
  IItemsService,
  Item,
  ReminderDetails,
  RepeatSettings,
  TaskDetails,
  TodoList
} from "../services/interfaces/IItemsService.js"
import { Request, Response } from "express"
import { inject } from "inversify"
import { TYPES } from "../util/Types.js"
import { controller, httpDelete, httpGet, httpPost, request, response } from "inversify-express-utils"
import { ItemEntity } from "../model/ItemsEntity.js"
import { getErrorMessage } from "../util/ErrorUtils.js"


export const isItemEntity = (item: unknown): item is ItemEntity => {
  return (
    typeof item === 'object' && item !== null &&
    'id' in item && typeof item.id === 'string' &&
    'userId' in item && typeof item.userId === 'string' &&
    isItem(item)
  )
}

export const isItem = (item: unknown): item is Item => {
  if (
    typeof item === 'object' && item !== null &&
    'type' in item && typeof item.type === 'string' &&
    'title' in item && typeof item.title === 'string' &&
    'date' in item && typeof item.date === 'string' &&
    'description' in item && typeof item.description === 'string' &&
    'details' in item && typeof item.details === 'object'
  ) {
    if ('color' in item && typeof item.color !== 'string') return false
    if ('categoryId' in item && typeof item.categoryId !== 'string') return false

    switch (item.type) {
      case 'task':
        return isTaskDetails(item.details)
      case 'event':
        return isEventDetails(item.details)
      case 'reminder':
        return isReminderDetails(item.details)
      default:
        return false
    }
  }

  return false
}

export const isTaskDetails = (item: unknown): item is TaskDetails => {
  if (
    typeof item === 'object' && item !== null &&
    'completed' in item && typeof item.completed === 'boolean' &&
    'priority' in item && typeof item.priority === 'string'
    && ['low', 'medium', 'high', 'critical'].includes(item.priority) &&
    'status' in item && typeof item.status === 'string' &&
    ['not_started', 'in_progress', 'waiting', 'canceled', 'done'].includes(item.status)
  ) {
    if ('estimatedTime' in item && typeof item.estimatedTime !== 'number') return false
    if ('deadline' in item && typeof item.deadline !== 'string') return false
    if ('startTime' in item && typeof item.startTime !== 'string') return false
    if ('endTime' in item && typeof item.endTime !== 'string') return false
    if ('todoList' in item && !isTodoList(item.todoList)) return false

    return true
  }

  return false
}

export const isEventDetails = (item: unknown): item is EventDetails => {
  if (typeof item !== 'object' || item === null) return false
  if (!('allDay' in item) || typeof item.allDay !== 'boolean') return false
  if ('startTime' in item && typeof item .startTime !== 'string') return false
  if ('endTime' in item && typeof item.endTime !== 'string') return false

  return true
}

export const isReminderDetails = (item: unknown): item is ReminderDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'remindAt' in item && typeof item.remindAt === 'string'
  )
}

const isTodoList = (value: unknown): value is TodoList => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false

    const obj = item as Record<string, unknown>

    return (
      typeof obj.key === 'number' &&
      typeof obj.text === 'string' &&
      typeof obj.done === 'boolean'
    )
  })
}

const isNumberArray = (value: unknown): value is number[] => {
  return Array.isArray(value) && value.every((v) => typeof v === 'number')
}

const isRepeatSettings = (value: unknown): value is RepeatSettings => {
  return (
    typeof value === 'object' && value !== null &&
    'frequency' in value && typeof value.frequency === 'string' &&
    ['daily', 'weekly', 'monthly', 'yearly'].includes(value.frequency)) &&
    'interval' in value && typeof value.interval === 'number' &&
    'daysOfWeek' in value && isNumberArray(value.daysOfWeek) &&
    'endDate' in value && value.endDate === 'string'
}

@controller('/items')
export class ItemsController {

  constructor(
    @inject(TYPES.IItemsService) private itemsService: IItemsService
  ) { }

  @httpGet('/fetch')
  public async fetchItems(@request() req: Request, @response() res: Response) {
    const userId = req.query.userId

    if (typeof userId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid userId query parameter' })
      return
    }

    try {
      const items = await this.itemsService.fetch(userId)
      res.status(200).json(items)
    } catch (err) {
      console.error('Failed to fetch items: ', getErrorMessage(err))
      res.status(500).json({ error: 'Failed to fetch items' })
    }
  }

  @httpPost('/insert')
  public async insertItem(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (
      typeof request !== 'object' || request === null ||
      !('userId' in request) || typeof request.userId !== 'string' ||
      !('itemParams' in request) || !isItem(request.itemParams)
    ) {
      console.log('Invalid request format')
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const inserted = await this.itemsService.insert(request.itemParams, request.userId)
      res.status(201).json(inserted)
    } catch (err) {
      console.log('Failed to insert item: ', getErrorMessage(err))
    }
  }

  @httpPost('/update')
  public async updateItem(@request() req: Request, @response() res: Response) {
    const request: unknown = req.body

    if (
      typeof request !== 'object' || request === null ||
      !('userId' in request) || typeof request.userId !== 'string' ||
      !('item' in request) || !isItemEntity(request.item)
    ) {
      console.log('Invalid update request format')
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const updated = await this.itemsService.update(request.item, request.userId)
      res.status(200).json(updated)
    } catch (err) {
      console.log('Failed to update item: ', getErrorMessage(err))
      res.status(500).json({ error: 'Failed to update item' })
    }
  }

  @httpDelete('/delete')
  public async deleteItem(@request() req: Request, @response() res: Response) {
    const { id, userId } = req.query

    if (typeof id !== 'string' || typeof userId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid id or userId query parameter' })
      return
    }

    try {
      await this.itemsService.delete(id, userId)
      res.status(204).send() 
    } catch (err) {
      console.log('Failed to delete item: ', getErrorMessage(err))
      res.status(500).json({ error: 'Failed to delete item' })
    }
  }

}    