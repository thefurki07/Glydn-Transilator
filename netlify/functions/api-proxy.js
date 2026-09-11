/* ══════════════════════════════════════════════════════════════
   netlify/functions/api-proxy.js
   Genel güvenli API proxy
   
   Kullanım: /.netlify/functions/api-proxy
   Body: { service: 'groq', payload: { ...groq body } }
   
   Yeni bir API eklemek için:
   1. SERVICES objesine ekle
   2. Netlify'da env variable ekle
   3. translate.js'te service adını kullan — başka değişiklik yok
══════════════════════════════════════════════════════════════ */

// Desteklenen servisler
const SERVICES = {
  groq: {
    url:     'https://api.groq.com/openai/v1/chat/completions',
    keyEnv:  'GROQ_API_KEY',
    authType: 'Bearer',
  },
  // İleride eklenebilir:
  // openai: {
  //   url:     'https://api.openai.com/v1/chat/completions',
  //   keyEnv:  'OPENAI_API_KEY',
  //   authType: 'Bearer',
  // },
  // anthropic: {
  //   url:     'https://api.anthropic.com/v1/messages',
  //   keyEnv:  'ANTHROPIC_API_KEY',
  //   authType: 'x-api-key',
  // },
};

exports.handler = async (event) => {
  // Sadece POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { service, payload } = body;

  // Servis var mı?
  if (!service || !SERVICES[service]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown service: "${service}". Available: ${Object.keys(SERVICES).join(', ')}` })
    };
  }

  const cfg = SERVICES[service];

  // Key var mı?
  const apiKey = process.env[cfg.keyEnv];
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `${cfg.keyEnv} environment variable not set in Netlify` })
    };
  }

  // Headers
  const headers = { 'Content-Type': 'application/json' };
  if (cfg.authType === 'Bearer') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers[cfg.authType] = apiKey;
  }

  // Proxy isteği at
  try {
    const response = await fetch(cfg.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
