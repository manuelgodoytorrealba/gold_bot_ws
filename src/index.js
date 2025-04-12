const express = require('express');
const { toNumber } = require('./config');
const { sendWhatsappMessage } = require('./services/whatsappService');
const { generateGoldReport } = require('./utils/generateGoldReport');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🚀 Iniciando bot...');
  main();
});
