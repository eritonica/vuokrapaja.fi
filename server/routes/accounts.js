import express from "express";
import crypto from "../dependancies/crypto.js";
import mailer from "../dependancies/mailer.js";
import sessions from "./sessions.js";
import profiles from "./profiles.js";
import companies from "./companies.js";

import accountModel from "../schemas/account.js";
import profileModel from "../schemas/profile.js";

const router = express.Router();

const getAccountByEmail = async (email) => {
  return await accountModel.findOne({ email: email }).exec(); 
}

const getAccountById = async (id) => {
  return await accountModel.findOne({ _id: id }).exec();
}

const getAccountByUsername = async (username) => {
  return await accountModel.findOne({ username: username }).exec();
}

const getAccountByToken = async (token) => {
  let session = await sessions.getSessionByToken(token);
  if (session) {
    return await getAccountById(session.account);
  } else {
    return null;
  }
}

const addGoogleUser = async (sourceId, email, firstname, lastname, profilePhoto) => {
  let account = await accountModel.findOne({ sourceId: sourceId }).exec();
  if(account) {
    // create token
    return account;
  } else {
    // create new account
    let newAccount = new accountModel({
      sourceId: sourceId,
      email: email,
      username: firstname + " " + lastname,
      source: "google",
      active: true,
    });
    newAccount.save();
    let profile = new profileModel({
			account: newAccount._id,
			type: "Rentee",
			name: "",
			profession: "",
			birthday: Date.now(),
			avatar: profilePhoto,
			phone: "",
			email: "",
			website: "",
			active: true,
		});
		profile.save();
    return newAccount;
  }
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
    source: "local",
    code: activationCode,
  });
  await account.save();
  let createdAccount = await accountModel.findOne({ email: req.body.email }).exec();
  // Initialize empty profile and company.. 
  await profiles.createEmptyProfile(createdAccount._id);
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
    account.updated = Date.now();
    account.save();
    res.status(200).json({ message: "Account activated, ready for use. Please add your profile information." });
  } else {
    res.status(400).json({ message: "Account activation failed." });
  }
});

// GET /accounts/recovery/:email
router.get("/accounts/recovery/:email", async (req, res) => {
  let account = await accountModel.findOne({ email: req.params.email }).exec();
  if (account) {
    let recoveryCode = crypto.generateString(32);
    account.recovery = recoveryCode;
    account.updated = Date.now();
    account.save();
    let header = `Password recovery request.`
    let message = `Hello.\r\n\r\n`;
    message += `You have requested a password recovery. Please click the link below to recover your account.\r\n\r\n`;
    message += `${process.env.RECOVERY_LINK}${recoveryCode}\r\n\r\n`;
    message += `Thank you, sincerely for joining our service.`;
    console.log("To: " + req.params.email);
    console.log("Header: " + header);
    console.log("Message: \r\n" + message);
    mailer.sendMail(req.params.email, header, message);
    res.status(200).json({ message: "Recovery email sent." });
  } else {
    res.status(400).json({ message: "Account recovery failed." });
  }
});

// PUT /accounts/recovery/:code
// {
//  "password": "string"
// }
router.put("/accounts/recovery/:code", async (req, res) => {
  let account = await accountModel.findOne({ recovery: req.params.code }).exec();
  if (account) {
    account.password = crypto.encrypt(req.body.password);
    account.recovery = "";
    account.updated = Date.now();
    account.save();
    res.status(200).json({ message: "Password changed." });
  } else {
    res.status(400).json({ message: "Password change failed." });
  }
});

// GET /accounts/:id
router.get("/accounts/:id", async (req, res) => {
  let account = await accountModel.findById(req.params.id).exec();
  if (account) {
    account.password = "";
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
router.put("/accounts/", async (req, res) => {
  sessions.checkSession(req, res, async () => {
    let account = await accountModel.findById(req.session.account._id).exec();
    if (account) {
      if(req.body.username) {
        account.username = req.body.username;
      }
      if(req.body.email) {
        account.email = req.body.email;
      }
      if(req.body.password) {
        account.password = crypto.encrypt(req.body.password);
      }
      account.updated = Date.now();
      account.save();
      res.status(200).json({ message: "Account updated." });
    } else {
      res.status(404).json({ message: "Account not found." });
    }
  });
});

// DELETE accounts/
router.delete("/accounts/", async (req, res) => {
  sessions.checkSession(req, res, async () => {
    let account = await accountModel.findById(req.session.account._id).exec();
    if (account) {
      account.activated = false;
      account.activationCode = "";
      account.updated = Date.now();
      account.save();
      res.status(200).json({ message: "Account deleted." });
    } else {
      res.status(404).json({ message: "Account not found." });
    }
  });
});

export default {
  router,
  getAccountByUsername,
  getAccountByEmail,
  getAccountById,
  getAccountByToken,
  addGoogleUser
}