require("dotenv").config();

const { generateGoldReport } = require("./utils/generateGoldReport");
const { buildTelegramGoldMessage } = require("./templates/telegramGoldMessage");
const { sendTelegramMessage } = require("./services/telegramService");

(async () => {
  try {
    const params = await generateGoldReport();
    const msg = buildTelegramGoldMessage(params);
    console.log(msg);

    await sendTelegramMessage(msg);
    console.log("✅ Telegram enviado");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e?.code || e?.message || "Unknown error");
    process.exit(1);
  }
})();
