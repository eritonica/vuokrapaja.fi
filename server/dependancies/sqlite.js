const sqlite3 = require("sqlite3").verbose();

const openDatabase = (dbName) => {
  if(dbName === undefined) {
    return new sqlite3.Database(
      ":memory:",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Connected to the in-memory SQlite database.");
      }
    );
  } else {
    return new sqlite3.Database(
      `../database/${dbName}.db`,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log(`Connected to the ${dbName} SQlite database.`);
      }
    );
  }
}

const close = (db) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

module.exports = {
  openDatabase,
  close,
}