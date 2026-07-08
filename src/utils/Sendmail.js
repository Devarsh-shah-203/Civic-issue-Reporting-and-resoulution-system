import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import transporter from "../config/mailer.js";

//send mail

const SendVerificationCode = async (UserMail) => {
const code = String(Math.floor(100000+Math.random()*900000));

try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER , // sender address
      to: UserMail, // list of recipients
      subject: "Forgot Password", // subject line
      text: `Your verifiaction code : ${code}`, // plain text body
      html: `<b> Your verifiaction code : ${code}</b>`, // HTML body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }

  return code;
};
// invoice detail remaining
const SendInvoice = async (UserMail, invoiceDetails) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER , // sender address
      to: UserMail, // list of recipients
      subject: "Invoice", // subject line
      text: `Your verifiaction code : ${code}`, // plain text body
      html: `<b> Your verifiaction code : ${code}</b>`, // HTML body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }

  return code;
};


export {SendVerificationCode,SendInvoice};
