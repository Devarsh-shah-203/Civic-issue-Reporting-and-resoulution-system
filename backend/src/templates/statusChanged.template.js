const statusChangedTemplate = ({
    name,
    complaintTitle,
    status,
}) => {
    return `
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height:1.6;">

            <h2>Hello ${name},</h2>

            <p>
                Your complaint status has been updated.
            </p>

            <p>
                <strong>Complaint:</strong>
                ${complaintTitle}
            </p>

            <p>
                <strong>Status:</strong>
                ${status}
            </p>

        </body>
    </html>
    `;
};

export default statusChangedTemplate;