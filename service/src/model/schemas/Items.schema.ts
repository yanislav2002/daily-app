import mongoose from "mongoose"
import {
  TaskDetails,
  EventDetails,
  ReminderDetails,
  Item
} from "../../services/interfaces/IItemsService.js"


const BaseItemSchemaFields = {
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['task', 'event', 'reminder', 'todoList', 'goal', 'birthday'] },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  color: { type: String, default: '' },
  categoryId: { type: String, default: undefined },
  repeat: {
    type: {
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
      interval: { type: Number, default: 1 },
      daysOfWeek: { type: [String], enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      endDate: { type: String }
    },
    default: undefined
  }
}

const TaskDetailsSchema = new mongoose.Schema({
  completed: { type: Boolean, required: true, default: false },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'] },
  status: { type: String, required: true, enum: ['not_started', 'in_progress', 'waiting', 'canceled', 'done'] },
  todoList: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ],
  deadline: { type: String, default: undefined },
  estimatedTime: { type: Number, default: undefined },
  startTime: { type: String, default: undefined },
  endTime: { type: String, default: undefined }
}, { _id: false })

const EventDetailsSchema = new mongoose.Schema({
  startTime: { type: String, default: undefined },
  endTime: { type: String, default: undefined },
  allDay: { type: Boolean, required: true, default: false }
}, { _id: false })

const ReminderDetailsSchema = new mongoose.Schema({
  remindAt: { type: String, required: true }
}, { _id: false })

const BaseItemSchema = new mongoose.Schema({
  ...BaseItemSchemaFields,
  details: { type: mongoose.Schema.Types.Mixed, required: true }
}, {
  discriminatorKey: 'type',
  versionKey: false
})

export const BaseItemModel = mongoose.model<Item>('Item', BaseItemSchema)

export const TaskModel = BaseItemModel.discriminator<TaskDetails>('task', new mongoose.Schema({
  details: { type: TaskDetailsSchema, required: true }
}))

export const EventModel = BaseItemModel.discriminator<EventDetails>('event', new mongoose.Schema({
  details: { type: EventDetailsSchema, required: true }
}))

export const ReminderModel = BaseItemModel.discriminator<ReminderDetails>('reminder', new mongoose.Schema({
  details: { type: ReminderDetailsSchema, required: true }
}))