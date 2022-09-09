import express from "express";
import database from "../dependancies/sqlite.js";
import crypto from "../dependancies/crypto.js";
import mailer from "../dependancies/mailer.js";
import sessions from "./sessions.js";

const router = express.Router();

const getAccountByEmail = async (email) => {
  let db = database.open("accounts");
  let sql = `SELECT * FROM accounts WHERE email = ?`;
  let data = [email];
  let result = await db.get(sql, data, (err, row) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return console.error(err.message);
    }
    return row;
  });
  database.close(db);
  if(result === undefined) {
    return null;
  } else {
    return result;
  }
}

// Post a new account
// TODO: Add validation

router.post("/account", (req, res) => {
  let db = database.open("accounts");
  let sql = `INSERT INTO accounts (username, email, password, activation_code) VALUES (?, ?, ?, ?)`;
  let activationCode = crypto.generateString(32);
  let data = [req.body.username, req.body.email, crypto.encrypt(req.body.password), activationCode];
  db.run(sql, data, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return console.error(err.message);
    }
    let header = `Your account has been created.`
    let message = `Hello.\r\n\r\n`;
    message += `Your account has been created. Please click the link below to activate your account.\r\n\r\n`;
    message += `${process.env.ACTIVATION_LINK}/${activationCode}\r\n\r\n`;
    message += `Thank you, sincerely for joining our service.`;
    console.log("To: " + req.body.email);
    console.log("Header: " + header);
    console.log("Message: \r\n" + message);
    mailer.sendMail(req.body.email, header, message);
    res.status(200).json({ message: "Account created, waiting for verification." });
  });
  database.close(db);
});

// Activate an account
router.get("/account/activate/:activationCode",(req, res) => {
  let db = database.open("accounts");
  let sql = `UPDATE accounts SET active = 1 WHERE activation_code = ?`;
  db.run(sql, req.params.activationCode, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return console.error(err.message);
    }
    res.status(200).json({ message: "Account activated, ready for use. Please add your profile information." });
  });
  database.close(db);
});

// Get account by id
// TODO: check if session is valid before getting account with id. 

router.get("/account/:id", (req, res) => {
  let confirmed = sessions.confirm(req.body.token);
  if(confirmed) {
    let db = database.open("accounts");
    let sql = `SELECT * FROM accounts WHERE id = ?`;
    let data = [req.query.id];
    db.get(sql, data, (err, row) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return console.error(err.message);
      }
      res.status(200).json(row);
    });
    database.close(db);
  } else {
    res.status(400).json({ message: "Invalid session." });
  }
});

// Update account by id
// Change unique email or password
// TODO: check if session is valid before modifying account.

router.put("/account/:id", async (req, res) => {
  let confirmed = sessions.confirm(req.body.token);
  if(confirmed) {
    let db = database.open("accounts");
    let sql = `UPDATE accounts SET email = ?, password = ? WHERE id = ?`;
    let data = [req.body.email, req.body.password, req.query.id];
    let result = await db.run(sql, data, (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return console.error(err.message);
      }
      return true;
    });
    if (result) {
      res.status(200).json({ message: "Account updated." });
    } else {
      res.status(400).json({ message: "Account not updated." });
    }
    database.close(db);
  } else {
    res.status(400).json({ message: "Invalid session." });
  }
});

// Delete account by id
// Deactivate account instead of deleting it.
// TODO: Check if session is valid before deleting account.

router.delete("/account/:id", (req, res) => {
  let confirmed = sessions.confirm(req.body.token);
  if(confirmed) {
    let db = database.open("accounts");
    let sql = `UPDATE accounts SET active = 0 WHERE id = ?`;
    let data = [req.query.id];
    db.run(sql, data, (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return console.error(err.message);
      }
      res.status(200).json({ message: "Account deleted." });
    });
    database.close(db);
  } else {
    res.status(400).json({ message: "Invalid session." });
  }
});

export default {
  router,
  getAccountByEmail,
}