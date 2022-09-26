import mongoose from 'mongoose';


const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  apartments: {
    type: Array,
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

export default mongoose.model('Location', locationSchema);