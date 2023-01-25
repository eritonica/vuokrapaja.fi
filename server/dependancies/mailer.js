import nodemailer from "nodemailer";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const isValidEmail = (email) => {
    return emailRegex.test(email);
}

const isValidSubject = (subject) => {
  return subject.length >= 5 && subject.length <= 100;
}

const isValidText = (text) => {
  return text.length >= 10 && text.length <= 10000;
}

const sendMail = async (email, subject, text) => {
  if(!email.trim()) throw new Error('Email address is required');
  if(!subject.trim()) throw new Error('Subject is required');
  if(!text.trim()) throw new Error('Text is required');
  if(!isValidEmail(email)) {
    throw new Error(`An error occurred while sending email: invalid email address.`);
  }
  if(!isValidSubject(subject)) {
    throw new Error(`Subject is too short or long for email.`);
  }

  if(!isValidText(text)) {
    throw new Error(`Text is too short or long for email.`);
  }
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
  try {
    let info = await transporter.sendMail(options);
    return info;
  } catch (error) {
    throw new Error(`An error occured while sending email: ${error.message}`);
  }
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