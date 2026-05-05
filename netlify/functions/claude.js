exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { type: 'method_not_allowed', message: 'Only POST allowed' } }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          type: 'config_error',
          message: 'ANTHROPIC_API_KEY not set in Netlify environment variables. Go to Site configuration → Environment variables.',
        },
      }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { type: 'no_body', message: 'Request body is empty' } }),
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: event.body,
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          type: 'proxy_error',
          message: err.message || 'Unknown proxy error',
          stack: err.stack ? err.stack.substring(0, 500) : null,
        },
      }),
    };
  }
};
