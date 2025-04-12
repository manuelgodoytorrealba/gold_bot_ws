const puppeteer = require('puppeteer');

async function getDolarParaleloRate() {
  let browser = null;
  try {
    console.log('🚀 Iniciando Puppeteer...');
    console.log('🔍 Chromium path:', process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium');
    
    const launchOptions = {
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
        '--disable-software-rasterizer',
        '--disable-features=site-per-process',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-web-security',
        '--disable-features=BlockInsecurePrivateNetworkRequests',
        '--user-data-dir=/home/chromium'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      ignoreHTTPSErrors: true
    };

    console.log('⚙️ Launch options:', JSON.stringify(launchOptions, null, 2));
    
    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Browser iniciado correctamente');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Configura el timeout de la página
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    console.log('🌐 Navegando a monitordolarvenezuela.com...');
    await page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('🔍 Esperando selector...');
    await page.waitForSelector('p.font-bold.text-xl', { timeout: 10000 });

    const texts = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll('p.font-bold.text-xl'));
      return values.map(el => el.textContent.trim());
    });

    console.log('📦 Todos los textos encontrados:', texts);

    if (!texts || texts.length < 2) {
      throw new Error('No se encontraron suficientes valores en la página');
    }

    // Accedemos al segundo valor (índice 1) y limpiamos el texto
    const rawText = texts[1];
    const cleaned = rawText.replace('Bs = ', '').replace(',', '.');
    const rate = parseFloat(cleaned);

    if (isNaN(rate)) {
      throw new Error('No se pudo convertir el valor a número');
    }

    console.log(`💸 Tasa dólar paralelo extraída: ${rate}`);
    return rate;
  } catch (error) {
    console.error('❌ Error al hacer scraping con Puppeteer:', error.message);
    console.error('Stack trace:', error.stack);
    return null;
  } finally {
    if (browser) {
      console.log('🛑 Cerrando browser...');
      await browser.close();
    }
  }
}

module.exports = {getDolarParaleloRate};

if (require.main === module) {
  getDolarParaleloRate();
}
