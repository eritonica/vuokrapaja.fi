import express from "express";
import mailer from "../dependancies/mailer.js";
import crypto from "../dependancies/crypto.js";
import referral from "../schemas/referral.js";
import account from "../schemas/account.js";
import accounts from "./accounts.js";
import profiles from "./profiles.js";

const router = express.Router();

const sendOffer = async (seller, recipient, name, message, deal) => {
  if(seller === undefined || name === undefined || recipient === undefined || message == undefined || deal === undefined) {
    throw new Error("Seller account information, offer recipient name, recipient, message or deal was empty.");
  }
  let hostAddress = mailer.createHostAddress();
  if(hostAddress === "://" || hostAddress === "://:") {
    throw new Error("Host address is empty, check your environment.");
  }

  let activationLink = hostAddress + "/register";
  let code = crypto.generateString(12);
  if(code === "") {
    throw new Error("crypto.generateString failed to generate random string.");
  }
  activationLink += "/" + code;
  try {
    const newOffer = new referral({
      recipient: recipient,
      code: token,
      seller: seller,
      deal: deal,
      active: true,
      created: Date.now(),
      updated: Date.now()
    });
    newOffer.save();
    let header = `Vuokrapaja.fi tarjous`;
    let msg = `Ystävällisin terveisin,\r\n\r\n`;
    msg += `Olet saanut tarjouksen https://vuokrapaja.fi vuokravälitys palvelusta.\r\n`;
    msg += `Viesti tarjoajalta:\r\n\r\n${message}\r\n\r\n`;
    msg += `Huomioi, että tarjous ei ole enään voimassa jos olet aikaisemmin\r\nVuokrapajaan rekisteröitynyt sähköpostiosoitteella johon tarjouksen sait.`;
    msg += `Voit hyväksyä tarjouksen seuraamalla seuraavaa linkkiä:\r\n`;
    msg += `${activationLink}`;
    await mailer.sendMail(recipient, header, msg);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getActiveOfferByEmail = async (email) => {
  let offer = await referral.findOne({ email: email, active: true }).exec();
  if(!offer) {
		throw new Error("Can not find active offer with the email.");
	} else {
		return offer;
	}
}

const getActiveOfferByCode = async(code) => {
  let offer = await referral.findOne({ code: code, active: true}).exec();
  if(!offer) {
		throw new Error("Can not find active offer with the email.");
	} else {
		return offer;
	}
}

const useOffer = async (token) => {
  let account = await accounts.getAccountByToken(token);
  if(!account) {
    throw new Error("Can not find account with the token.");
  }
  let offer = await referral.findOneAndUpdate({ email: email, active: true }, { active: false }).exec();
  if(!offer) {
    throw new Error("Can not find and update the offer.");
  }
  return offer;
}

router.get("/referral/:code", async (req, res) => {
  if(req.params === undefined || req.params.code === undefined) {
    return res.status(404).json({ "result": "error", "message": "code is empty."});
  }
  try {
    let offer = await getActiveOfferByCode(req.params.code);
    if(offer) {
      console.log(offer);
      return res.status(200).json({ "result" : "success", "message": offer });
    } else {
      return res.status(404).json({ "result" : "error", "message": "Offer not found by offer code." });
    }
  } catch (error) {
    return res.status(500).json({ "result": "error", "message": error });
  }
});

router.post("/referral/", async (req, res) => {
  if(req.body === undefined || req.body.token === undefined) {
    return res.status(404).json({ "result": "error", "message": "token is empty."});
  }
  if(req.body.recipient === undefined || req.body.name === undefined || req.body.message === undefined || req.body.deal === undefined) {
    
  }
  try {
    let profile = profiles.getProfileByToken(req.body.token);
    if(!profile) {
      return res.status(400).json({ "result": "error", "message": "Could not find profile with the token." });
    }
    if(profile.type !== "Reseller") {
      return res.status(400).json({ "result": "error", "message": "Profile is not reseller profile." });
    }
    let account = await account.findOne({ email : req.body.recipient }).exec();
    if(account !== undefined && account.email !== undefined) {
      let result = await sendOffer(profile.account, req.body.recipient, req.body.name, req.body.message, req.body.deal);
      if(result === true) {
        return res.status(200).json({ "result": "success", "message": "Offer has been sent to the recipient email." })
      } else {
        return res.status(500).json({ "result" : "error", "message": "For some reason could not send the offer." });
      }
    } else {
      return res.status(400).json({ "result" : "error", "message": "Account with the email already exists, offer invalid." });
    }
  } catch (error) {
    return res.status(500).json({ "result": "error", "message": error });
  }
});


router.put("/referral/", async (req, res) => {
  if(req.body === undefined || req.body.token === undefined) {
    return res.status(404).json({ "result": "error", "message": "token is empty."});
  }
  try {
    let Offer = useOffer(req.body.token);
    if(Offer) {
      return res.status(200).json({ "result" : "success", "message": Offer });
    } else {
      return res.status(404).json({ "result" : "error", "message": "Offer not found with the token." });
    }
  } catch (error) {
    return res.status(500).json({ "result": "error", "message": error });
  }
});

export default {
  router,
  sendOffer,
  useOffer,
  getActiveOfferByEmail,
  getActiveOfferByCode,
}