import axios from "axios"


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
    'priority' in item &&
    typeof item.priority === 'string' && ['low', 'medium', 'high', 'critical'].includes(item.priority)
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

export type ItemType = 'task' | 'event' | 'reminder' | 'todoList' | 'goal' | 'birthday'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type ItemEntity = Item & {
  id: string
  userId: string
}

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

export const fetchItems = async (userId: string): Promise<ItemEntity[]> => {
  const res = await axios.get('/items/fetch', { params: { userId } })

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to fetch items')
  }

  if (Array.isArray(res.data) && res.data.every(item => isItemEntity(item))) {
    return res.data
  }

  throw new Error('Invalid Response Data')
}

export const insertItem = async (itemParams: Item, userId: string): Promise<ItemEntity> => {
  const res = await axios.post('/items/insert', { itemParams, userId })

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to insert item')
  }

  if (!isItemEntity(res.data)) {
    throw new Error('Invalid Response Data')
  }

  return res.data
}