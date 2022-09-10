import express from "express";
import crypto from "../dependancies/crypto.js";
import accounts from "./accounts.js";

import sessionModel from "../schemas/session.js";

const router = express.Router();

const confirm = async (token) => {
  let account = await sessionModel.findOne({ token: token }).exec();
  if (account) {
    return true;
  } else {
    return false;
  }
}

// POST /sessions
// {
//  "email": "string",
//  "password": "string"
// }
router.post("/sessions", async (req, res) => {
  let account = await accounts.getAccountByEmail(req.body.email);
  if (account) {
    if (account.active == false) {
      res.status(400).json({ message: "Account not activated." });
      return;
    }
    if (account.password !== crypto.hash(req.body.password)) {
      res.status(400).json({ message: "Password is incorrect." });
    } else {
      let session = new sessionModel({
        account: account._id,
        token: crypto.generateString(32),
      });
      let err = await session.save();
      if (err) {
        res.status(400).json({ message: err.message });
        return console.error(err.message);
      }
      res.status(200).json({ token: session.token });
    }
  } else {
    res.status(400).json({ message: "Account does not exist." });
  }
});

// PUT /sessions
// {
//  "token": "string"
// }
router.put("/sessions", async (req, res) => {
  let session = await sessionModel.findOne({ token: req.body.token }).exec();
  if (session) {
    session.token = crypto.generateString(32);
    session.save();
    res.status(200).json({ token: session.token });
  } else {
    res.status(400).json({ message: "Session not found." });
  }
});

// DELETE /sessions
// {
//  "token": "string"
// }
router.delete("/sessions", async (req, res) => {
  let session = await sessionModel.findOne({ token: req.body.token }).exec();
  if (session) {
    session.remove();
    res.status(200).json({ message: "Session deleted." });
  } else {
    res.status(400).json({ message: "Session not found." });
  }
});

export default {
  router,
  confirm
}