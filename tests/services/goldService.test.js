const { getGoldPrices } = require('../../src/services/goldService');

describe('getGoldPrices', () => {
  it('debería retornar un objeto con propiedades numéricas válidas', async () => {
    const data = await getGoldPrices();
    expect(typeof data.ounce).toBe('number');
    expect(typeof data.gram).toBe('number');
    expect(typeof data.changeUsd).toBe('number');
    expect(typeof data.changePercent).toBe('number');
    expect(data.ounce).toBeGreaterThan(0);
  });
});
