const puppeteer = require('puppeteer');

async function generatePDF(htmlContent, filename) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return { pdfBuffer, filename: `${filename}.pdf` };
}

module.exports = {generatePDF};