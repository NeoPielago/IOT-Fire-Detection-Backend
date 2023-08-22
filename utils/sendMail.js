import nodemailer from "nodemailer";

const sendMail = (html, to, subject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: "neopielago123@gmail.com",
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent:  ", info.response);
    }
  });
};

export default sendMail;
