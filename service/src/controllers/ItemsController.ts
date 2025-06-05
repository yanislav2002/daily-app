import {
  BirthdayDetails,
  EventDetails,
  GoalDetails,
  IItemsService,
  Item,
  ReminderDetails,
  TaskDetails,
  TodoListDetails
} from "../services/interfaces/IItemsService.js"
import { Request, Response } from "express"
import { inject } from "inversify"
import { TYPES } from "../util/Types.js"
import { controller, httpPost, request, response } from "inversify-express-utils"
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
    'description' in item && typeof item.date === 'string' &&
    'color' in item && typeof item.date === 'string' &&
    'details' in item && typeof item.details === 'object'
  ) {
    switch (item.type) {
      case 'task':
        return isTaskDetails(item.details)
      case 'event':
        return isEventDetails(item.details)
      case 'reminder':
        return isReminderDetails(item.details)
      case 'todoList':
        return isTodoListDetails(item.details)
      case 'goal':
        return isGoalDetails(item.details)
      case 'birthday':
        return isBirthdayDetails(item.details)
      default:
        return false
    }
  }

  return false
}

const isChecklistItem = (item: unknown): item is { text: string; done: boolean } => {
  return (
    typeof item === 'object' && item !== null &&
    'text' in item && typeof item.text === 'string' &&
    'done' in item && typeof item.done === 'boolean'
  )
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

export const isTaskDetails = (item: unknown): item is TaskDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'deadline' in item && typeof item.deadline === 'string' &&
    'completed' in item && typeof item.completed === 'boolean' &&
    'priority' in item && typeof item.priority === 'string' && ['low', 'medium', 'high', 'critical'].includes(item.priority)
  )
}

export const isEventDetails = (item: unknown): item is EventDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'startTime' in item && typeof item.startTime === 'string' &&
    'endTime' in item && typeof item.endTime === 'string' &&
    'allDay' in item && typeof item.allDay === 'boolean'
  )
}

export const isReminderDetails = (item: unknown): item is ReminderDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'remindAt' in item && typeof item.remindAt === 'string'
  )
}

export const isTodoListDetails = (item: unknown): item is TodoListDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'items' in item && Array.isArray(item.items) &&
    item.items.every(isChecklistItem)
  )
}

export const isGoalDetails = (item: unknown): item is GoalDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'deadline' in item && typeof item.deadline === 'string' &&
    'progress' in item && typeof item.progress === 'number' &&
    'steps' in item && Array.isArray(item.steps) &&
    item.steps.every(isChecklistItem)
  )
}

export const isBirthdayDetails = (item: unknown): item is BirthdayDetails => {
  return (
    typeof item === 'object' && item !== null &&
    'personName' in item && typeof item.personName === 'string' &&
    'giftIdeas' in item && isStringArray(item.giftIdeas)
  )
}

@controller('/items')
export class ItemsController {

  constructor(
    @inject(TYPES.IItemsService) private itemsService: IItemsService
  ) { }

  @httpPost('/insert')
  public async insertItem(@request() req: Request, @response() res: Response): Promise<void> {
    const request: unknown = req.body

    if (
      typeof request !== 'object' ||
      request === null ||
      !('userId' in request) || typeof request.userId !== 'string' ||
      !('itemParams' in request) || !isItem(request.itemParams)
    ) {
      console.log('Invalid request format')
      res.status(400).json({ error: 'Invalid request format' })
      return
    }

    try {
      const inserted = await this.itemsService.insertItem(request.itemParams, request.userId)
      res.status(201).json(inserted)
    } catch (err) {
      console.log('Failed to insert item: ', getErrorMessage(err))
    }
  }

}    