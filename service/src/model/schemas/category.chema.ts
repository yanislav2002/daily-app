import mongoose, { Schema } from 'mongoose'
import { CategoryEntity } from '../CategoryEntity.js'


const CategorySchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
}, {
  discriminatorKey: 'type',
  versionKey: false
})

export default mongoose.model<CategoryEntity>('Category', CategorySchema)
