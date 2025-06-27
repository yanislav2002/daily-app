import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  }
}, {
  discriminatorKey: 'type',
  versionKey: false
})

const User = mongoose.model('User', userSchema)

export default User