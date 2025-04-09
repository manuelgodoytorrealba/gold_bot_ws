const axios = require('axios');

const { goldApiKey } = require('../config');

async function getGoldPrices() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': goldApiKey,
        'Content-Type': 'application/json'
      }
    });

    const { price_gram_24k, price, ch, chp } = response.data;

    return {
      ounce: price,
      gram: price_gram_24k,
      changeUsd: ch,
      changePercent: chp
    };
  } catch (error) {
    console.error('❌ Error al obtener el precio del oro:', error.response?.data || error.message);
    throw new Error('Fallo al obtener los datos del oro');
  }
}

module.exports = { getGoldPrices };
