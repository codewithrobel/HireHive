import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Determine if we should mock or send real emails based on config
    // If no real config is given in .env, fallback to simply logging the OTP
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Use real credentials if provided
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Development Mock
        console.log(`\n================= MOCK EMAIL =================`);
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log(`==============================================\n`);
        return true; // Pretend it worked
    }

    const message = {
        from: `${process.env.FROM_NAME || 'HireHive'} <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@hirehive.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return true;
};

export default sendEmail;
