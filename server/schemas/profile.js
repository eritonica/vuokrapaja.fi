import mongoose from 'mongoose';


const profileSchema = new mongoose.Schema({
	account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
	},
	type: {
			type: String, // Rentee, Renter, Broker, Reseller
			required: true,
	},
	name: {
			type: String,
	},
	profession: {
			type: String,
	},
	birthday: {
			type: Date,
	},
	address: {
			type: String,
	},
	description: {
			type: String,
	},
	avatar: {
			type: String,
	},
	phone: {
			type: String,
	},
	email: {
			type: String,
	},
	website: {
			type: String,
	},
	active: {
			type: Boolean,
			required: true,
			default: false,
	},
	created: {
			type: Date,
			default: Date.now,
	},
	updated: {
			type: Date,
			default: Date.now,
	},
});

export default mongoose.model('Profile', profileSchema);