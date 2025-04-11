const axios = require('axios');

/**
 * Obtiene el precio actual de Bitcoin en USD desde CoinGecko
 * @returns {Promise<string>} Precio de BTC como string, por ejemplo "70800.23"
 */
async function getBTCPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
      },
    });

    const price = response.data.bitcoin.usd;
    return parseFloat(price.toFixed(2));

  } catch (error) {
    console.error('❌ Error al obtener precio de BTC:', error.message);
    return '0.00';
  }
}

module.exports = { getBTCPrice };
