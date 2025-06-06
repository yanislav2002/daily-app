import mongoose from "mongoose"
import {
  TaskDetails,
  EventDetails,
  ReminderDetails,
  TodoListDetails,
  GoalDetails,
  BirthdayDetails,
  Item
} from "../../services/interfaces/IItemsService.js"


const BaseItemSchemaFields = {
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['task', 'event', 'reminder', 'todoList', 'goal', 'birthday'] },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  color: { type: String, default: '' }
}

const TaskDetailsSchema = new mongoose.Schema({
  deadline: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'] }
}, { _id: false })

const EventDetailsSchema = new mongoose.Schema({
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  allDay: { type: Boolean, required: true, default: false }
}, { _id: false })

const ReminderDetailsSchema = new mongoose.Schema({
  remindAt: { type: String, required: true }
}, { _id: false })

const TodoListDetailsSchema = new mongoose.Schema({
  items: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ]
}, { _id: false })

const GoalDetailsSchema = new mongoose.Schema({
  deadline: { type: String, required: true },
  progress: { type: Number, required: true, min: 0, max: 100 },
  steps: [
    {
      text: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ]
}, { _id: false })

const BirthdayDetailsSchema = new mongoose.Schema({
  personName: { type: String, required: true },
  giftIdeas: [{ type: String }]
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

export const TodoListModel = BaseItemModel.discriminator<TodoListDetails>('todoList', new mongoose.Schema({
  details: { type: TodoListDetailsSchema, required: true }
}))

export const GoalModel = BaseItemModel.discriminator<GoalDetails>('goal', new mongoose.Schema({
  details: { type: GoalDetailsSchema, required: true }
}))

export const BirthdayModel = BaseItemModel.discriminator<BirthdayDetails>('birthday', new mongoose.Schema({
  details: { type: BirthdayDetailsSchema, required: true }
}))