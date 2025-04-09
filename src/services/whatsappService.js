// src/services/whatsappService.js

const axios = require('axios');
const { metaToken, phoneNumberId } = require('../config');

/**
 * Envía un mensaje de WhatsApp usando una plantilla
 * @param {string} to - Número de teléfono del destinatario
 * @param {Array} templateParams - Parámetros que rellenan la plantilla de WhatsApp
 */
async function sendWhatsappMessage(to, templateParams) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: 'gold_update_daily',
          language: { code: 'es' },
          components: [
            {
              type: 'body',
              parameters: templateParams.map(text => ({ type: 'text', text }))
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${metaToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Mensaje enviado con éxito');
    return response.data;
  } catch (error) {
    console.error('❌ Error al enviar el mensaje:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendWhatsappMessage };
