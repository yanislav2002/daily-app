
export type ItemType = 'task' | 'event' | 'reminder' | 'todoList' | 'goal' | 'birthday'
export type CalendarItem = | TaskItem | EventItem | ReminderItem | TodoListItem | GoalItem | BirthdayItem
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type BaseItem = {
  type: ItemType
  title: string
  date: string
  description?: string
  color?: string
}

export type TaskItem = BaseItem & {
  type: 'task'
  deadline?: string  
  completed?: boolean
  priority?: Priority
}

export type EventItem = BaseItem & {
  type: 'event'
  startTime?: string
  endTime?: string
  allDay?: boolean
}

export type ReminderItem = BaseItem & {
  type: 'reminder'
  remindAt: string
}

export type TodoListItem = BaseItem & {
  type: 'todoList'
  items: { text: string; done: boolean }[]
}

export type GoalItem = BaseItem & {
  type: 'goal'
  deadline?: string
  progress?: number
  steps?: { text: string; done: boolean }[]
}

export type BirthdayItem = BaseItem & {
  type: 'birthday'
  personName: string
  giftIdeas?: string[]
}