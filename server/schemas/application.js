import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true,
  },
  creator: {
    type: String,
    required: false,
  },
  applicantsCount: {
    type: Number,
    required: true,
  },
  desiredStart: {
    type: Date,
  },
  desiredEnd: {
    type: Date,
  },
  currentAddress: {
    type: String,
  },
  deposit: {
    type: String,
  },
  pets: {
    type: String,
  },
  description: {
    type: String,
  },
  reason: {
    type: String,
  },
  creditDescription: {
    type: String,
  },
  visitation: {
    type: String,
  },
  terms: {
    type: Boolean,
  },
  status: {
    type: String,
    default: 'pending',
  },
  created: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Application', applicationSchema);