import express from 'express';

import companyModel from '../schemas/company.js';


const router = express.Router();

// GET /companies
router.get('/companies', async (req, res) => {
	let companies = await companyModel.findOne({manager: req.session.account._id}).exec();
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
	router
};