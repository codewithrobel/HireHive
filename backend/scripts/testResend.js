/**
 * Live Resend Email Test
 * Run: node scripts/testResend.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getOTPTemplate } from '../utils/emailTemplates.js';

dotenv.config();

const testOTP = '847291';

async function runLiveTest() {
    console.log('\n🚀 Testing Resend SMTP Integration...\n');
    console.log(`📡 SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`📬 From:      ${process.env.FROM_EMAIL}`);
    console.log(`🔑 API Key:   ${process.env.SMTP_PASS?.substring(0, 10)}...\n`);

    if (!process.env.SMTP_HOST || !process.env.SMTP_PASS) {
        console.error('❌ No SMTP config found in .env!');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER || 'resend',
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('📧 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP Connection OK!\n');

        console.log('📤 Sending test OTP email...');
        const info = await transporter.sendMail({
            from: `HireHive OTP <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: 'delivered@resend.dev', // Resend's official test address
            subject: 'Verify your email - HireHive [TEST]',
            text: `Your verification OTP is ${testOTP}. It will expire in 30 seconds.`,
            html: getOTPTemplate(testOTP, 'verification'),
        });

        console.log('✅ Email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log('\n🎉 Resend integration is working! Real OTPs will now reach users.');
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error(error.message);
        if (error.message.includes('Authentication')) {
            console.log('\n💡 Tip: Check that your SMTP_PASS (API key) is correct in .env');
        }
    }
}

runLiveTest();
