// src/services/telegramService.js
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const axios = require("axios");

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = { chat_id: chatId, text };

  const attempt = async () =>
    axios.post(url, payload, {
      timeout: 15000, // 15s
      // desactiva keepAlive para evitar sockets zombis
      httpAgent: new (require("http").Agent)({ keepAlive: false }),
      httpsAgent: new (require("https").Agent)({ keepAlive: false }),
    });

  try {
    return (await attempt()).data;
  } catch (e1) {
    // reintento corto
    await new Promise(r => setTimeout(r, 800));
    return (await attempt()).data;
  }
}

module.exports = { sendTelegramMessage };
