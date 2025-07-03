import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
}, {
  versionKey: false
})

export const Feedback = mongoose.model('Feedback', feedbackSchema)
