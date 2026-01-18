require("dotenv").config();

const axios = require("axios");
const dns = require("dns");
const http = require("http");
const https = require("https");

dns.setDefaultResultOrder("ipv4first");

const { generateGoldReport } = require("./utils/generateGoldReport");
const { buildTelegramGoldMessage } = require("./templates/telegramGoldMessage");
const { sendTelegramMessage } = require("./services/telegramService");
const { syncTelegramSubscribers } = require("./services/telegramSyncSubscribers");

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

function normalizeText(s) {
  return (s || "").toString().toLowerCase().trim();
}

function shouldSendGold(text) {
  const t = normalizeText(text);
  // comandos simples + frases humanas
  return (
    ["oro", "gold", "precio"].includes(t) ||
    t.includes("precio del oro") ||
    t.includes("como va el oro") ||
    t.includes("cómo va el oro") ||
    t.includes("oro hoy")
  );
}

async function getUpdates(offset) {
  const token = process.env.TELEGRAM_TOKEN;
  const url = `https://api.telegram.org/bot${token}/getUpdates`;

  const { data } = await axios.get(url, {
    params: {
      timeout: 30,      // long polling (segundos)
      offset: offset,   // para no reprocesar
      allowed_updates: ["message"],
    },
    timeout: 35000,     // un poco mayor que timeout=30
    httpAgent,
    httpsAgent,
  });

  if (!data.ok) throw new Error("getUpdates failed");
  return data.result || [];
}

async function handleMessage(msg) {
  const chatId = msg.chat?.id;
  const text = msg.text;

  if (!chatId) return;

  const t = normalizeText(text);

  // /start: registra y da bienvenida
  if (t === "/start" || t.startsWith("/start")) {
    await syncTelegramSubscribers();

    const welcome =
`🟡 Bienvenido Ramon, feliz cumpleaños  👋

Desde hoy recibirás:
• Reporte automático a las 10:00 y 17:00 (hora España)
• Y si escribes: oro / precio / gold → te respondo al instante

Listo. No tienes que hacer nada más 👍`;

    await sendTelegramMessage(chatId, welcome);
    return;
  }

  // trigger manual
  if (shouldSendGold(t)) {
    const params = await generateGoldReport();
    const report = buildTelegramGoldMessage(params);
    await sendTelegramMessage(chatId, report);
    return;
  }
}

async function main() {
  console.log("👂 Listener Telegram iniciado (polling).");

  let offset = 0;

  // sincroniza una vez al arrancar (por si hay starts recientes)
  try {
    await syncTelegramSubscribers();
  } catch (e) {
    console.error("⚠️ sync inicial falló:", e?.code || e?.message);
  }

  while (true) {
    try {
      const updates = await getUpdates(offset);

      for (const u of updates) {
        offset = Math.max(offset, (u.update_id || 0) + 1);

        const msg = u.message;
        if (msg) await handleMessage(msg);
      }
    } catch (e) {
      console.error("❌ Listener error:", e?.code || e?.message || "unknown");
      // espera un poco y reintenta
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main();
