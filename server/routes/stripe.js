import express from "express";
import Stripe from "stripe";
import crypto from "../dependancies/crypto.js";


const router = express.Router();

router.post("/stripe-one-time-payment", async (req, res) => {
  if(req.body.token === undefined) {
    return res.status(400).json({ message: "Session not found." });
  }
  if(req.body.apartment === undefined) {
    return res.status(400).json({ message: "Apartment not found." });
  }
  const secret = process.env.STRIPE_PRIVATE;
  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_ONETIMEPAYMENT,
        quantity: 1,
      }
    ],
    mode: "payment",
    success_url: process.env.STRIPE_SUCCESS + "?apartment=" + req.body.apartment + "&security=" + req.body.token,
    cancel_url: process.env.STRIPE_CANCEL,
  });
  return res.redirect(303, session.url);
});

export default {
  router,
};