// Initialize Node.js express server
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import cors  from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
const app = express();
dotenv.config();

let port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allowedDomains = process.env.CORS_ORIGIN || [ "http://localhost:3000" ];
app.use(cors({ origin : (origin, callback) => {
  if(!origin) return callback(null, true);
  if(allowedDomains.indexOf(origin) === -1) {
    let msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
    return callback(new Error(msg), false);
  }
  return callback(null, true);
}}));

app.get("/", (req, res) => {
  res.send("How are you here! Get lost, but hello since you are here.");
});

const db = await mongoose.connect(process.env.ATLAS_URI, { 
  useNewUrlParser: true,  
  useUnifiedTopology: true 
});
  

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

