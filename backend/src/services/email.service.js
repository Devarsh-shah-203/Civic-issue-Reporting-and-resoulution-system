import transporter from "../config/mailer.js";

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