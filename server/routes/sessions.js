import express from "express";
import database from "../dependancies/sqlite.js";
import crypto from "../dependancies/crypto.js";
import accounts from "./accounts.js";

const router = express.Router();

const confirm = (token) => {
  let db = database.open("sessions");
  let sql = `SELECT * FROM sessions WHERE token = ?`;
  let data = [token];
  db.get(sql, data, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row === undefined) {
      return null;
    } else {
      return row;
    }
  });
  database.close(db);
}

// Create session
router.post("/session", (req, res) => {
  let account = accounts.getAccountByEmail(req.body.email);
  if (account === null) {
    res.status(400).json({ message: "Account does not exist." });
  }
  if (account.activated === 0) {
    res.status(400).json({ message: "Account is not activated." });
  }
  if(crypto.compare(req.body.password, account.password)) {
    let db = database.open("sessions");
    let sql = `INSERT INTO sessions (account_id, token) VALUES (?, ?)`;
    let token = crypto.generateString(32);
    let data = [account.id, token];
    db.run(sql, data, (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return console.error(err.message);
      }
      res.status(200).json({ message: "Session created.", token: token });
    });
    database.close(db);
  }
});

// Update and session
router.put("/session", (req, res) => {
  let db = database.open("sessions");
  let sql = `UPDATE sessions SET token = ? WHERE token = ?`;
  let token = crypto.generateString(32);
  let data = [token, req.body.token];
  db.run(sql, data, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return console.error(err.message);
    }
    res.status(200).json({ message: "Session updated.", token: token });
  });
  database.close(db);
});

// Delete session
router.delete("/session", (req, res) => {
  let db = database.open("sessions");
  let sql = `DELETE FROM sessions WHERE token = ?`;
  let data = [req.body.token];
  db.run(sql, data, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return console.error(err.message);
    }
    res.status(200).json({ message: "Session deleted." });
  });
  database.close(db);
});

export default {
  router,
  confirm
}