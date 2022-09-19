import mongoose from 'mongoose';


const memberSchema = new mongoose.Schema({
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	role: {
		type: String,
	},
	permissions: {
		type: String,
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

export default mongoose.model('Member', memberSchema);