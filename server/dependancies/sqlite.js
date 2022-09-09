import Database from "sqlite3";

const open = (dbName) => {
  if(dbName === undefined) {
    return new Database.Database(
      ":memory:",
      Database.OPEN_READWRITE | Database.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Connected to the in-memory SQlite database.");
      }
    );
  } else {
    return new Database.Database(
      `../database/${dbName}.db`,
      Database.OPEN_READWRITE | Database.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log(`Connected to the ${dbName} SQlite database.`);
      }
    );
  }
};

const close = (db) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
};

export default { open, close }