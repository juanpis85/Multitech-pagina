export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'GET') {
        return new Response('OK', { status: 200 });
    }

    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const body = await request.json();
        const signature = request.headers.get('X-Signature') || '';
        const topic = body.type || body.action || 'unknown';

        console.log('[WEBHOOK] Topic:', topic, '| ID:', body.data?.id || 'N/A');

        if (!signature) {
            console.warn('[WEBHOOK] Missing X-Signature — request from:', request.headers.get('CF-Connecting-IP'));
        }

        return new Response('OK', { status: 200 });
    } catch (err) {
        console.error('[WEBHOOK] Error:', err);
        return new Response('OK', { status: 200 });
    }
}
