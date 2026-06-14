const ALLOWED_ORIGIN = 'https://multitechcolombia.com';

function corsHeaders(origin) {
    const safe = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : 'https://multitechcolombia.com';
    return {
        'Access-Control-Allow-Origin': safe,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };
}

function json(data, status, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers }
    });
}

export async function onRequest(context) {
    const { request, env } = context;
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405, cors);
    }

    const accessToken = env.MP_ACCESS_TOKEN;
    const publicKey = env.MP_PUBLIC_KEY;

    if (!accessToken || !publicKey) {
        return json({ error: 'MercadoPago no configurado.' }, 503, cors);
    }

    try {
        const body = await request.json();
        const { items, customer } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return json({ error: 'El carrito está vacío' }, 400, cors);
        }

        // Validate each item
        for (const item of items) {
            if (!item.name || typeof item.name !== 'string') {
                return json({ error: 'Cada producto debe tener un nombre válido.' }, 400, cors);
            }
            const qty = Number(item.quantity);
            const price = Number(item.price);
            if (!Number.isInteger(qty) || qty < 1) {
                return json({ error: `Cantidad inválida para "${item.name}".` }, 400, cors);
            }
            if (!Number.isFinite(price) || price <= 0) {
                return json({ error: `Precio inválido para "${item.name}".` }, 400, cors);
            }
        }

        const preference = {
            items: items.map(i => ({
                title: String(i.name).slice(0, 80),
                quantity: Number(i.quantity),
                currency_id: 'COP',
                unit_price: Number(i.price)
            })),
            payer: {
                name: customer?.name ? String(customer.name).slice(0, 100) : '',
                email: customer?.email ? String(customer.email).slice(0, 100) : '',
                phone: { number: customer?.phone ? String(customer.phone).slice(0, 20) : '' }
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
            console.error('MercadoPago error:', data);
            return json({ error: 'Error al procesar el pago. Intente nuevamente.' }, 502, cors);
        }

        return json({
            init_point: data.init_point,
            preference_id: data.id,
            public_key: publicKey
        }, 200, cors);

    } catch (err) {
        console.error('Checkout error:', err);
        return json({ error: 'Error interno del servidor.' }, 500, cors);
    }
}
