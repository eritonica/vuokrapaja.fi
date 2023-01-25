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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
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


/** 
* Paste one or more documents here
*/
// {
//     "_id": {
//       "$oid": "63cfbbc0b793a6fa01ba7335"
//     },
//     "recipient": {
//       "toni.lukkaroinen@gmail.com"
//     },
//     "code": {
//       "lollero"
//     },
//     "seller": {
//       "$oid":  "63c5203df5629021687f1837"
//     },
//     "active": {
//         false
//     }
//   }
export default mongoose.model('Referral', ReferralSchema);