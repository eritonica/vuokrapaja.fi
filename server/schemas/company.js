import mongoose from 'mongoose';


const companySchema = new mongoose.Schema({
	manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	ycode: {
		type: String,
		required: true,
	},
	address: {
		type: String,
	},
	website : {
		type: String,
	},
	description: {
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

export default mongoose.model('Company', companySchema);