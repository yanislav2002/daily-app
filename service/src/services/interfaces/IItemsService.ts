import { ItemEntity } from "../../model/ItemsEntity.js"


export type ItemType = 'task' | 'event' | 'reminder' | 'todoList' | 'goal' | 'birthday'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type Item = {
  type: ItemType
  title: string
  date: string
  description: string
  color: string
  details: TaskDetails | EventDetails | ReminderDetails | TodoListDetails | GoalDetails | BirthdayDetails
}

export type TaskDetails = {
  deadline: string
  completed: boolean
  priority: Priority
}

export type EventDetails = {
  startTime: string
  endTime: string
  allDay: boolean
}

export type ReminderDetails = {
  remindAt: string
}

export type TodoListDetails = {
  items: { text: string; done: boolean }[]
}

export type GoalDetails = {
  deadline: string
  progress: number
  steps: { text: string; done: boolean }[]
}

export type BirthdayDetails = {
  personName: string
  giftIdeas: string[]
}

export type IItemsService = {
  getAllItems(): ItemEntity[]
  insertItem(item: Item, userId: string): Promise<ItemEntity>
}