// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const SendEmail = async (options) => {
  // 1- create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secur false port = 587 , true port = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailDetails = {
    from: "noon E-commerce <ali.sayed9595@gmail.com>", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(mailDetails);
};
module.exports = SendEmail;
