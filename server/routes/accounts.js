import express from "express";
import crypto from "../dependancies/crypto.js";
import mailer from "../dependancies/mailer.js";
import sessions from "./sessions.js";

import accountModel from "../schemas/account.js";

const router = express.Router();

const getAccountByEmail = async (email) => {
  return await accountModel.findOne({ email: email }).exec(); 
}

// POST /accounts
// {
//  "email": "string",
//  "password": "string"
// }
router.post("/accounts", async (req, res) => {
  let validation = await accountModel.findOne({ email: req.body.email }).exec();
  if(validation) {
    res.status(400).json({ message: "Account already exists with email." });
    return;
  }
  validation = await accountModel.findOne({ username: req.body.username }).exec();
  if(validation) {
    res.status(400).json({ message: "Account already exists with username." });
    return;
  }
  let activationCode = crypto.generateString(32);
  let account = new accountModel({
    username: req.body.username,
    email: req.body.email,
    password: crypto.encrypt(req.body.password),
    activated: false,
    code: activationCode,
  });
  await account.save();
  let header = `Your account has been created.`
  let message = `Hello.\r\n\r\n`;
  message += `Your account has been created. Please click the link below to activate your account.\r\n\r\n`;
  message += `${process.env.ACTIVATION_LINK}${activationCode}\r\n\r\n`;
  message += `Thank you, sincerely for joining our service.`;
  console.log("To: " + req.body.email);
  console.log("Header: " + header);
  console.log("Message: \r\n" + message);
  mailer.sendMail(req.body.email, header, message);
  res.status(200).json({ message: "Account created, waiting for verification." });
});

// GET /accounts/activate/:code
router.get("/accounts/activate/:code", async (req, res) => {
  console.log(req.params.code);
  let account = await accountModel.findOne({ code: req.params.code }).exec();
  console.log(account);
  if (account) {
    account.active = true;
    account.save();
    res.status(200).json({ message: "Account activated, ready for use. Please add your profile information." });
  } else {
    res.status(400).json({ message: "Account activation failed." });
  }
});

// GET /accounts/:id
router.get("/accounts/:id", async (req, res) => {
  let account = await accountModel.findById(req.params.id).exec();
  if (account) {
    res.status(200).json(account);
  } else {
    res.status(404).json({ message: "Account not found." });
  }
});

// UPDATE accounts/:id
// {
//  "username": "string",
//  "email": "string",
//  "password": "string"
// }
router.put("/accounts/:id", async (req, res) => {
  let account = await accountModel.findById(req.params.id).exec();
  if (account) {
    account.username = req.body.username;
    account.email = req.body.email;
    account.password = crypto.hash(req.body.password);
    account.save();
    res.status(200).json({ message: "Account updated." });
  } else {
    res.status(404).json({ message: "Account not found." });
  }
});

// DELETE accounts/:id
// {
//   "token": "token"
// }
router.delete("/accounts/:id", async (req, res) => {
  let account = await accountModel.findById(req.params.id).exec();
  if (account) {
    account.activated = false;
    account.activationCode = crypto.generateString(32);
    account.save();
    res.status(200).json({ message: "Account deleted." });
  } else {
    res.status(404).json({ message: "Account not found." });
  }
});

export default {
  router,
  getAccountByEmail,
}