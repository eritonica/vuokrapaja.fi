import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  bithday: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  workplace: {
    type: String,
  },
  monthlyIncome: {
    type: String,
  },
  smoking: {
    type: String,
  },
  credits: {
    type: String,
  }
});

export default mongoose.model('Applicant', applicantSchema);