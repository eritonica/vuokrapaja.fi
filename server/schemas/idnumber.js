import mongoose from 'mongoose';


const idNumberSchema = new mongoose.Schema({
  account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
  },
  companyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  personalNumber: {
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

export default mongoose.model('idNumber', idNumberSchema);