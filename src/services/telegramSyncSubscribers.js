const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dns = require("dns");
const http = require("http");
const https = require("https");

dns.setDefaultResultOrder("ipv4first");

const SUBS_FILE = path.join(__dirname, "../../data/subscribers.json");

function loadSubscribers() {
  if (!fs.existsSync(SUBS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SUBS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveSubscribers(subs) {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
}

async function syncTelegramSubscribers() {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_TOKEN");

  const url = `https://api.telegram.org/bot${token}/getUpdates`;

  const attempt = async () =>
    axios.get(url, {
      timeout: 15000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    });

  let data;
  try {
    ({ data } = await attempt());
  } catch (e1) {
    await new Promise((r) => setTimeout(r, 800));
    ({ data } = await attempt());
  }

  if (!data?.ok) {
    throw new Error("Telegram getUpdates failed");
  }

  const subscribers = new Set(loadSubscribers());

  for (const update of data.result || []) {
    const chatId = update.message?.chat?.id;
    if (chatId) subscribers.add(String(chatId));
  }

  saveSubscribers([...subscribers]);
  console.log("✅ Subscribers sincronizados:", [...subscribers]);
}

module.exports = { syncTelegramSubscribers };
