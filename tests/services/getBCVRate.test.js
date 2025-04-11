const { getBCVRate } = require('../../src/services/bolivarExchangeRates/getBCVRate');

describe('getBCVRate', () => {
  it('debería retornar una tasa oficial válida', async () => {
    const rate = await getBCVRate();
    expect(typeof rate).toBe('object');
    
    
  });
});
