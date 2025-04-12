const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function getDolarParaleloRate() {
  let browser = null;
  try {
    console.log('🚀 Iniciando Puppeteer...');
    console.log('📦 Versión de Puppeteer:', puppeteer.version);
    
    // Imprimir información del sistema para depuración
    console.log('🖥️ Información del sistema:');
    console.log('- Platform:', process.platform);
    console.log('- Architecture:', process.arch);
    console.log('- Node version:', process.version);
    console.log('- USER:', process.env.USER);
    console.log('- HOME:', process.env.HOME);
    
    // Verificar ubicaciones de Chrome
    const possibleChromePaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
      '/app/.cache/puppeteer/chrome/linux-*/chrome-linux/chrome',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ];
    
    console.log('🔍 Verificando posibles ubicaciones de Chrome:');
    for (const chromePath of possibleChromePaths) {
      if (chromePath) {
        let exists = false;
        try {
          // Si contiene un glob, lo expandimos
          if (chromePath.includes('*')) {
            const baseDir = chromePath.split('*')[0];
            if (fs.existsSync(baseDir)) {
              console.log(`- ${chromePath}: Base directory exists`);
            } else {
              console.log(`- ${chromePath}: Base directory does not exist`);
            }
          } else {
            exists = fs.existsSync(chromePath);
            console.log(`- ${chromePath}: ${exists ? 'EXISTE' : 'NO EXISTE'}`);
          }
        } catch (error) {
          console.log(`- ${chromePath}: Error al verificar: ${error.message}`);
        }
      }
    }
    
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
      ignoreHTTPSErrors: true,
    };

    console.log('⚙️ Launch options:', JSON.stringify(launchOptions, null, 2));
    
    console.log('🔄 Intentando iniciar el navegador...');
    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Browser iniciado correctamente');
    
    console.log('ℹ️ Información del browser:');
    const version = await browser.version();
    console.log('- Versión del browser:', version);
    
    console.log('📄 Creando nueva página...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('✅ Página creada y viewport configurado');

    // Configura el timeout de la página
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    console.log('⏱️ Timeouts configurados (60s)');

    console.log('🌐 Navegando a monitordolarvenezuela.com...');
    const navigationPromise = page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('⏳ Esperando a que la navegación se complete...');
    await navigationPromise;
    console.log('✅ Navegación completada');

    // Capturar una captura de pantalla para depuración
    console.log('📸 Capturando screenshot para depuración...');
    await page.screenshot({ path: '/tmp/debug-screenshot.png' });
    console.log('✅ Screenshot guardado en /tmp/debug-screenshot.png');

    console.log('🔍 Esperando selector p.font-bold.text-xl...');
    await page.waitForSelector('p.font-bold.text-xl', { timeout: 30000 });
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
