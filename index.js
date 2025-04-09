require('dotenv').config();
const axios = require('axios');

const metaToken = process.env.META_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const toNumber = process.env.TO_NUMBER;

async function sendMessage() {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: toNumber,
                type: 'template',
                template: {
                    name: 'gold_update_daily',
                    language: { code: 'es' },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: 'Ramon Antonio' },    // {{1}} Onza
                                { type: 'text', text: '3000.20 USD' },    // {{7}} Oro extraído
                                { type: 'text', text: '96.20 USD' },      // {{2}} Gramo
                                { type: 'text', text: '-2.20 ' },      // {{3}} Variación $
                                { type: 'text', text: '-0,22' },         // {{4}} Variación %
                                { type: 'text', text: '150' },     // {{5}} USD/BS
                                { type: 'text', text: '80.000 ' },     // {{6}} BTC
                                { type: 'text', text: 'Hoy el oro bajó ligeramente. Podría ser buen momento para mantener reservas.' } // {{8}} Mensaje del día
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${metaToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Mensaje enviado con éxito');
        return response.data;
    } catch (error) {
        console.error('❌ Error al enviar el mensaje:', error.response?.data || error.message);
        throw error;
    }
}

sendMessage();
