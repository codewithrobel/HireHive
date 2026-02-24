const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to register page...');
    await page.goto('http://localhost:5173/register');
    
    console.log('Filling form...');
    await page.type('input[placeholder="John Doe"]', 'Test User');
    await page.type('input[placeholder="you@example.com"]', `tester${Date.now()}@test.com`);
    await page.type('input[placeholder="••••••••"]', 'password123');
    
    console.log('Attempting to extract captcha...');
    // In react-simple-captcha, the canvas has an ID 'captcha' by default
    const captchaText = await page.evaluate(() => {
        // Attempt OCR or read text if it's stored in a data attribute (which it isn't, but let's try reading the canvas data URL)
        const canvas = document.getElementById('captcha');
        return canvas ? canvas.toDataURL() : null;
    });

    if (captchaText) {
        console.log('Captcha canvas found. However, reading visual captcha via Puppeteer without an OCR service is complex.');
        console.log('To truly test this E2E, we would need to mock the validateCaptcha function during testing or use an OCR library.');
    } else {
        console.log('Captcha canvas not found.');
    }
    
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
  }
})();
