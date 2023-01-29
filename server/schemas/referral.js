import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
    recipient: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    deal: {
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
export default mongoose.model('Referral', ReferralSchema);