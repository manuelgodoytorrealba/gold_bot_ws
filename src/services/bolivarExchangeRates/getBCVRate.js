process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require('axios');
const cheerio = require('cheerio');

async function getBCVRate() {
  try {
    const { data } = await axios.get('https://www.bcv.org.ve/');
    const $ = cheerio.load(data);

    const rateText = $('#dolar .field-content .centrado strong').first().text().trim().replace(',', '.');
    console.log('💰 Tasa oficial USD/BS extraída:', rateText);

    const rate = parseFloat(rateText);
    console.log('✅ Tipo de cambio como número:', rate);

    return rate;
  } catch (error) {
    console.error('❌ Error al hacer scraping del BCV:', error.message);
    return null;
  }
}

module.exports = {
  getBCVRate,
};

//* se llama en el archivo generateGoldReport.js
//* se prueba lamando la funcion getBCVRate()
