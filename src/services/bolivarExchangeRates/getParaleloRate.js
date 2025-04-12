const { chromium } = require('playwright');

async function getDolarParaleloRate() {
  let browser = null;
  try {
    console.log('🚀 Iniciando Playwright...');
    
    // Lanzamos el navegador
    browser = await chromium.launch({
      args: ['--no-sandbox']
    });
    console.log('✅ Browser iniciado correctamente');
    
    // Creamos una nueva página
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('✅ Página creada');

    // Navegamos a la página
    console.log('🌐 Navegando a monitordolarvenezuela.com...');
    await page.goto('https://monitordolarvenezuela.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    console.log('✅ Navegación completada');

    // Pausa explícita para dar tiempo a cargar el contenido dinámico
    console.log('⏳ Esperando 5 segundos para que cargue el contenido...');
    await page.waitForTimeout(5000);
    
    // Capturar screenshot para debug (opcional)
    await page.screenshot({ path: '/tmp/debug-screenshot.png' });
    console.log('📸 Screenshot guardado en /tmp/debug-screenshot.png');

    // Esperamos a que aparezca el elemento que contiene el valor
    console.log('🔍 Esperando a que carguen los elementos...');
    await page.waitForSelector('p.font-bold.text-xl', { timeout: 30000 });
    console.log('✅ Elementos cargados');

    // Extraemos todos los textos de los elementos
    const texts = await page.$$eval('p.font-bold.text-xl', elements => 
      elements.map(el => el.textContent.trim())
    );
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
    console.error('❌ Error al hacer scraping con Playwright:', error.message);
    console.error('📚 Stack trace:', error.stack);
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
