import express from "express";

import companyModel from "../schemas/company.js";
import memberModel from "../schemas/member.js";

const router = express.Router();


// POST /members
// {
//  "account": "string",
//  "company": "string",
//  "role": "string",
//  "permissions" : "string"
// }
router.post("/members", async (req, res) => {
  let company = await companyModel.findOne({ _id: req.body.company }).exec();
  if (company) {
    if(company.manager === req.session.account._id) {
        let member = new memberModel({
          account: req.body.account,
          company: req.body.company,
          role: req.body.role,
          permissions: req.body.permissions,
        });
        member.save();
        res.status(200).json({ message: "Member created." });
    } else {
        res.status(403).json({ message: "You are not the manager of this company." });
    }
  } else {
    res.status(404).json({ message: "Company not found." });
  }
});

// GET /members/:id
router.get("/members/:id", async (req, res) => {
  let company = await companyModel.findOne({ _id: req.params.id }).exec();
  if (company) {
    if(company.manager === req.session.account._id) {
        let members = await memberModel.find({ company: req.params.id }).exec();
        res.status(200).json(members);
    } else {
        res.status(403).json({ message: "You are not the manager of this company." });
    }
  }
});

// UPDATE /members/:id
// {
//  "account": "string",
//  "company": "string",
//  "role": "string",
//  "permissions" : "string"
// }
router.put("/members/:id", async (req, res) => {
  let company = await companyModel.findOne({ _id: req.params.id }).exec();
  if (company) {
    if(company.manager === req.session.account._id) {
        let member = await memberModel.findOne({ account: req.body.account }).exec();
        if (member) {
          member.account = req.body.account;
          member.company = req.body.company;
          member.role = req.body.role;
          member.permissions = req.body.permissions;
          member.save();
          res.status(200).json({ message: "Member updated." });
        } else {
          res.status(404).json({ message: "Member not found." });
        }
    } else {
        res.status(403).json({ message: "You are not the manager of this company." });
    }
  } else {
    res.status(404).json({ message: "Company not found." });
  }
});

// DELETE /members/:id
router.delete("/members/:id", async (req, res) => {
  let company = await companyModel.findOne({ _id: req.params.id }).exec();
  if (company) {
    if(company.manager === req.session.account._id) {
        let member = await memberModel.findOne({ account: req.body.account }).exec();
        if (member) {
          member.remove();
          res.status(200).json({ message: "Member deleted." });
        } else {
          res.status(404).json({ message: "Member not found." });
        }
    } else {
        res.status(403).json({ message: "You are not the manager of this company." });
    }
  } else {
    res.status(404).json({ message: "Company not found." });
  }
});

export default router;