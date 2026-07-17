// Guidebook opt-in endpoint.
// Stores subscriber emails in the SUBSCRIBERS KV namespace.
// No third-party services; nothing is sent anywhere else.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success.
  if (data.company) return json({ ok: true });

  const email = String(data.email || '').trim().toLowerCase();
  const valid =
    email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!valid) return json({ ok: false, error: 'invalid_email' }, 400);

  if (!env.SUBSCRIBERS) return json({ ok: false, error: 'not_configured' }, 500);

  await env.SUBSCRIBERS.put(
    'email:' + email,
    JSON.stringify({
      email,
      source: 'guidebook',
      at: new Date().toISOString(),
    })
  );

  return json({ ok: true });
}
