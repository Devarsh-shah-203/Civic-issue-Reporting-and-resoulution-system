const complaintAssignedTemplate = ({ name, complaintTitle }) => {
    return `
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height:1.6;">

            <h2>Hello ${name},</h2>

            <p>
                Your complaint has been assigned to the concerned department.
            </p>

            <p>
                <strong>${complaintTitle}</strong>
            </p>

            <p>
                Our team has started working on it.
            </p>

        </body>
    </html>
    `;
};

export default complaintAssignedTemplate;