const { toNumber} = require('./config');
const { sendWhatsappMessage } = require('./services/whatsappService');
const { generateGoldReport } = require('./utils/generateGoldReport');

async function main() {
  try {
    const templateParams = await generateGoldReport();
    await Promise.all([
      sendWhatsappMessage(toNumber, templateParams),

    ]);
  } catch (error) {
    console.error('❌ Error al ejecutar el bot:', error.message);
  }
}

console.log('🚀 Iniciando bot...');
main();
