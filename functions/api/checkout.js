export async function onRequest(context) {
    const { request, env } = context;
    const accessToken = env.MP_ACCESS_TOKEN;
    const publicKey = env.MP_PUBLIC_KEY;

    if (!accessToken || !publicKey) {
        return new Response(JSON.stringify({
            error: 'MercadoPago no configurado. El administrador debe agregar MP_ACCESS_TOKEN y MP_PUBLIC_KEY en Cloudflare Pages.'
        }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    try {
        const body = await request.json();
        const { items, customer } = body;

        if (!items || !items.length) {
            return new Response(JSON.stringify({ error: 'El carrito está vacío' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        const preference = {
            items: items.map(i => ({
                title: i.name,
                quantity: Number(i.quantity),
                currency_id: 'COP',
                unit_price: Number(i.price)
            })),
            payer: {
                name: customer?.name || '',
                email: customer?.email || '',
                phone: { number: customer?.phone || '' }
            },
            back_urls: {
                success: 'https://multitechcolombia.com?payment=success',
                failure: 'https://multitechcolombia.com?payment=failure',
                pending: 'https://multitechcolombia.com?payment=pending'
            },
            auto_return: 'approved',
            statement_descriptor: 'MULTITECHCO',
            binary_mode: true,
            notification_url: 'https://multitechcolombia.com/api/webhook'
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(preference)
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Error al crear el pago: ' + (data.message || response.statusText) }), {
                status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(JSON.stringify({
            init_point: data.init_point,
            preference_id: data.id,
            public_key: publicKey
        }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Error interno: ' + err.message }), {
            status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
