import mongoose from 'mongoose';


const apartmentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  address: {
    type: String,
  },
  zip: {
    type: String,
  },
  cityArea: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  rent: {
    type: Number,
  },
  rental: {
    type: String,
  },
  release: {
    type: Date,
  },
  rooms: {
    type: Number,
  },
  size: {
    type: Number,
  },
  type: {
    type: String,
  },
  waterSeperate: {
    type: Boolean,
  },
  water: {
    type: Number,
  },
  electricitySeperate: {
    type: Boolean,
  },
  electricity: {
    type: Number,
  },
  heatingSeperate: {
    type: Boolean,
  },
  use: {
    type: String,
  },
  description: {
    type: String,
  },
  condition: {
    type: String,
  },
  buildingYear: {
    type: Number,
  },
  kitchenType: {
    type: String,
  },
  heating: {
    type: String,
  },
  has: {
    type: Array,
  },
  suitable: {
    type: Array,
  },
  images: {
    type: Array,
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
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

export default mongoose.model('Apartment', apartmentSchema);