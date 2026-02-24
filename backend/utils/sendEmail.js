import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // ✅ REAL EMAIL MODE - uses credentials from .env
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // 🔧 MOCK MODE - no SMTP configured, logs OTP to terminal
        console.log(`\n🔐 ============= MOCK OTP EMAIL ============= 🔐`);
        console.log(`📬 To:      ${options.email}`);
        console.log(`📋 Subject: ${options.subject}`);
        console.log(`📝 Message: ${options.message}`);
        console.log(`ℹ️  Add SMTP_HOST, SMTP_USER, SMTP_PASS in .env to send real emails`);
        console.log(`============================================\n`);
        return true;
    }

    const mailOptions = {
        from: `HireHive OTP <${process.env.FROM_EMAIL || 'otpverification@hirehive.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent to ${options.email} | ID: ${info.messageId}`);
    return true;
};

export default sendEmail;
