const { getDolarParaleloRate } = require('../../src/services/bolivarExchangeRates/getParaleloRate');
describe('getDolarParaleloRate', () => {
  it('debería retornar una tasa del dólar paralelo válida', async () => {
    const rate = await getDolarParaleloRate();
    expect(typeof rate).toBe('number');
    expect(rate).toBeGreaterThan(0);
  });
});
