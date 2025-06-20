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
    'details' in item && typeof item.details === 'object'
  ) {
    if ('color' in item && typeof item.color !== 'string') return false
    if ('categoryId' in item && typeof item.categoryId !== 'string') return false
    if ('repeat' in item && !isRepeatSettings(item.repeat)) return false

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

const isTodoList = (value: unknown): value is TodoList => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false

    const obj = item as Record<string, unknown>

    return (
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

const isCategory = (value: unknown): value is Category => {
  return (
    typeof value === 'object' && value !== null &&
    'name' in value && typeof value.name === 'string' &&
    'color' in value && typeof value.color === 'string' &&
    'description' in value && typeof value.description === 'string'
  )
}

const isCategoryEntity = (value: unknown): value is CategoryEntity => {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'userId' in value && typeof value.userId === 'string' &&
    isCategory(value)
  )
}

export type ItemType = 'task' | 'event' | 'reminder'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'not_started' | 'in_progress' | 'waiting' | 'canceled' | 'done'
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Entity = {
  id: string
  userId: string
}

export type CategoryEntity = Entity & Category
export type Category = {
  name: string
  color: string
  description?: string
}

export type ItemEntity = Entity & Item
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
  completed: boolean
  priority: Priority
  status: TaskStatus
  deadline?: string
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
  text: string
  done: boolean
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

export const insertCategory = async (category: Category, userId: string): Promise<CategoryEntity> => {
  const res = await axios.post('/category/insert', { category, userId })

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to insert category')
  }

  if (!isCategoryEntity(res.data)) {
    throw new Error('Invalid Response Data')
  }

  return res.data
}

export const fetchCategories = async (userId: string): Promise<CategoryEntity[]> => {
  const res = await axios.get('/category/fetch', { params: { userId } })

  if (res.status < 200 || res.status >= 300) {
    throw new Error('Failed to fetch categories')
  }

  if (Array.isArray(res.data) && res.data.every(item => isCategoryEntity(item))) {
    return res.data
  }

  throw new Error('Invalid Response Data')
}