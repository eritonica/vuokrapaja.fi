// Initialize Node.js express server
import express from "express";
import cors  from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

let port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" })); // allow requests from localhost:3000

app.get("/", (req, res) => {
  res.send("How are you here! Get lost, but hello since you are here.");
});

// Check that databases and tables are created.

import schema from "./dependancies/schema.js";
schema.createSessionTable();
schema.createAccountTable();

// Router routes
import accounts from './routes/accounts.js';
app.use("/api", accounts.router);
import sessions from './routes/sessions.js';
app.use("/api", sessions.router);

// Static route, serve client build if it exists.
app.use(express.static('../client/build'));

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

