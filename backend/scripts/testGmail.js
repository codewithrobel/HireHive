/**
 * Live Gmail SMTP Test
 * Run: node scripts/testGmail.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getOTPTemplate } from '../utils/emailTemplates.js';

dotenv.config();

const testOTP = '847291';

async function runGmailTest() {
    console.log('\n🚀 Testing Gmail SMTP Integration...\n');
    console.log(`📡 SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`📬 From:      ${process.env.SMTP_USER}\n`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('📧 Verifying Gmail SMTP connection...');
        await transporter.verify();
        console.log('✅ Gmail connection OK!\n');

        console.log('📤 Sending test OTP to your own Gmail...');
        const info = await transporter.sendMail({
            from: `HireHive OTP <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // send to self to verify
            subject: '✅ HireHive OTP Test Email',
            text: `Your test OTP is ${testOTP}. It will expire in 30 seconds.`,
            html: getOTPTemplate(testOTP, 'verification'),
        });

        console.log('✅ Email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`\n🎉 Check your Gmail inbox (${process.env.SMTP_USER}) for the OTP email!`);
    } catch (error) {
        console.error('❌ Gmail test failed:');
        console.error(error.message);
        if (error.message.includes('Invalid login') || error.message.includes('Username and Password')) {
            console.log('\n💡 App Password might be wrong. Make sure 2FA is on and password has no spaces.');
        }
    }
}

runGmailTest();
