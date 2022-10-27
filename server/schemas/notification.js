import mongoose from 'mongoose';


const notificationSchema = new mongoose.Schema({
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: false,
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: false,
	},
  notification: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model('Notifications', notificationSchema);