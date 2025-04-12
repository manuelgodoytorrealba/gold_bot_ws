const { toNumber, toNumber2 } = require('./config');
const { sendWhatsappMessage } = require('./services/whatsappService');
const { generateGoldReport } = require('./utils/generateGoldReport');

async function main() {
  try {
    console.log('🚀 Iniciando bot...');
    const templateParams = await generateGoldReport();
    await Promise.all([
      sendWhatsappMessage(toNumber, templateParams),
      sendWhatsappMessage(toNumber2, templateParams),
    ]);
    console.log('✅ Bot ejecutado con éxito');
    process.exit(0); // 🛑 Termina el proceso correctamente
  } catch (error) {
    console.error('❌ Error al ejecutar el bot:', error.message);
    process.exit(1); // 🛑 Termina con error
  }
}

main();
