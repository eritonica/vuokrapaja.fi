import express from 'express';
import crypto from '../dependancies/crypto.js';
import account from '../schemas/account.js';

const router = express.Router();

const confirmAdmin = (code) => {
  if(code === undefined) {
    return false;
  }
  return crypto.compare(code, process.env.ADMIN_PASSWORD);
}

router.get("/admin/accounts/", async () => {
  if(req.body === undefined || req.body.code === undefined) {
    return res.status(400).json({ "result": "error", "message": "Stop messing around, use the correct data or get the hell out of here!" });
  } 
  if(!confirmAdmin(req.body.code)) {
    return res.status(401).json({ "result": "error", "message": "Stop messing around, use the correct code or get the hell out of here!" });
  }
  try {
    let accounts = await account.find({}).exec();
    return res.status(200).json({ "result": "success", "message": accounts });
  } catch (err) {
    return res.status(500).json({ "result": "error", "message": "error" });
  }
});

router.get("/admin/accounts/:id", async () => {
  if(req.body === undefined || req.body.code === undefined) {
    return res.status(400).json({ "result": "error", "message": "Stop messing around, use the correct data or get the hell out of here!" });
  } 
  if(!confirmAdmin(req.body.code)) {
    return res.status(401).json({ "result": "error", "message": "Stop messing around, use the correct code or get the hell out of here!" });
  }
  if(req.params.id === undefined) {
    return res.status(404).json({ "result": "error", "message": "Account id is undefined." });
  }
  try {
    let accounts = await account.find({ _id : req.params.id }).exec();
    return res.status(200).json({ "result": "success", "message": accounts });
  } catch (err) {
    return res.status(500).json({ "result": "error", "message": "error" });
  }
});

router.delete("/admin/accounts/:id", async () => {
  if(req.body === undefined || req.body.code === undefined) {
    return res.status(400).json({ "result": "error", "message": "Stop messing around, use the correct data or get the hell out of here!" });
  } 
  if(!confirmAdmin(req.body.code)) {
    return res.status(401).json({ "result": "error", "message": "Stop messing around, use the correct code or get the hell out of here!" });
  }
  if(req.params.id === undefined) {
    return res.status(404).json({ "result": "error", "message": "Account id is undefined." });
  }
});


export default { 
  router
}