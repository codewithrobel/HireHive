export const getOTPTemplate = (otp, type = 'verification') => {
    const title = type === 'verification' ? 'Verify Your Email' : 'Reset Your Password';
    const description = type === 'verification'
        ? 'Thank you for joining HireHive! Use the code below to complete your registration.'
        : 'We received a request to reset your password. Use the code below to proceed.';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc;
                color: #1e293b;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
            }
            .card {
                background: #ffffff;
                border-radius: 24px;
                padding: 48px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
            }
            .logo {
                text-align: center;
                margin-bottom: 32px;
            }
            .logo-text {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -0.025em;
                background: linear-gradient(to right, #6366f1, #d946ef);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: inline-block;
            }
            .header {
                text-align: center;
                margin-bottom: 32px;
            }
            .header h1 {
                font-size: 24px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 12px 0;
                letter-spacing: -0.01em;
            }
            .header p {
                font-size: 16px;
                color: #64748b;
                line-height: 1.5;
                margin: 0;
            }
            .otp-container {
                background: #f1f5f9;
                border-radius: 16px;
                padding: 32px;
                text-align: center;
                margin-bottom: 32px;
                border: 1px dashed #cbd5e1;
            }
            .otp-code {
                font-size: 42px;
                font-weight: 800;
                color: #4f46e5;
                letter-spacing: 8px;
                margin: 0;
            }
            .expiry {
                text-align: center;
                font-size: 14px;
                font-weight: 700;
                color: #e11d48;
                background: #fff1f2;
                padding: 8px 16px;
                border-radius: 100px;
                display: inline-block;
                margin: 0 auto;
            }
            .footer {
                text-align: center;
                margin-top: 32px;
                font-size: 14px;
                color: #94a3b8;
            }
            .footer p {
                margin: 4px 0;
            }
            .divider {
                height: 1px;
                background: #e2e8f0;
                margin: 32px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">
                    <span class="logo-text">HireHive</span>
                </div>
                
                <div class="header">
                    <h1>${title}</h1>
                    <p>${description}</p>
                </div>
                
                <div class="otp-container">
                    <p style="text-transform: uppercase; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 16px; letter-spacing: 0.1em;">Verification Code</p>
                    <div class="otp-code">${otp}</div>
                </div>
                
                <div style="text-align: center;">
                    <div class="expiry">
                        ⏱ EXPIRES IN 1 MINUTE
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="footer">
                    <p>If you didn't request this code, you can safely ignore this email.</p>
                    <p>&copy; 2026 HireHive. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
