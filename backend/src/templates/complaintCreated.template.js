const complaintCreatedTemplate = ({ name, complaintTitle }) => {
    return `
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height:1.6;">

            <h2>Hello ${name},</h2>

            <p>
                Your complaint has been submitted successfully.
            </p>

            <p>
                <strong>Complaint:</strong>
                ${complaintTitle}
            </p>

            <p>
                Our team will review it shortly.
            </p>

            <br>

            <p>
                Thank you for helping improve your city.
            </p>

        </body>
    </html>
    `;
};

export default complaintCreatedTemplate;