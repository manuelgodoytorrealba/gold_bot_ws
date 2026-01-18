require("dotenv").config();
const { syncTelegramSubscribers } = require("../src/services/telegramSyncSubscribers");

(async () => {
  await syncTelegramSubscribers();
})();
