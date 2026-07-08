const complaintResolvedTemplate = ({
    name,
    complaintTitle,
}) => {
    return `
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height:1.6;">

            <h2>Hello ${name},</h2>

            <p>
                Great news 🎉
            </p>

            <p>
                Your complaint has been resolved.
            </p>

            <p>
                <strong>${complaintTitle}</strong>
            </p>

            <p>
                Thank you for helping keep the city better for everyone.
            </p>

        </body>
    </html>
    `;
};

export default complaintResolvedTemplate;