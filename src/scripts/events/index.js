const eventEmitter = require("./eventEmitter");
const nodemailer = require("nodemailer");

module.exports = () => {
  eventEmitter.on("send_email", async (emailData) => {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_POST,
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FORM, // sender address
      ...emailData,
    });
  });
};
