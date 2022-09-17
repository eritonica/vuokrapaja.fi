import express from 'express';

import companyModel from '../schemas/company.js';


const router = express.Router();


// GET /companies
router.get('/companies', async (req, res) => {
	let companies = await companyModel.find().exec();
	res.status(200).json(companies);
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
	let company = new companyModel({
		manager: req.session.account._id,
		name: req.body.name,
		ycode: req.body.ycode,
		address: req.body.address,
		website: req.body.website,
		description: req.body.description,
	});
	company.save();
	res.status(200).json({ message: 'Company created.' });
});

// GET /companies/:id
router.get('/companies/:id', async (req, res) => {
	let company = await companyModel.findOne({ _id: req.params.id }).exec();
	if (company) {
		res.status(200).json(company);
	} else {
		res.status(404).json({ message: 'Company not found.' });
	}
});

// UPDATE /companies/:id
// {
//  "manager": "string",
//  "name": "string",
//  "ycode": "string",
//  "address": "string",
//  "website": "string",
//  "description": "string"
// }
router.put('/companies/:id', async (req, res) => {
	if(req.session.account._id === req.body.manager) {
		let company = await companyModel.findOne({ _id: req.params.id }).exec();
		if (company) {
			company.manager = req.body.manager;
			company.name = req.body.name;
			company.ycode = req.body.ycode;
			company.address = req.body.address;
			company.website = req.body.website;
			company.description = req.body.description;
			company.updated = Date.now();
			company.save();
			res.status(200).json({ message: 'Company updated.' });
		} else {
			res.status(404).json({ message: 'Company not found.' });
		}
	} else {
		// TODO: check if user is part of the company and has permission to edit
		res.status(403).json({ message: 'Forbidden.' });
	}
});

// DELETE /companies/:id
router.put('/companies/:id', async (req, res) => {
	if(req.session.account._id === req.body.manager) {
		let company = await companyModel.findOne({ _id: req.params.id }).exec();
		if (company) {
			company.remove();
			res.status(200).json({ message: 'Company deleted.' });
		} else {
			res.status(404).json({ message: 'Company not found.' });
		}
	} else {
		res.status(401).json({ message: 'Unauthorized.' });
	}
});





export default {
	router
};