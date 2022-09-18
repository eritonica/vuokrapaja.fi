import mongoose from 'mongoose';


const companySchema = new mongoose.Schema({
	manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	name: {
		type: String,
		unique: true,
		required: true,
	},
	ycode: {
		type: String,
		unique: true,
		required: true,
	},
	address: {
		type: String,
	},
	website : {
		type: String,
	},
	phone : {
		type: String,
	},
	email : {
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