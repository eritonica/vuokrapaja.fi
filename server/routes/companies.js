import express from 'express';

import companyModel from '../schemas/company.js';
import memberModel from '../schemas/member.js';

import members from './members.js';
import sessions from './sessions.js';


const router = express.Router();

const getCompany = async (id) => {
	let company = await companyModel.findById(id).exec();
	if (company) {
		return company;
	} else {
		return null;
	}
};

const getCompaniesByToken = async (token) => {
	let account = sessions.checkSession(token);
	if(account === undefined || account._id === undefined) {
		return false;
	}
	let companies = members.getCompaniesByMember(account._id);
	if(companies == undefined) {
		return false;
	}
	return companies;
} 

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
		let newCompany = new companyModel({
			manager: accountId,
			name: "",
			ycode: "",
			address: "",
			website: "",
			description: "",
			email: "",
			phone: ""
		});
		newCompany.save();
		let company = await companyModel.findOne({ manager: accountId }).exec();
		if (company) {
			let newMember = new memberModel({
				account: accountId,
				company: company._id,
				role: "Manager",
				permission: "read | write | delete"
			});
			newMember.save();
			return "Empty company created.";
		} else {
			return "Empty company created, but not found afterwards. Should not be possible.";
		}
	}
}

// GET /companies
router.get('/companies', async (req, res) => {
	console.log(req.session.account._id);
	let companies = await members.getCompaniesByMember(req.session.account._id);
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
	let newCompany = new companyModel({
		manager: req.session.account._id,
		name: req.body.name,
		ycode: req.body.ycode,
		address: req.body.address,
		website: req.body.website,
		description: req.body.description,
		email: req.body.email,
		phone: req.body.phone
	});
	await newCompany.save();
	let company = await companyModel.findOne({ manager: req.session.account._id }).exec();
	if (company) {
		let newMember = new memberModel({
			account: req.session.account._id,
			company: company._id,
			role: "admin",
			permissions: "read | write | delete"
		});
		newMember.save();
		return res.status(200).json({ message: 'Company created.', company: company });
	} else {
		return res.status(400).json({ message: 'Failed to create company.' });
	}
	
});

// GET /companies/:id
router.get('/companies/:id', async (req, res) => {
	if(req.params.id === undefined) {
		return res.status(404).json({ message: "Company not found" });
	}
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
	if(req.params.id == "undefined") {
		res.status(400).json({message: "Invalid company id."});
		return;
	}
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
	createEmptyCompany,
	getCompany,
	getCompaniesByToken
};