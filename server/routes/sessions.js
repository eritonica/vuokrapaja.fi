import express from "express";
import crypto from "../dependancies/crypto.js";
import accountModel from "../schemas/account.js";

import sessionModel from "../schemas/session.js";

const router = express.Router();

const confirm = async (token) => {
  let session = await sessionModel.findOne({ token: token }).exec();
  if (session) {
    return session;
  } else {
    return false;
  }
}

const getSessionByToken = async (token) => {
  let session = await sessionModel.findOne({ token: token }).exec();
  if (session) {
    return session;
  } else {
    return false;
  }
}

// Session check middleware
const checkSession = async (req, res, next) => {
  let session = await sessionModel.findOne({ token: req.headers.token }).populate("account").exec();
  if (session) {
    if(session.updated.getTime() + process.env.SESSION_TTL > Date.now()) {
      if(session.account !== undefined, session.account._id !== undefined) {
        req.session = session
        next();
      } else {
        res.status(401).json({ message: "Invalid session." });
      }
    } else {
      
      res.status(401).json({ message: "Session expired." });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

const createSession = async (id) => {
  let token = crypto.generateString(32);
  let session = new sessionModel({
    token: token,
    account: id,
    updated: Date.now()
  });
  session.save();
  return session;
}

// POST /sessions
// {
//  "email": "string",
//  "password": "string"
// }
router.post("/sessions", async (req, res) => {
  let account = await accountModel.findOne({ email: req.body.email }).exec();
  if (account) {
    if (account.active == false) {
      res.status(400).json({ message: "Account not activated." });
      return;
    }
    if (account.source == "google") {
      res.status(400).json({ message: "Account created with Google." });
      return;
    }
    if (crypto.compare(req.body.password, account.password)) {
      let session = new sessionModel({
        account: account._id,
        token: crypto.generateString(32),
      });
      session.save();
      res.status(200).json({ token: session.token });
    } else {
      res.status(400).json({ message: "Password is incorrect." });
    }
  } else {
    res.status(400).json({ message: "Password is incorrect." });
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
    session.updated = Date.now();
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
const deleteOldSessions = (account) => {
  if(account) {
    sessionModel.deleteMany({ account: account }).exec();
  }
}

const deleteSession = (token) => {
  return sessionModel.deleteOne({ token: token }).exec();
}

router.delete("/sessions", async (req, res) => {
  let session = await sessionModel.findOne({ token: req.body.token }).exec();
  if(!session) {
    return res.status(400).json({ message: "Session not found." });
  }
  if (deleteSession(session.token)) {
    deleteOldSessions(session.account);
    return res.status(200).json({ message: "Session deleted." });
  } else {
    return res.status(400).json({ message: "Session not found." });
  } 
});

export default {
  router,
  confirm,
  checkSession,
  createSession,
  getSessionByToken,
}