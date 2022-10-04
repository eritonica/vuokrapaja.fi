import express from 'express';

import companyModel from '../schemas/company.js';

import members from './members.js';


const router = express.Router();

const checkPermission = async (user, company, perm) => {
	let companyMembers = await members.getMembers(company);
	for(let i = 0; i < companyMembers.length; i++) {
		if(companyMembers[i].account === user) {
			if(companyMembers[i].permissions.includes(perm)) {
				return true;
			}
		}
	}
	let manager = await companyModel.findOne({_id: company}).exec();
	if(manager === user) {
		return true;
	}
	return false;
}

const createEmptyCompany = async (accountId) => {
	let hasCompany = await companyModel.findOne({ manager: accountId }).exec();
	if(hasCompany) {
		return "Company exists";
	} else {
		let company = new companyModel({
			manager: accountId,
			name: "",
			ycode: "",
			address: "",
			website: "",
			description: "",
			email: "",
			phone: ""
		});
		company.save();
		return "Empty company created.";
	}
}

// GET /companies
router.get('/companies', async (req, res) => {
	let companies = await companyModel.findOne({manager: req.session.account._id}).exec();
	if(!companies) {
		// Check if user is a member of a company.
		let companies = await members.getCompaniesByMember(req.session.account._id);
		if(companies.length === 0) {
			return res.status(404).json({ error: true, message: "No companies found." });
		} else {
			return res.status(200).json(companies);
		}
	}
	return res.status(200).json(companies);
});

// POST /companies
// {
//  "manager": "string",
//  "name": "string",
//  "ycode": "string",
//  "address": "string",
//  "website": "string",
//  "description": "string"
// }
router.post('/companies', async (req, res) => {
	let companyExists = await companyModel.findOne({ycode: req.body.ycode}).exec();
	if(companyExists) {
		res.status(400).json({message: "Company already exists."});
		return;
	}
	companyExists = await companyModel.findOne({name: req.body.name}).exec();
	if(companyExists) {
		res.status(400).json({message: "Company already exists."});
		return;
	}
	let company = new companyModel({
		manager: req.session.account._id,
		name: req.body.name,
		ycode: req.body.ycode,
		address: req.body.address,
		website: req.body.website,
		description: req.body.description,
		email: req.body.email,
		phone: req.body.phone
	});
	company.save();
	return res.status(200).json({ message: 'Company created.' });
});

// GET /companies/:id
router.get('/companies/:id', async (req, res) => {
	let company = await companyModel.findOne({ _id: req.params.id }).exec();
	if (company) {
		return res.status(200).json(company);
	} else {
		return res.status(404).json({ message: 'Company not found.' });
	}
});

// UPDATE /companies/:id
// {
//  
//  "manager": "string",
//  "name": "string",
//  "ycode": "string",
//  "address": "string",
//  "website": "string",
//  "description": "string"
// }
router.put('/companies/:id', async (req, res) => {
	let company = await companyModel.findOne({ _id: req.params.id }).exec();
	if (company) {
		company.manager = req.body.manager;
		company.name = req.body.name;
		company.ycode = req.body.ycode;
		company.address = req.body.address;
		company.website = req.body.website;
		company.description = req.body.description;
		company.email = req.body.email;
		company.phone = req.body.phone;
		company.updated = Date.now();
		company.save();
		return res.status(200).json({ message: 'Company updated.' });
	} else {
		return res.status(404).json({ message: 'Company not found.' });
	}
});

// DELETE /companies/:id
router.put('/companies/:id', async (req, res) => {
	if(req.session.account._id === req.body.manager) {
		let company = await companyModel.findOne({ _id: req.params.id }).exec();
		if (company) {
			company.remove();
			return res.status(200).json({ message: 'Company deleted.' });
		} else {
			return res.status(404).json({ message: 'Company not found.' });
		}
	} else {
		return res.status(401).json({ message: 'Unauthorized.' });
	}
});

export default {
	router,
	checkPermission,
	createEmptyCompany
};