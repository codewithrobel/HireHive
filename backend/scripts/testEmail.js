/**
 * OTP Email Test Script using Ethereal (Nodemailer test service)
 * Run: node scripts/testEmail.js
 *
 * This creates a temporary test inbox and sends a real OTP email to it.
 * You'll get a preview URL that lets you see the email in your browser.
 */

import nodemailer from 'nodemailer';
import { getOTPTemplate } from '../utils/emailTemplates.js';

const testOTP = '847291'; // Sample OTP

async function runEmailTest() {
    console.log('\n🧪 Starting OTP Email Test...\n');

    // 1. Create a temporary Ethereal test account
    console.log('📡 Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log(`✅ Test Account Created:`);
    console.log(`   Email: ${testAccount.user}`);
    console.log(`   Pass:  ${testAccount.pass}\n`);

    // 2. Create a transporter using the Ethereal SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // 3. Test 1: Verification OTP Template
    console.log('📧 Sending Test 1: Verification OTP Email...');
    const verificationInfo = await transporter.sendMail({
        from: '"HireHive" <noreply@hirehive.com>',
        to: 'testuser@example.com',
        subject: 'Verify your email - HireHive',
        text: `Your verification OTP is ${testOTP}. It will expire in 30 seconds.`,
        html: getOTPTemplate(testOTP, 'verification'),
    });

    console.log(`✅ Verification email sent!`);
    console.log(`   📬 Preview URL: ${nodemailer.getTestMessageUrl(verificationInfo)}\n`);

    // 4. Test 2: Password Reset OTP Template
    console.log('🔑 Sending Test 2: Password Reset OTP Email...');
    const resetInfo = await transporter.sendMail({
        from: '"HireHive" <noreply@hirehive.com>',
        to: 'testuser@example.com',
        subject: 'Password Reset OTP - HireHive',
        text: `Your password reset OTP is ${testOTP}. It will expire in 30 seconds.`,
        html: getOTPTemplate(testOTP, 'reset'),
    });

    console.log(`✅ Reset email sent!`);
    console.log(`   📬 Preview URL: ${nodemailer.getTestMessageUrl(resetInfo)}\n`);

    console.log('🎉 All tests passed! Open the Preview URLs above in your browser to see the emails.\n');
}

runEmailTest().catch((err) => {
    console.error('❌ Email test failed:', err);
    process.exit(1);
});
