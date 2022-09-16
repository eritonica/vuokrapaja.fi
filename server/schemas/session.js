import mongoose from 'mongoose';


const sessionSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  token: {
    type: String,
    required: true,
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

export default mongoose.model('Session', sessionSchema);