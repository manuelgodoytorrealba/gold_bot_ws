function buildTelegramGoldMessage(params) {
  const [name, ounce, gram, changeUsd, changePercent, changePeriod , bcv, btc, quote] = params;

  return (
`🟡 Reporte Oro (XAU - 24K)
👤 ${name}
\n
🥇 Onza: ${ounce}
\n
⚖️ Gramo (24k): ${gram}
\n
📉 Variación (${changePeriod}):
${changeUsd} USD (${changePercent}%)
\n
🇻🇪 BCV: ${bcv}
\n
₿ BTC: ${btc}
\n
📝 ${quote}`
  );
}

module.exports = { buildTelegramGoldMessage };


