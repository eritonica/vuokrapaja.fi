const express = require("express");
const router = express.Router();

const database = require("../dependancies/sqlite");
const crypto = require("../dependancies/crypto");
const mailer = require("../dependancies/mailer");
const accounts = require("./account");


router.route("/session").post(async (req, res) => {
  let account = accounts.getAccountByEmail(req.body.email);
  if(account === null) {
    res.status(400).json({ message: "Account does not exist." });
    return;
  } else {
    if(account.active === 0) {
      res.status(400).json({ message: "Account is not active." });
      return;
    }
    if(crypto.compare(req.body.password, account.password) === false) {
      res.status(400).json({ message: "Password is incorrect." });
      return;
    }
    let db = database.openDatabase("session");
    let sql = `INSERT INTO session (account_id, token) VALUES (?, ?)`;
    let token = crypto.generateString(32);
    let data = [account.id, token];
    let result = await db.run(sql, data);
    database.close(db);
    if(result === true) {
      res.status(200).json({ token: token });
    } else {
      console.log("Error: " + result);
      res.status(400).json({ message: result.message });
    }
  }
});

router.route("/session").delete ((req, res) => {

});

module.exports = router;