import { ItemEntity } from "../../model/ItemsEntity.js"


export type ItemType = 'task' | 'event' | 'reminder'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'not_started' | 'in_progress' | 'waiting' | 'canceled' | 'done'
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Item = {
  type: ItemType
  title: string
  date: string
  description: string
  color?: string
  repeat?: RepeatSettings
  categoryId?: string
  details: TaskDetails | EventDetails | ReminderDetails
}

export type TaskDetails = {
  deadline: string
  completed: boolean
  priority: Priority
  status: TaskStatus
  todoList?: TodoList[]
  estimatedTime?: number
  startTime?: string
  endTime?: string
}

export type EventDetails = {
  startTime?: string
  endTime?: string
  allDay: boolean
}

export type ReminderDetails = {
  remindAt: string
}

export type RepeatSettings = {
  frequency: Frequency
  interval: number
  daysOfWeek?: number[] /*1-7*/
  endDate?: string
}

export type TodoList = {
  key: number
  text: string
  done: boolean
}

export type IItemsService = {
  fetch(userId: string): Promise<ItemEntity[]>
  insert(item: Item, userId: string): Promise<ItemEntity>
  update(item: ItemEntity, userId: string): Promise<ItemEntity>
  delete(id: string, userId: string): Promise<void>
}