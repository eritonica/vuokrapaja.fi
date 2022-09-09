const nodemailer = require("nodemailer");
require('dotenv').config();

const sendMail = async (email, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let options = {
    from: process.env.GMAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };
  let info = await transporter.sendMail(options);
  console.log("Message sent: %s", info.messageId);
  return info;
};

module.exports = {
  sendMail,
};