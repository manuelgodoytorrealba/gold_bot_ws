require("dotenv").config();
const { generateGoldReport } = require("../src/utils/generateGoldReport");
const { buildTelegramGoldMessage } = require("../src/templates/telegramGoldMessage");
const { sendTelegramMessage } = require("../src/services/telegramService");

(async () => {
  try {
    const params = await generateGoldReport();
    const msg = buildTelegramGoldMessage(params);

    console.log(msg);

    await sendTelegramMessage(msg);

    console.log("✅ Telegram enviado");
    process.exit(0);
  } catch (e) {
    // No imprimas el stack completo (evita que salga el token en logs)
    console.error("❌ Telegram error:", e?.code || e?.message || "Unknown error");
    process.exit(1);
  }
})();
