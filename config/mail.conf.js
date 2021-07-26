const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "giladdekel123@gmail.com", // generated ethereal user
      pass: "giladdekeladmin", // generated ethereal password
    },
  });

// const transporter = nodemailer.createTransport(transport);

// transporter.verify((error, success) => {
//   if (error) console.log(error);
//   else console.log("ready to send mails");
// });

module.exports = transporter;
