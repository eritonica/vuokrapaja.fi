import mongoose from 'mongoose';


const idRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: "credit-check"
  },
  validation: {
    type: String,
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
  },
  requested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  numbers: {
    type: String,
  },
  created: {
    type: String,
    required: true,
  },
  updated: {
    type: String,
    required: true,
  }
});

export default mongoose.model('idRequest', idRequestSchema);