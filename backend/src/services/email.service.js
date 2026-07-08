import transporter from "../config/mailer.js";
import nodemailer from "nodemailer";
import ApiError from "../utils/ApiError.js";

import complaintCreatedTemplate from "../templates/complaintCreated.template.js";
import complaintAssignedTemplate from "../templates/complaintAssigned.template.js";
import complaintResolvedTemplate from "../templates/complaintResolved.template.js";
import statusChangedTemplate from "../templates/statusChanged.template.js";

/*
|--------------------------------------------------------------------------
| Generic Email Sender
|--------------------------------------------------------------------------
*/

export const sendEmail = async ({
    to,
    subject,
    html,
}) => {

    if (!to) {
        throw new ApiError(
            400,
            "Recipient email is required."
        );
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    });

};

/*
|--------------------------------------------------------------------------
| Complaint Created
|--------------------------------------------------------------------------
*/

export const sendComplaintCreatedEmail = async ({
    email,
    name,
    complaintTitle,
}) => {

    console.log("Sending complaint created email to:", email);

    await sendEmail({

        to: email,

        subject: "Complaint Submitted",

        html: complaintCreatedTemplate({
            name,
            complaintTitle,
        }),

    });

};

/*
|--------------------------------------------------------------------------
| Complaint Assigned
|--------------------------------------------------------------------------
*/

export const sendComplaintAssignedEmail = async ({
    email,
    name,
    complaintTitle,
}) => {

    await sendEmail({

        to: email,

        subject: "Complaint Assigned",

        html: complaintAssignedTemplate({
            name,
            complaintTitle,
        }),

    });

};

/*
|--------------------------------------------------------------------------
| Complaint Status Changed
|--------------------------------------------------------------------------
*/

export const sendStatusChangedEmail = async ({
    email,
    name,
    complaintTitle,
    status,
}) => {

    await sendEmail({

        to: email,

        subject: "Complaint Status Updated",

        html: statusChangedTemplate({
            name,
            complaintTitle,
            status,
        }),

    });

};

/*
|--------------------------------------------------------------------------
| Complaint Resolved
|--------------------------------------------------------------------------
*/

export const sendComplaintResolvedEmail = async ({
    email,
    name,
    complaintTitle,
}) => {

    await sendEmail({

        to: email,

        subject: "Complaint Resolved",

        html: complaintResolvedTemplate({
            name,
            complaintTitle,
        }),

    });

};


 export const SendVerificationCode = async (UserMail) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
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