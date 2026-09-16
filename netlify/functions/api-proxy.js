/* ══════════════════════════════════════════════════════════════
   netlify/functions/api-proxy.js
   General secure API proxy
   
   Usage: /.netlify/functions/api-proxy
   Body: { service: 'groq', payload: { ...groq body } }
══════════════════════════════════════════════════════════════ */

const SERVICES = {
  groq: {
    url:      'https://api.groq.com/openai/v1/chat/completions',
    keyEnv:   'GROQ_API_KEY',
    authType: 'Bearer',
  },
};

exports.handler = async (event) => {
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

  if (!service || !SERVICES[service]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown service: "${service}". Available: ${Object.keys(SERVICES).join(', ')}` })
    };
  }

  const cfg = SERVICES[service];

  const apiKey = process.env[cfg.keyEnv];
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `${cfg.keyEnv} environment variable not set in Netlify` })
    };
  }

  const headers = { 'Content-Type': 'application/json' };
  if (cfg.authType === 'Bearer') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers[cfg.authType] = apiKey;
  }

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
