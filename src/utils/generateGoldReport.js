/**
 
 * Genera los parámetros para la plantilla de WhatsApp relacionada con el oro.
 * @returns {Array<string>} - Lista de valores dinámicos para la plantilla
 */

const {getBTCPrice} = require('../services/cryptoService');
const {getGoldPrices} = require('../services/goldService');

async function generateGoldReport() {
  const btcPrice = await getBTCPrice();
  const goldPrices = await getGoldPrices();
  return [
    'Ramon Antonio',
   `${goldPrices.ounce} `,
    `${goldPrices.gram} `,
    `${goldPrices.changeUsd}`,
    `${goldPrices.changePercent}`,
    '150',
    `${btcPrice} USD`,
    'Hoy el oro bajó ligeramente. Podría ser buen momento para mantener reservas.'
  ];

  }
  
  module.exports = {generateGoldReport};
  