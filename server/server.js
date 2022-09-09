// Initialize Node.js express server
const express = require('express');
const app = express();

require('dotenv').config();

let port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("How are you here! Get lost, but hello since you are here.");
});

// Check that databases and tables are created.
const schema = require('./dependancies/schema');
schema.createAccountTable();
schema.createSessionTable();

// Router routes
const account = require('./routes/account');
const session = require('./routes/session');
app.use("/api", account.router);

// Static route, serve client build if it exists.
app.use(express.static('../client/build'));

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

