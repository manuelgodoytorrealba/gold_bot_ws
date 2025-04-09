// tests/services/whatsappService.test.js
const axios = require('axios');
const { sendWhatsappMessage } = require('../../src/services/whatsappService');

jest.mock('axios');

describe('sendWhatsappMessage', () => {
  it('envía un mensaje correctamente', async () => {
    const fakeResponse = { data: { success: true } };

    axios.post.mockResolvedValue(fakeResponse);

    const result = await sendWhatsappMessage('+34600000000', [
      'Nombre',
      '3000 USD',
      '90 USD',
      '-2 USD',
      '-0.15%',
      '150 Bs/USD',
      '80.000 BTC',
      'Mensaje del día',
    ]);

    expect(result).toEqual(fakeResponse.data);
    expect(axios.post).toHaveBeenCalled();
  });

  it('lanza un error si axios falla', async () => {
    axios.post.mockRejectedValue(new Error('Fallo al enviar'));

    await expect(
      sendWhatsappMessage('+34600000000', ['param1', 'param2', '...'])
    ).rejects.toThrow('Fallo al enviar');
  });
});
