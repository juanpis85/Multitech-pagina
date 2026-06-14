const rateLimit = new Map();
const RATE_MAX = 10;
const RATE_WINDOW_MS = 60_000;

export async function onRequest(context) {
    const { request, env } = context;
    const origin = request.headers.get('Origin') || 'https://multitechcolombia.com';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, []);
    }
    const attempts = rateLimit.get(ip).filter(t => now - t < RATE_WINDOW_MS);
    if (attempts.length >= RATE_MAX) {
        return new Response(JSON.stringify({ error: 'Demasiados intentos. Espere un minuto.' }), { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    attempts.push(now);
    rateLimit.set(ip, attempts);

    try {
        const body = await request.json();
        const password = String(body.password || '');
        const adminPassword = env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return new Response(JSON.stringify({ error: 'Error de configuración del servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }

        if (password === adminPassword) {
            return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } else {
            return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
}
