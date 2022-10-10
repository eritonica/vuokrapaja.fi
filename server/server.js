// Initialize Node.js express server
import fs, { readdir } from "fs";
import http from "http";
import https from "https";
import express, { urlencoded } from "express";

import cors  from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import multer from 'multer';
import session from 'express-session';
import flash from 'express-flash';


const app = express();
dotenv.config();

let port = process.env.PORT || 8080;

// Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
let allowedDomains = JSON.parse(process.env.CORS_ORIGIN) || [ "http://localhost:3000" ];
console.log("Allowed CORS domains: ", allowedDomains);
app.use(cors({ origin : (origin, callback) => {
  if(!origin) return callback(null, true);
  if(allowedDomains.indexOf(origin) === -1) {
    let msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
    return callback(new Error(msg), false);
  }
  return callback(null, true);
}, credentials: true }));

// Static route, serve client build if it exists.
import path from 'path';
const __dirname = path.resolve();
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname + '/../client/build')));

// Open MongoDB connection
mongoose.connect(process.env.ATLAS_URI, { 
  useNewUrlParser: true,  
  useUnifiedTopology: true 
});

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  let user = await accounts.addGoogleUser(payload.sub, payload.email, payload.given_name, payload.family_name, payload.picture);
  console.log("user", user);
  if(user) {
    let localToken = await sessions.createSession(user._id);
    res.status(200).json({ message: "Success", token: localToken.token });
  } else {
    res.status(400).json({ message: "Error happened", error: "Failed Google Login." });
  }
});

app.delete("/auth/google", async (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Success" });
});


// File uploading multipart form data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    let randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    cb(null, randomToken + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExt = /jpg|jpeg|png/;
    let checkExt = allowedExt.test(path.extname(file.originalname).toLowerCase());
    let checkMimeType = allowedExt.test(file.mimetype);
    req.isFileValid = checkExt && checkMimeType;
    cb(null, checkExt && checkMimeType);
  }
});

let single = upload.single("file")

app.post("/api/uploads/single", (req, res) => {
  single(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File type not allowed." });
    }
    sessions.checkSession(req, res, async () => {
      return res.status(200).json({ message: "File uploaded successfully.", file: req.file });
    });
  });
});

let multiple = upload.array("files", 25);

app.post("/api/uploads/multiple", (req, res) => {
  multiple(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File type not allowed." });
    }
    sessions.checkSession(req, res, async () => {
      return res.status(200).json({ message: "Files uploaded successfully.", files: req.files });
    });
  });
});

// Routes, loading these could be automated without ES6 import/export support

import files from "./routes/files.js";
app.use("/api", files.router);
import search from "./routes/search.js";
app.use("/api", search.router);
import locations from './routes/locations.js';
app.use("/api", locations.router);
import accounts from './routes/accounts.js';
app.use("/api", accounts.router);
import sessions from './routes/sessions.js';
app.use("/api", sessions.router);
import profiles from './routes/profiles.js';
app.use("/api", sessions.checkSession, profiles.router);
import companies from './routes/companies.js';
app.use("/api", sessions.checkSession, companies.router);
import members from './routes/members.js';
app.use("/api", sessions.checkSession, members.router);
import aparments from './routes/apartments.js';
app.use("/api", sessions.checkSession, aparments.router);

// Catch all routes, serve client build if it exists.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

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

