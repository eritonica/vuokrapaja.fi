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

const createHostAddress = () => {
  let domain = process.env.DOMAIN;
  let protocol = process.env.PROTOCOL
  let port = process.env.PORT;
  if(domain == "localhost") {
    return `${protocol}://${domain}:${port}`;
  } else {
    return `${protocol}://${domain}`;
  }
}

export default { 
  sendMail,
  createHostAddress
};