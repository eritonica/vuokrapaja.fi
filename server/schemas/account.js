import mongoose from 'mongoose';


const accountSchema = new mongoose.Schema({
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
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  code: {
    type: String,
    required: false,
  },
  recovery: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
  sourceId: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model('Account', accountSchema);