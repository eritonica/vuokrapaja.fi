import nodemailer from "nodemailer";

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
  return info;
};

export default { sendMail };