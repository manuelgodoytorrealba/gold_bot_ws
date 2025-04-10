const puppeteer = require('puppeteer');

async function getDolarParaleloRate() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'networkidle2',
      timeout: 0
    });

    await page.waitForSelector('p.font-bold.text-xl', { timeout: 10000 });

    const texts = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll('p.font-bold.text-xl'));
      return values.map(el => el.textContent.trim());
    });

    console.log('📦 Todos los textos encontrados:', texts);

    // Accedemos al segundo valor (índice 1) y limpiamos el texto
    const rawText = texts[1]; // ← este es el que quieres
    const cleaned = rawText.replace('Bs = ', '').replace(',', '.');
    const rate = parseFloat(cleaned);

    console.log(`💸 Tasa dólar paralelo extraída: ${rate}`);
    await browser.close();
    return rate;
  } catch (error) {
    console.error('❌ Error al hacer scraping con Puppeteer:', error.message);
    return null;
  }
}

module.exports = {getDolarParaleloRate};

if (require.main === module) {
  getDolarParaleloRate();
}
