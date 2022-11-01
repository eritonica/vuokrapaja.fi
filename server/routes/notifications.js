import express from "express";
import mailer from "../dependancies/mailer.js";

import notificationModel from "../schemas/notification.js";
import apartmentModel from "../schemas/apartment.js";
import companyModel from "../schemas/company.js";
import applicationModel from "../schemas/application.js";
import accountModel from "../schemas/account.js";

const router = express.Router();

const sendToApartmentCompany = async (apartmentId, message) => {
  let apartment = await apartmentModel.findById(apartmentId).exec();
  if (apartment) {
    let company = await companyModel.findById(apartment.company).exec();
    if (company) {
      let notification = {
        company: company._id,
        notification: message,
      };
      await setNotification(notification);
    }
  }
};

const sendToApplicationCreator = async (applicationId, message) => {
  let application = await applicationModel.findById(applicationId).exec();
  if (application) {
    let account = await accountModel.findById(application.account).exec();
    if (account) {
      let notification = {
        account: account._id,
        notification: message + "|application|" + application._id,
      };
      await setNotification(notification);
      let header = `Hakemuksesi tilassa muutos.`
      let message = `Hei\r\n\r\n`;
      message += message + "\r\n\r\n";
      message += "Hakemus ID: " + application._id + "\r\n\r\n";
      message += `Ystävällisin terveisin, \r\n`;
      message += `https://vuokrapaja.fi/`;
      mailer.sendMail(account.email, header, message);
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