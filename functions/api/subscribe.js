// Guidebook opt-in endpoint.
// Stores subscriber emails in the SUBSCRIBERS KV namespace, then emails the
// guidebook link via Resend. Sending is best-effort: if RESEND_API_KEY is
// unset or the send fails, the subscriber is still stored and the on-page
// "read it now" link remains the immediate fallback.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Best-effort guidebook email. Returns true if Resend accepted it, false
// otherwise. Never throws — a delivery problem must not fail the opt-in.
async function sendGuidebook(env, email, origin) {
  if (!env.RESEND_API_KEY) return false;

  const from = env.RESEND_FROM || 'The Rhizome Space <hello@therhizomespace.com>';
  const link = origin + '/guidebook';
  const text =
    'Thanks for asking for the guidebook.\n\n' +
    'Read it here: ' + link + '\n\n' +
    "It covers what's safe to put into AI at work, the thirty-second test, " +
    'the five-step method, and the templates and checklists we use in paid ' +
    'engagements.\n\n' +
    'Reply to this email if you want to talk through one real task.\n\n' +
    'The Rhizome Space\nChiang Mai';
  const html =
    '<p>Thanks for asking for the guidebook.</p>' +
    '<p><a href="' + link + '">Read the Rhizome guidebook</a></p>' +
    "<p>It covers what's safe to put into AI at work, the thirty-second test, " +
    'the five-step method, and the templates and checklists we use in paid ' +
    'engagements.</p>' +
    '<p>Reply to this email if you want to talk through one real task.</p>' +
    '<p>The Rhizome Space<br>Chiang Mai</p>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        reply_to: 'hello@therhizomespace.com',
        subject: 'Your Rhizome guidebook',
        text,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
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

  const key = 'email:' + email;
  const existing = await env.SUBSCRIBERS.get(key);

  await env.SUBSCRIBERS.put(
    key,
    JSON.stringify({
      email,
      source: 'guidebook',
      at: new Date().toISOString(),
    })
  );

  // Only email first-time subscribers, so a repeat submit doesn't re-send.
  let emailed = false;
  if (!existing) {
    const origin = new URL(request.url).origin;
    emailed = await sendGuidebook(env, email, origin);
  }

  return json({ ok: true, emailed });
}
