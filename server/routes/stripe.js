import express from "express";
import Stripe from "stripe";
import crypto from "../dependancies/crypto.js";
import apartments from "./apartments.js";
import sessions from "./sessions.js";
import payment from "../schemas/payment.js";
import accounts from "./accounts.js";
import referralSchema from "../schemas/referral.js";

const router = express.Router();

router.post("/stripe-one-time-payment", async (req, res) => {
  try {
    if(req.body.token === undefined) {
      return res.status(400).json({ result: "error", message: "Session id not found." });
    }
    let session = await sessions.confirm(req.body.token);
    if(session === undefined || session.account === undefined) {
      return res.status(404).json({ result: "error", message: "Session confirm failed." });
    }
    if(req.body.apartment === undefined) {
      return res.status(400).json({ result: "error", message: "Apartment id not found." });
    }
    if(req.body.company === undefined) {
      return res.status(400).json({ result: "error", message: "Company id not found."});
    }
    
    let code = crypto.generateString(12);
    let paidApartmentsCount = apartments.countPaidAparmentsByCompany(req.body.company);
    if(paidApartmentsCount === undefined) {
      return res.status(500).json({ result: "error", message: "Could not calculate published apartments."});
    }
    let success_url = process.env.STRIPE_SUCCESS + "?apartment=" + req.body.apartment + "&security=" + code + "&token=" + req.body.token;
    const pay = new payment({
      account: session.account,
      code: code,
      company: req.body.company,
      apartment: req.body.apartment,
    });
    await pay.save();
    // FI12 7997 7990 6600 99
    // HOLVFIHH
    let account = await accounts.getAccountByToken(session.token);
    console.log(account);
    if(account) {
      let referral = await referralSchema.find({ recipient: account.email }).exec();
      console.log(referral);
      if(referral[0].deal.startsWith("free: ")) {
        let months = parseInt(referral[0].deal.split(": ")[1]);
        console.log(months);
        let elapsedTime = Date.now() - referral[0].created;
        let elapsedMonths = elapsedTime / (1000 * 60 * 60 * 24 * 30);
        if(elapsedMonths <= months) {
          console.log("Referral deal is still valid");
          return res.redirect(303, success_url + "&free=month");
        } else {
          console.log("Referral deal has expired");
        }
      }
    }
    if(paidApartmentsCount % 3 === 0) {
      return res.redirect(303, success_url + "&free=third");
    }
    const secret = process.env.STRIPE_PRIVATE;
    const stripe = new Stripe(secret);
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_ONETIMEPAYMENT,
          quantity: 1,
        }
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: success_url,
      cancel_url: process.env.STRIPE_CANCEL,
    });
    return res.redirect(303, stripeSession.url);
  } catch (error) {
    return res.status(500).json({"result": "error", "message": "Something went wrong!" });
  }
});

export default {
  router,
};