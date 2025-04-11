require('dotenv').config();

module.exports = {
    metaToken: process.env.META_TOKEN,
    phoneNumberId: process.env.PHONE_NUMBER_ID,
    toNumber: process.env.TO_NUMBER,
    toNumber2: process.env.TO_NUMBER_2,
    goldApiKey: process.env.GOLD_API_KEY
};
