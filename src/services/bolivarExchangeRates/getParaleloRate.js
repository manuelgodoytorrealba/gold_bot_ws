const puppeteer = require('puppeteer');

async function getDolarParaleloRate() {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--single-process',
        '--no-zygote',
        '--disable-extensions',
        '--disable-software-rasterizer'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome'
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('p.font-bold.text-xl', { timeout: 10000 });

    const texts = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll('p.font-bold.text-xl'));
      return values.map(el => el.textContent.trim());
    });

    console.log('📦 Todos los textos encontrados:', texts);

    // Accedemos al segundo valor (índice 1) y limpiamos el texto
    const rawText = texts[1];
    const cleaned = rawText.replace('Bs = ', '').replace(',', '.');
    const rate = parseFloat(cleaned);

    console.log(`💸 Tasa dólar paralelo extraída: ${rate}`);
    return rate;
  } catch (error) {
    console.error('❌ Error al hacer scraping con Puppeteer:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {getDolarParaleloRate};

if (require.main === module) {
  getDolarParaleloRate();
}
