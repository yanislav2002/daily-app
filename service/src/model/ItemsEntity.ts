import { BirthdayItem, EventItem, GoalItem, ReminderItem, TaskItem, TodoListItem } from "../services/interfaces/IItemsService.js"

export type Entity<T> = T & { id: string }

export type TaskEntity = Entity<TaskItem>
export type EventEntity = Entity<EventItem>
export type ReminderEntity = Entity<ReminderItem>
export type TodoListEntity = Entity<TodoListItem>
export type GoalEntity = Entity<GoalItem>
export type BirthdayEntity = Entity<BirthdayItem>

export type CalendarItemEntity = TaskEntity | EventEntity | ReminderEntity | TodoListEntity | GoalEntity | BirthdayEntity
