const puppeteer = require('puppeteer');

(async () => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the widget page (Replace with your actual URL or local path)
    await page.goto('http://localhost:4000/widget/#appId=android/io.bluewallet.bluewallet&theme=auto&style=short');

    // Wait for the widget to load (You can adjust the selector if needed)
    await page.waitForSelector('.widget-holder');

    // Capture the widget element as an image
    const widgetElement = await page.$('.widget-holder');
    await widgetElement.screenshot({ path: 'widget.png' });

    // Close the browser
    await browser.close();

    console.log("Widget captured successfully!");
})();