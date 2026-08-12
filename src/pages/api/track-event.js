// Serverless Function — recebe eventos do client e repassa pra Conversions API (Meta)
export const prerender = false;

const PIXEL_ID = '1689331022448426';
const META_API_VERSION = 'v21.0';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const {
      event_name,
      event_id,
      event_source_url,
      user_data = {},
      custom_data = {},
      test_event_code, // opcional — só usado durante testes no Events Manager
    } = body;

    if (!event_name || !event_id) {
      return new Response(
        JSON.stringify({ error: 'event_name e event_id são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = import.meta.env.META_CAPI_TOKEN;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token não configurado no servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || '';
    const userAgent = request.headers.get('user-agent') || '';

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url: event_source_url || '',
          action_source: 'website',
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            ...user_data,
          },
          custom_data,
        },
      ],
    };

    // Só adiciona test_event_code ao payload quando o client mandar esse campo
    if (test_event_code) {
      payload.test_event_code = test_event_code;
    }

    const metaResponse = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      return new Response(JSON.stringify({ error: metaResult }), {
        status: metaResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, metaResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}