/**
 
 * Genera los parámetros para la plantilla de WhatsApp relacionada con el oro.
 * @returns {Array<string>} - Lista de valores dinámicos para la plantilla
 */

const {getBTCPrice} = require('../services/cryptoService');
const {getGoldPrices} = require('../services/goldService');
const {getBCVRate} = require('../services/bolivarExchangeRates/getBCVRate');
const {getDolarParaleloRate} = require('../services/bolivarExchangeRates/getParaleloRate');

async function generateGoldReport() {
  const btcPrice = await getBTCPrice();
  const goldPrices = await getGoldPrices();
  const bcvRate = await getBCVRate();
  const dolarParaleloRate = await getDolarParaleloRate();
  return [
    'Ramon Antonio',
   `${goldPrices.ounce}`,
    `${parseFloat(goldPrices.gram).toFixed(2)}`,
    `${goldPrices.changeUsd}`,
    `${goldPrices.changePercent}`,
    `${bcvRate}`,
    `${dolarParaleloRate}`,
    `${btcPrice} USD`,
    'Ponga los pies en el barro que asi coge calor !! carajo !!',
  ];

  }
  
  module.exports = {generateGoldReport};
  