import express from "express";
import sessions from "./sessions.js";
import crypto from "../dependancies/crypto.js";
import mailer from "../dependancies/mailer.js";
import idRequestSchema from "../schemas/id-request.js";
import applicationSchema from "../schemas/application.js";
import applicantSchema from "../schemas/applicant.js";
import accountSchema from "../schemas/account.js";

const router = express.Router();


router.get("/id-request/applicants/:validation", async (req, res) => {
  let { validation } = req.params;
  if(validation === undefined) return res.status(400).json({ result: "error", message: "Validation was empty."});
  try {
    let request = await idRequestSchema.findOne({ validation: validation }).populate("application").exec();
    if(request.application === undefined) return res.status(400).json({ result: "error", message: "Failed to populate application"});
    let applicants = await applicantSchema.find({ application: request.application._id }).exec();
    if(!applicants) return res.status(404).json({ result: "error", message: "Applicants could not be found." });
    return res.status(200).json({
      result: "success",
      applicants : applicants
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ result: "error", message: error._message });
  }
});

router.get("/id-request/:application", async (req, res) => {
  sessions.checkSession(req, res, async () => {
    let { application } = req.params;
    if(application === undefined) return res.status(400).json({ result: "error", message: "Application was not found." });
    try {
      let request = await idRequestSchema.findOne({ application: application }).exec();
      if(request === null) return res.status(400).json({ result: "error", message: "Application ID request was not found." });
      if(request.type === "credit-check") {
        // TODO: enable automatic deletion.
        await idRequestSchema.deleteOne({ _id: request._id }).exec();
      }
      return res.status(200).json({ result: "success", numbers: request.numbers });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ result: "error", message: error._message });
    }
  });
});

router.post("/id-request/credit-check", async (req, res) => {
  sessions.checkSession(req, res, async () => {
    let { requested, application } = req.body
    if(requested !== undefined) {
      try {
        let requestedAccount = await accountSchema.findById(requested).exec();
        let requestedApplication = await applicationSchema.findById(application).exec(); 
        let requesterAccount = req.session.account;
        let validation = crypto.generateString(32);
        let creditCheck = new idRequestSchema({
          type: "credit-check",
          application: requestedApplication._id,
          requester: requesterAccount._id,
          requested: requestedAccount._id,
          validation: validation,
          created: Date.now(),
          updated: Date.now()
        });
        await creditCheck.save();
        let hostAddress = mailer.createHostAddress();
        if(hostAddress === "://" || hostAddress === "://:") {
          throw new Error("Host address is empty, check your environment.");
        }
        let header = `Henkilötunnus pyyntö Vuokrapajassa`;
        let msg = `Hei ${requestedAccount.username},\r\n\r\n`;
        msg += `Asia koskee hakemustasi kohteesta:\r\n`;
        msg += `${hostAddress}/apartments/${requestedApplication.property}\r\n\r\n`; 
        msg += `Jos haluat hakemuksesi etenevän vuokraisäntä on pyytänyt luottotietojen tarkistusta.\r\n\r\n`;
        msg += `Syötä hakijoiden henkilötunnukset seuraavalla sivulla. Välitämme ne kiinteistön vuokraajalle turvallisesti:\r\n`;
        msg += `${hostAddress}/application/id-request/${validation}\r\n\r\n`
        msg += `Huomautamme, että henkilötunnukset ovat vain kerran nähtävissä kiinteistön vuokraajalle.\r\n`;
        msg += `Joten saatat joutua antamaan ne useamman kerran. Kuten vuokrasopimusta varten.\r\n`;
        await mailer.sendMail(requestedAccount.email, header, msg);
        return res.status(200).json({ result: "success" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ result: "error", message: error._message });
      }
    } else {
      return res.status(400).json({ result: "error", message: "Requested was empty."});
    }
  })
});

router.post("/id-request/credit-check/answer/:validation", async (req, res) => {
  let { validation } = req.params;
  console.log(validation);
  if(validation === undefined) return res.status(400).json({ result: "error", message: "Validation was empty."});
  let { numbers } = req.body;
  console.log(numbers);
  if(numbers === undefined) return res.status(400).json({ result: "error", message: "ID numbers were not given."});
  try {
    let request = await idRequestSchema.findOneAndUpdate({ validation: validation }, { numbers : numbers }).populate("requester").populate("application").exec();
    let hostAddress = mailer.createHostAddress();
    if(hostAddress === "://" || hostAddress === "://:") {
      throw new Error("Host address is empty, check your environment.");
    }
    let header = `Henkilötunnus vastaus Vuokrapajassa`;
    let msg = `Hei ${request.requester.username},\r\n\r\n`;
    msg += `Asia koskee hakemusta:\r\n`;
    msg += `${hostAddress}/company/application/${request.application._id}\r\n\r\n`; 
    msg += `Muista hakemuksessa henkilötunnukset ovat vain kerran luettavissa.\r\n`;
    msg += `Ja ne ovat tarkoitettu vain luottotieto tarkistusta varten.\r\n`;
    msg += `Vuokrasopimusta tehdessä voit pyytää henkilötunnukset vuokralaisilta uudestaan.\r\n`;
    await mailer.sendMail(request.requester.email, header, msg);
    return res.status(200).json({ result: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ result: "error", message: error._message });
  }
});

export default { 
  router 
};
