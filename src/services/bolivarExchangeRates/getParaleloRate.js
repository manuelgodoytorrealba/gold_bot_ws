const puppeteer = require('puppeteer');

async function getDolarParaleloRate() {
  let browser = null;
  try {
    console.log('🚀 Iniciando Puppeteer...');
    console.log('📦 Versión de Puppeteer:', puppeteer.version);
    console.log('🔍 Variables de entorno Puppeteer:');
    console.log('- PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH);
    console.log('- PUPPETEER_SKIP_DOWNLOAD:', process.env.PUPPETEER_SKIP_DOWNLOAD);
    console.log('- PUPPETEER_CACHE_DIR:', process.env.PUPPETEER_CACHE_DIR);
    
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
        '--disable-features=BlockInsecurePrivateNetworkRequests'
      ],
      ignoreHTTPSErrors: true,
      userDataDir: process.env.PUPPETEER_CACHE_DIR || '/app/.cache/puppeteer'
    };

    console.log('⚙️ Launch options:', JSON.stringify(launchOptions, null, 2));
    
    console.log('🔄 Intentando iniciar el navegador...');
    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Browser iniciado correctamente');
    
    console.log('📄 Creando nueva página...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('✅ Página creada y viewport configurado');

    // Configura el timeout de la página
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    console.log('⏱️ Timeouts configurados');

    console.log('🌐 Navegando a monitordolarvenezuela.com...');
    const navigationPromise = page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('⏳ Esperando a que la navegación se complete...');
    await navigationPromise;
    console.log('✅ Navegación completada');

    console.log('🔍 Esperando selector p.font-bold.text-xl...');
    await page.waitForSelector('p.font-bold.text-xl', { timeout: 10000 });
    console.log('✅ Selector encontrado');

    console.log('📝 Extrayendo textos...');
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
    console.log('📄 Texto crudo encontrado:', rawText);
    
    const cleaned = rawText.replace('Bs = ', '').replace(',', '.');
    console.log('🧹 Texto limpiado:', cleaned);
    
    const rate = parseFloat(cleaned);
    console.log('🔢 Valor numérico:', rate);

    if (isNaN(rate)) {
      throw new Error('No se pudo convertir el valor a número');
    }

    console.log(`💸 Tasa dólar paralelo extraída: ${rate}`);
    return rate;
  } catch (error) {
    console.error('❌ Error al hacer scraping con Puppeteer:', error.message);
    console.error('📚 Stack trace:', error.stack);
    if (error.name === 'TimeoutError') {
      console.error('⏱️ Error de timeout - La página tardó demasiado en cargar');
    }
    return null;
  } finally {
    if (browser) {
      console.log('🛑 Cerrando browser...');
      await browser.close();
      console.log('✅ Browser cerrado correctamente');
    }
  }
}

module.exports = {getDolarParaleloRate};

if (require.main === module) {
  getDolarParaleloRate();
}
