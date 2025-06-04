import { BaseItem, CalendarItem, IItemsService, TaskItem } from "../services/interfaces/IItemsService.js"
import { Request, Response } from "express"
import { inject } from "inversify"
import { TYPES } from "../util/Types.js"
import { controller, httpPost, request, response } from "inversify-express-utils"


const isBaseItem = (item: unknown): item is BaseItem => {
  return (
    typeof item === 'object' && item !== null &&
    'type' in item && typeof item.type === 'string' &&
    'title' in item && typeof item.title === 'string' &&
    'date' in item && typeof item.date === 'string' &&
    'description' in item && typeof item.date === 'string' &&
    'color' in item && typeof item.date === 'string'
  )
}

export const isTaskItem = (item: unknown): item is TaskItem => {
  return (
    isBaseItem(item) &&
    item.type === 'task' &&
    'deadline' in item && typeof item.deadline === 'string' &&
    'completed' in item && typeof item.completed === 'boolean' &&
    'priority' in item && typeof item.priority === 'string' && ['low', 'medium', 'high', 'critical'].includes(item.priority)
  )
}

//todo add all typeguards


const isCalendarItem = (item: unknown): item is CalendarItem => {
  if (isTaskItem(item)) return true
  return false
  //todo add all typeguards

}

@controller('/items')
export class ItemsController {

  constructor(
    @inject(TYPES.IItemsService) private itemsService: IItemsService
  ) { }

  @httpPost('/insert')
  public async insertItem(@request() req: Request, @response() res: Response): Promise<void> {
    const request: unknown = req.body
    
    if (!isCalendarItem(request)) {
      res.status(400).json({ error: 'Invalid item format' })
      return
    }

    try {
      const inserted = await this.itemsService.insertItem(request, 'sad')
      res.status(201).json(inserted)
    } catch {
      res.status(500).json({ error: 'Failed to insert item' })
    }
  }

}    