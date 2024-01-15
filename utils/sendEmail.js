const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, name, otp, template) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const message = {
    from: process.env.GMAIL_APP_FROM,
    to,
    subject,
    template,
    context: {
      name,
      otp,
    },
  };

  // Send Email
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
    }
  });
};

module.exports = { sendEmail };
