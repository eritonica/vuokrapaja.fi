import express from "express";

import accounts from "./accounts.js";
import profiles from "./profiles.js";

import companyModel from "../schemas/company.js";
import memberModel from "../schemas/member.js";

const router = express.Router();

const getMembers = async (company) => {
  let members = await memberModel.find({ company: company }).exec();
  let memberList = [];
  for (let i = 0; i < members.length; i++) {
    let member = members[i];
    let account = await accounts.getAccountById(member.account);
    let profile = await profiles.getProfileById(member.account);
    memberList.push({
      _id: member._id,
      username: account.username,
      role: member.role,
      permissions: member.permissions,
      profile: profile,
    });
  }
  return memberList;
};


// POST /companies/members
// {
//  "username": "string",
//  "company": "string",
//  "role": "string",
//  "permissions" : "string"
// }
router.post("/companies/members", async (req, res) => {
  let account = await accounts.getAccountByUsername(req.body.username);
  if (!account) {
    return res.status(400).json({ message: "Account does not exist." });
  }
  let company = await companyModel.findOne({ _id: req.body.company }).exec();
  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }
  let permissionToCreate = false;
  if (company.manager.toString() === req.session.account._id.toString()) {
    permissionToCreate = true;
  } else {
    let member = await memberModel.findOne({ account: req.session.account._id, company: req.body.company }).exec();
    if(member) {
      if(member.permissions.includes("create")) {
        permissionToCreate = true;
      }
    }
  }
  if (permissionToCreate === false) {
    return res.status(403).json({ message: "You do not have permission to create members." });
  } else {
    let member = new memberModel({
      account: account._id,
      company: company._id,
      role: req.body.role,
      permissions: req.body.permissions,
    });
    member.save();
    return res.status(200).json({ message: "Member created." });
  }
});

// GET /companies/members/:id
router.get("/companies/members/:id", async (req, res) => {
  if(req.params.id === "undefined") {
    return res.status(404).json({ message: "Company not found." });
  }
  let company = await companyModel.findOne({ _id: req.params.id }).exec();
  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }
  let permissionToRead = false;
  if (company.manager.toString() === req.session.account._id.toString()) {
    permissionToRead = true;
  } else {
    let member = await memberModel.findOne({ account: req.session.account._id, company: req.params.id }).exec();
    if(member) {
      if(member.permissions.includes("read")) {
        permissionToRead = true;
      }
    }
  }
  if (permissionToRead === false) {
    return res.status(403).json({ message: "You do not have permission to read members." });
  }
  let members = await memberModel.find({ company: req.params.id }).exec();
  let tmpMembers = [];
  for(let i = 0; i < members.length; i++) {
    let tmpMember = {
      _id: members[i]._id,
      account: members[i].account,
      company: members[i].company,
      role : members[i].role,
      permissions : members[i].permissions,
    }
    let account = await accounts.getAccountById(members[i].account);
    if(account) {
      tmpMember.username = account.username;
      tmpMember.email = account.email;
    }
    let profile = await profiles.getProfileById(members[i].account);
    if(profile) {
      tmpMember.name = profile.name;
    } else {
      tmpMember.name = "";
    }
    tmpMembers.push(tmpMember);
  }
  return res.status(200).json({ members: tmpMembers });
});

// UPDATE /companies/members/:id
// {
//  "account": "string",
//  "company": "string",
//  "role": "string",
//  "permissions" : "string"
// }
router.put("/companies/members/:id", async (req, res) => {
  let member = await memberModel.findOne({ _id: req.params.id }).exec();
  if (!member) {
    return res.status(404).json({ message: "Member not found." });
  }
  let company = await companyModel.findOne({ _id: member.company }).exec();
  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }
  let permissionToUpdate = false;
  if (company.manager.toString() === req.session.account._id.toString()) {
    permissionToUpdate = true;
  } else {
    let member = await memberModel.findOne({ account: req.session.account._id, company: req.body.company }).exec();
    if(member) {
      if(member.permissions.includes("update")) {
        permissionToUpdate = true;
      }
    }
  }
  if (permissionToUpdate === false) {
    return res.status(403).json({ message: "You do not have permission to update members." });
  } else {
    member.account = req.body.account;
    member.company = req.body.company;
    member.role = req.body.role;
    member.permissions = req.body.permissions;
    try {
      member.save();
      return res.status(200).json({ message: "Member updated." });
    } catch (err) {
      return res.status(400).json({ message: "Member could not be updated." });
    }
  }
});

// DELETE /companies/members/:id
router.delete("/companies/members/:id", async (req, res) => {
  let member = await memberModel.findOne({ _id: req.params.id }).exec();
  if (!member) {
    return res.status(404).json({ message: "Member not found." });
  }
  let company = await companyModel.findOne({ _id: member.company }).exec();
  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }
  let permissionToDelete = false;
  if (company.manager.toString() === req.session.account._id.toString()) {
    permissionToDelete = true;
  } else {
    let member = await memberModel.findOne({ account: req.session.account._id, company: req.params.id }).exec();
    if(member) {
      if(member.permissions.includes("delete")) {
        permissionToRead = true;
      }
    }
  }
  if (permissionToDelete === false) {
    return res.status(403).json({ message: "You do not have permission to delete members." });
  }
  member.remove();
  return res.status(200).json({ message: "Member deleted." });
});

export default {
  router,
  getMembers
};