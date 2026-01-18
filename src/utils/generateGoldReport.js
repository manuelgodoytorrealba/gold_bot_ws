/**
 
 * Genera los parámetros para la plantilla de WhatsApp relacionada con el oro.
 * @returns {Array<string>} - Lista de valores dinámicos para la plantilla
 */

const {getBTCPrice} = require('../services/cryptoService');
const {getGoldPrices} = require('../services/goldService');
const {getBCVRate} = require('../services/bolivarExchangeRates/getBCVRate');


async function generateGoldReport() {
  const btcPrice = await getBTCPrice();
  const goldPrices = await getGoldPrices();
  const bcvRate = await getBCVRate();

  return [
    'Ramon Antonio',
   `${goldPrices.ounce} USD`,
    `${parseFloat(goldPrices.gram).toFixed(2)} USD`,
    `${goldPrices.changeUsd}`,
    `${goldPrices.changePercent}`,
     goldPrices.changePeriod,
    `${bcvRate}`,
    `${btcPrice} USD`,
    'Ponga los pies en el barro que asi coge calor !! Carajo !!',
  ];

  }
  
  module.exports = {generateGoldReport};
  