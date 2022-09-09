// Initialize Node.js express server
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import cors  from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

let port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN })); 

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

if(process.env.PROTOCOL === "https") {
  // Create https server
  const httpsOptions = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT),
    ca: fs.readFileSync(process.env.HTTPS_CA),
  };
  const httpsServer = https.createServer(httpsOptions, app);
  httpsServer.listen(port, () => {
    console.log(`Server listening on port ${port} using https.`);
  });
} else {
  // Create http server
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Server listening on port ${port} using http.`);
  });
}

