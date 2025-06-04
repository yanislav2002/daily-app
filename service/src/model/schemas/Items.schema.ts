import mongoose from "mongoose"
import { BirthdayItem, EventItem, GoalItem, ReminderItem, TaskItem, TodoListItem } from "../../services/interfaces/IItemsService.js"

//todo add userid to all


const BaseItemSchemaFields = {
  type: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  color: { type: String }
}

const TaskSchema = new mongoose.Schema<TaskItem>({
  ...BaseItemSchemaFields,
  deadline: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] }
})

const EventSchema = new mongoose.Schema<EventItem>({
  ...BaseItemSchemaFields,
  startTime: { type: String },
  endTime: { type: String },
  allDay: { type: Boolean, default: false }
})

const ReminderSchema = new mongoose.Schema<ReminderItem>({
  ...BaseItemSchemaFields,
  remindAt: { type: String, required: true }
})

const TodoListSchema = new mongoose.Schema<TodoListItem>({
  ...BaseItemSchemaFields,
  items: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ]
})

const GoalSchema = new mongoose.Schema<GoalItem>({
  ...BaseItemSchemaFields,
  deadline: { type: String },
  progress: { type: Number, min: 0, max: 100 },
  steps: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ]
})

const BirthdaySchema = new mongoose.Schema<BirthdayItem>({
  ...BaseItemSchemaFields,
  personName: { type: String, required: true },
  giftIdeas: [{ type: String }]
})

export const TaskModel = mongoose.model<TaskItem>('Task', TaskSchema)
export const EventModel = mongoose.model<EventItem>('Event', EventSchema)
export const ReminderModel = mongoose.model<ReminderItem>('Reminder', ReminderSchema)
export const TodoListModel = mongoose.model<TodoListItem>('TodoList', TodoListSchema)
export const GoalModel = mongoose.model<GoalItem>('Goal', GoalSchema)
export const BirthdayModel = mongoose.model<BirthdayItem>('Birthday', BirthdaySchema)