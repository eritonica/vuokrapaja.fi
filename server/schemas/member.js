import mongoose from 'mongoose';


const companySchema = new mongoose.Schema({
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
		required: true,
	},
	persmissions: {
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

export default mongoose.model('Company', companySchema);