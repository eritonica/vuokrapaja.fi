import mongoose from 'mongoose';


const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    code: {
      type: String,
      required: true,
    },
    recovery: {
      type: String,
      required: false,
    },
    created: {
      type: Date,
      required: true,
      default: Date.now,
    }
  }
);

export default mongoose.model('Account', accountSchema);