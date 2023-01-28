import express from "express";
import Stripe from "stripe";
import crypto from "../dependancies/crypto.js";
import apartments from "./apartments.js";
import sessions from "./sessions.js";
import payment from "../schemas/payment.js";

const router = express.Router();

router.get("/payments/:code", async (req, res) => {
  if(req.headers.token === undefined) {
    return res.status(401).json({ result: "error", message: "Session id not found." });
  }
  let session = await sessions.confirm(req.headers.token);
  if(session === undefined || session.account === undefined) {
    return res.status(401).json({ result: "error", message: "Session confirm failed." });
  }
  if(req.params.code === undefined) {
    return res.status(404).json({ result: "error", message: "Failed to fetch payment." });
  }
  let pay = await payment.findOne({ code: req.params.code, account: session.account });
  if(pay === undefined) {
    return res.status(404).json({ result: "error", message: "Failed to fetch payment." });
  }
  res.status(200).json({ result: "success", message: pay});
});

router.put("/payments/", async (req, res) => {
  if(req.headers.token === undefined) {
    return res.status(400).json({ result: "error", message: "Session id not found." });
  }
  let session = await sessions.confirm(req.headers.token);
  if(session === undefined || session.account === undefined) {
    return res.status(404).json({ result: "error", message: "Session confirm failed." });
  }
  if(req.body.code === undefined) {
    return res.status(404).json({ result: "error", message: "Failed to fetch payment." });
  }
  let pay = await payment.findOneAndUpdate({ code: req.body.code }, { paid: true });
  console.log(pay);
  if(pay === undefined) {
    return res.status(404).json({ result: "error", message: "Failed to fetch payment." });
  }
  res.status(200).json({ result: "success", message: pay});
});

export default {
  router,
};