const { getBTCPrice } = require('../../src/services/cryptoService');

describe('getBTCPrice', () => {
  it('debería retornar un número mayor a 0', async () => {
    const price = await getBTCPrice();
    expect(typeof price).toBe('number');
    expect(price).toBeGreaterThan(0);
  });
});
