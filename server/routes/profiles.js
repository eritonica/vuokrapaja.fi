import express from "express";
import profileModel from "../schemas/profile.js";

import accounts from "./accounts.js";

const router = express.Router();

const getProfileById = async (id) => {
  let profile = await profileModel.findOne({ account: id }).exec();
	if(!profile) {
		throw new Error("Can not find profile with the account id.");
	} else {
		return profile;
	}
};

const getProfileByToken = async (token) => {
	let account = await accounts.getAccountByToken(token);
	if(!account) {
		throw new Error("Can not find account with the token.")
	} else {
		return getProfileById(account._id);
	}
}

const createEmptyProfile = async(accountId) => {
	let hasProfile = await profileModel.findOne({ account: accountId }).exec();
	if(hasProfile) {
		return "Profile exists";
	} else {
		let profile = new profileModel({
			account: accountId,
			type: "Rentee",
			name: "",
			profession: "",
			birthday: Date.now(),
			avatar: "",
			phone: "",
			email: "",
			website: "",
			active: true,
		});
		profile.save();
		return profile;
	}
} 

// POST /profiles
router.post("/profiles", async (req, res) => {
	let hasProfile = await profileModel.findOne({ account: req.session.account._id }).exec();
	if(hasProfile) {
		res.status(400).json({ message: "Profile already exists." });
		return;
	} else {
		let profile = new profileModel({
			account: req.session.account._id,
			type: req.body.type,
			name: req.body.name,
			profession: req.body.profession,
			birthday: req.body.birthday,
			address: req.body.address,
			description: req.body.description,
			avatar: req.body.avatar,
			phone: req.body.phone,
			email: req.body.email,
			website: req.body.website,
			active: true,
		});
		profile.save();
		res.status(200).json({ message: "Profile created." });
	}
});

// GET /profiles
router.get("/profiles", async (req, res) => {
	let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
	let account = await accounts.getAccountById(req.session.account._id);
	let tmpProfile = {
		type: "",
		name: "",
		profession: "",
		birthday: "",
		address: "",
		description: "",
		avatar: "",
		phone: "",
		email: "",
		remail: "",
		website: "",	
	};
	if(account) {
		tmpProfile.id = account._id;
		tmpProfile.username = account.username;
		tmpProfile.remail = account.email;
		tmpProfile.email = account.email;
	}
	if(profile) {
		tmpProfile.account = profile.account;
		tmpProfile.type = profile.type;
		tmpProfile.name = profile.name;
		tmpProfile.profession = profile.profession;
		tmpProfile.birthday = profile.birthday;
		tmpProfile.address = profile.address;
		tmpProfile.description = profile.description;
		tmpProfile.avatar = profile.avatar;
		tmpProfile.phone = profile.phone;
		tmpProfile.email = profile.email;
		tmpProfile.website = profile.website;
	}
	res.status(200).json(tmpProfile);
});

// PUT /profiles
router.put("/profiles", async (req, res) => {
	let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
	if(profile) {
		profile.type = req.body.type;
		profile.name = req.body.name;
		profile.profession = req.body.profession;
		profile.birthday = req.body.birthday;
		profile.address = req.body.address;
		profile.description = req.body.description;
		profile.avatar = req.body.avatar;
		profile.phone = req.body.phone;
		profile.email = req.body.email;
		profile.website = req.body.website;
		profile.updated = Date.now();
		await profile.save();
		res.status(200).json({ message: "Profile updated." });
	} else {
		res.status(400).json({ message: "Profile not found." });
	}
});

// DELETE /profiles
router.delete("/profiles", async (req, res) => {
	let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
	if(profile) {
		profile.active = false;
		profile.updated = Date.now();
		profile.save();
		res.status(200).json({ message: "Profile deleted." });
	} else {
		res.status(400).json({ message: "Profile not found." });
	}
});

export default {
	router,
	getProfileById,
	getProfileByToken,
	createEmptyProfile,
}