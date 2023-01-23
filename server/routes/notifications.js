import express from "express";
import mailer from "../dependancies/mailer.js";

import notificationModel from "../schemas/notification.js";
import apartmentModel from "../schemas/apartment.js";
import companyModel from "../schemas/company.js";
import applicationModel from "../schemas/application.js";
import accountModel from "../schemas/account.js";

const router = express.Router();

const sendToApartmentCompany = async (apartmentId, application, message) => {
  let hostAddress = mailer.createHostAddress();
  if(hostAddress == "://") {
    throw new Error("Host address is empty, check your environment.");
  }
  let apartment = await apartmentModel.findById(apartmentId).exec();
  if (apartment) {
    let company = await companyModel.findById(apartment.company).exec();
    if (company) {
      let notification = {
        company: company._id,
        notification: message,
      };
      await setNotification(notification);
      let header = `Uusi hakemus saapunut`
      let msg = `Hei\r\n\r\n`;
      msg += "Olet saanut ilmoitukseesi uuden hakemusken, tarkastathan sen mahdollisimman pian.\r\n\r\n";
      msg += `${hostAddress}/company/application/` + application._id + "\r\n\r\n";
      msg += `Ystävällisin terveisin, \r\n`;
      msg += `Hoosat Oy`;
      let account = await accountModel.findById(company.manager).exec();
      if(account) {
        mailer.sendMail(account.email, header, msg);
      }
    }
  }
};

const sendToApplicationCreator = async (applicationId, message) => {
  let hostAddress = mailer.createHostAddress();
  let application = await applicationModel.findById(applicationId).exec();
  // console.log(application);
  if (application) {
    let account = await accountModel.findById(application.creator).exec();
    // console.log(account);
    if (account) {
      if(message == "accepted") {
        let notification = {
          account: account._id,
          notification: "Hakemus hyväksytty|application|" + application._id,
        };
        await setNotification(notification);
      } else if(message == "rejected") {
        let notification = {
          account: account._id,
          notification: "Hakemus hylätty|application|" + application._id,
        };
        await setNotification(notification);
      }
      let header = `Hakemuksesi tilassa muutos.`
      let msg = `Hei\r\n\r\n`;
      if(message === "accepted") {
        msg += "Hakemuksesi seuraavasta asunnosta on hyväksytty. Olethan mahdollisimman pian vuokranantajaan yhteydessä.\r\n\r\n";
      } else if(message === "rejected") {
        msg += "Hakemuksesi seuraavasta asunnosta on hylätty. Voit yrittää laittaa uuden hakemuksen tarkempien tietojen kanssa tai olla yhteydessä vuokranantajaan suoraan.\r\n\r\n";
      }
      msg += `${hostAddress}/company/application/` + application.property + "\r\n\r\n";
      msg += `Ystävällisin terveisin, \r\n`;
      msg += `Hoosat Oy`;
      mailer.sendMail(account.email, header, msg);
    }
  }
};


const setNotification = async (notification) => {
  let newNotification = new notificationModel(notification);
  await newNotification.save();
  return newNotification;
};

const getNotification = async (id) => {
  let notification = await notificationModel.findById(id).exec();
  if (notification) {
    return notification;
  } else {
    return null;
  }
}

const getNotifications = async (ids) => {
  let notifications = await notificationModel.find({ _id: { $in: ids } }).exec();
  if (notifications) {
    return notifications;
  } else {
    return null;
  }
}

router.get("/notifications/account/:account", async (req, res) => {
  // check if req.params.account is not undefined
  if (req.params.account !== "undefined" && req.params.account !== undefined) {
    let notifications = await notificationModel.find({ account: req.params.account }).exec();
    if (notifications) {
      let notificationsArray = [];
      for (let i = 0; i < notifications.length; i++) {
        if(notifications[i].read === false) {
          let notification = {
            _id: notifications[i]._id,
            account: notifications[i].account,
            company: notifications[i].company,
            notification: notifications[i].notification,
            read: notifications[i].read,
            created: notifications[i].created,
          }
          notificationsArray.push(notification);
        }
      }
      res.json({ "message" : "success", "data" : notificationsArray });
    } else {
      res.json({ "message" : "error", "error" : "No notifications found" });
    }
  } else {
    res.json({ "message" : "error", "error" : "No account id provided" });
  }
});

router.get("/notifications/company/:company", async (req, res) => {
  // check if req.params.account is not undefined
  if (req.params.company !== "undefined" && req.params.company !== undefined) {
    let notifications = await notificationModel.find({ company: req.params.company }).exec();
    if (notifications) {
      let notificationsArray = [];
      for (let i = 0; i < notifications.length; i++) {
        if(notifications[i].read === false) {
          let notification = {
            _id: notifications[i]._id,
            account: notifications[i].account,
            company: notifications[i].company,
            notification: notifications[i].notification,
            read: notifications[i].read,
            created: notifications[i].created,
          }
          notificationsArray.push(notification);
        }
      }
      res.json({ "message" : "success", "data" : notificationsArray });
    } else {
      res.json({ "message" : "error", "error" : "No notifications found" });
    }
  } else {
    res.json({ "message" : "error", "error" : "No company id provided" });
  }
});

router.post("/notifications", async (req, res) => {
  // check if req.body.account is not undefined
  if (req.body.account !== "undefined" && req.body.account !== undefined) {
    let notification = {
      account: req.body.account,
      company: req.body.company,
      notification: req.body.notification,
      read: req.body.read,
      created: req.body.created,
    }
    await setNotification(notification);
    res.json({ "message" : "success", "data" : notification });
  } else {
    res.json({ "message" : "error", "error" : "No account id provided" });
  }
});

router.put("/notifications/:id", async (req, res) => {
  if(req.params.id !== "undefined" && req.params.id !== undefined) {
    let notification = await getNotification(req.params.id);
    if (notification) {
      notification.account = req.body.account;
      notification.company = req.body.company;
      notification.notification = req.body.notification;
      notification.read = req.body.read;
      notification.created = req.body.created;
      notification.save();
      res.json({ "message" : "success", "data" : notification });
    } else {
      res.json({ "message" : "error", "error" : "No notification found" });
    }
  } else {
    res.json({ "message" : "error", "error" : "No notification id provided" });
  }
});

router.put("/notifications/markasread/:id", async (req, res) => {
  if(req.params.id !== "undefined" && req.params.id !== undefined) {
    let notification = await getNotification(req.params.id);
    if (notification) {
      notification.read = true;
      notification.save();
      res.json({ "message" : "success", "data" : notification });
    } else {
      res.json({ "message" : "error", "error" : "No notification found" });
    }
  } else {
    res.json({ "message" : "error", "error" : "No notification id provided" });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  let notification = await getNotification(req.params.id);
  if (notification) {
    notification.remove();
    res.json({ "message" : "success", "data" : notification });
  } else {
    res.json({ "message" : "error", "error" : "No notification found" });
  }
});

export default {
  router,
  setNotification,
  getNotification,
  getNotifications,
  sendToApartmentCompany,
  sendToApplicationCreator,
};