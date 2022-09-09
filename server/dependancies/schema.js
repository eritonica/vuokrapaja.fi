import database from "./sqlite.js";


let createAccountTable = () => {
  let db = database.open("accounts");
  let sql = `CREATE TABLE IF NOT EXISTS accounts (
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
  let db = database.open("sessions");
  let sql = `CREATE TABLE IF NOT EXISTS sessions (
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


export default { 
  createAccountTable,
  createSessionTable
}