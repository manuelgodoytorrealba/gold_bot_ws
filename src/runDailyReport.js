require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { generateGoldReport } = require("./utils/generateGoldReport");
const { buildTelegramGoldMessage } = require("./templates/telegramGoldMessage");
const { sendTelegramMessage } = require("./services/telegramService");
const { syncTelegramSubscribers } = require("./services/telegramSyncSubscribers");

function loadSubscribers() {
  const file = path.join(__dirname, "../data/subscribers.json");
  if (!fs.existsSync(file)) return [];
  try {
    const arr = JSON.parse(fs.readFileSync(file, "utf8"));
    // Normalizamos a strings y quitamos vacíos
    return (Array.isArray(arr) ? arr : []).map(String).filter(Boolean);
  } catch {
    return [];
  }
}

(async () => {
  try {
    // 1) Sync: captura nuevos /start / mensajes y actualiza subscribers.json
    await syncTelegramSubscribers();

    // 2) Cargar subscribers
    const subscribers = loadSubscribers();
    if (subscribers.length === 0) {
      console.log("⚠️ No hay subscribers aún. Nadie ha dado Start.");
      process.exit(0);
    }

    // 3) Generar reporte y mensaje
    const params = await generateGoldReport();
    const msg = buildTelegramGoldMessage(params);
    console.log(msg);

    // 4) Enviar a todos (sin tumbar todo si uno falla)
    let ok = 0;
    let fail = 0;

    for (const chatId of subscribers) {
      try {
        await sendTelegramMessage(chatId, msg); // 👈 ahora enviamos por chatId
        ok++;
        console.log(`✅ Enviado a chat_id=${chatId}`);
      } catch (e) {
        fail++;
        console.error(`❌ Falló envío a chat_id=${chatId}:`, e?.code || e?.message || "Unknown");
      }
    }

    console.log(`📬 Envíos completados. OK=${ok} FAIL=${fail}`);
    process.exit(fail > 0 ? 1 : 0);
  } catch (e) {
    console.error("❌ Error:", e?.code || e?.message || "Unknown error");
    process.exit(1);
  }
})();
