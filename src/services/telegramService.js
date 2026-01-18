// src/services/telegramService.js
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const axios = require("axios");
const http = require("http");
const https = require("https");

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

async function sendTelegramMessage(chatId, text) {
  if (!chatId) throw new Error("chatId is required");

  const token = process.env.TELEGRAM_TOKEN;
  if (!token) throw new Error("TELEGRAM_TOKEN not set");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = { chat_id: String(chatId), text };

  const attempt = () =>
    axios.post(url, payload, {
      timeout: 15000,
      httpAgent,
      httpsAgent,
    });

  const delays = [0, 1200, 3000]; // ms
  let lastErr;

  for (let i = 0; i < delays.length; i++) {
    try {
      if (delays[i]) await new Promise((r) => setTimeout(r, delays[i]));
      return (await attempt()).data;
    } catch (e) {
      lastErr = e;
    }
  }

  // Solo devolvemos un error “limpio” (sin imprimir URL/token)
  const code = lastErr?.code;
  const msg = lastErr?.message || "Unknown error";
  const err = new Error(msg);
  err.code = code;
  throw err;
}

module.exports = { sendTelegramMessage };
