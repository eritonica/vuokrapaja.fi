const database = require("./sqlite");

let createAccountTable = () => {
  let db = database.openDatabase("account");
  let sql = `CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    active INTEGER DEFAULT 0,
    activation_code TEXT,
    UNIQUE (email)
  )`;
  db.run(sql, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Created account table.");
  });
};

let createSessionTable = () => {
  let db = database.openDatabase("session");
  let sql = `CREATE TABLE IF NOT EXISTS session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    UNIQUE (token),
    FOREIGN KEY (account_id) REFERENCES account (id)
  )`;
  db.run(sql, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Created session table.");
  });
};

module.exports = {
  createAccountTable,
  createSessionTable,
}