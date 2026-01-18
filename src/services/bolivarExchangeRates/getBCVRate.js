const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

// TLS relajado SOLO para BCV (no afecta Telegram ni el resto del proceso)
const bcvHttpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function getBCVRate() {
  try {
    const { data } = await axios.get("https://www.bcv.org.ve/", {
      httpsAgent: bcvHttpsAgent,
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const rateText = $("#dolar .field-content .centrado strong")
      .first()
      .text()
      .trim()
      .replace(",", ".");

    console.log("💰 Tasa oficial USD/BS extraída:", rateText);

    const rate = parseFloat(rateText);
    console.log("✅ Tipo de cambio como número:", rate);

    return Number.isFinite(rate) ? rate : null;
  } catch (error) {
    console.error("❌ Error al hacer scraping del BCV:", error.response?.status || error.message);
    return null;
  }
}

module.exports = { getBCVRate };
