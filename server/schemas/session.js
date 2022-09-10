import mongoose from 'mongoose';


const sessionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }
);

export default mongoose.model('Session', sessionSchema);