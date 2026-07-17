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

  const from = env.RESEND_FROM || 'The Rhizome Space <hello@mail.therhizomespace.com>';
  const link = origin + '/guidebook';
  const text =
    'Thanks for asking for the guidebook.\n\n' +
    'Read it here: ' + link + '\n\n' +
    "It covers what's safe to put into AI at work, the thirty-second test, " +
    'the five-step method, and the templates and checklists we use in paid ' +
    'engagements.\n\n' +
    'Reply to this email if you want to talk through one real task.\n\n' +
    'The Rhizome Space\nChiang Mai';
  // Branded, email-safe HTML: table layout + all-inline styles (clients strip
  // <style>/external CSS). Palette mirrors the site (leaf #14261a, paper
  // #f4f0e6, turmeric #e1a72f). Copy is identical to the plain-text part above.
  const unsub = 'mailto:hello@therhizomespace.com?subject=unsubscribe';
  const html =
    '<div style="margin:0;padding:0;background:#f0ead8;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0ead8;padding:28px 12px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#f4f0e6;border:1px solid rgba(35,53,36,.14);border-radius:12px;overflow:hidden;">' +
    // header band
    '<tr><td style="background:#14261a;padding:26px 32px;">' +
    '<img src="https://therhizomespace.com/assets/rhizome-thai-logo-256.png" alt="The Rhizome Space" width="44" height="44" style="display:block;border:0;width:44px;height:44px;margin:0 0 14px;">' +
    '<div style="font:12px/1.4 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#e1a72f;">Free guidebook</div>' +
    '<div style="margin-top:6px;font:600 19px/1.3 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#f4f0e6;">The Rhizome Space</div>' +
    '</td></tr>' +
    // body
    '<tr><td style="padding:30px 32px 8px;font:16px/1.65 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#22271f;">' +
    '<p style="margin:0 0 18px;">Thanks for asking for the guidebook.</p>' +
    '<p style="margin:0 0 18px;">It covers what\'s safe to put into AI at work, the thirty-second test, the five-step method, and the templates and checklists we use in paid engagements.</p>' +
    // CTA button (bulletproof table cell)
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;"><tr>' +
    '<td bgcolor="#e1a72f" style="background:#e1a72f;border-radius:8px;padding:13px 26px;">' +
    '<a href="' + link + '" style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;line-height:1;color:#14261a;text-decoration:none;">Read the Rhizome guidebook</a>' +
    '</td></tr></table>' +
    '<p style="margin:0 0 6px;font-size:13.5px;color:#5c6653;">Or open it directly: <a href="' + link + '" style="color:#8a6a1f;">' + link + '</a></p>' +
    '<p style="margin:18px 0 0;">Reply to this email if you want to talk through one real task.</p>' +
    '</td></tr>' +
    // footer
    '<tr><td style="padding:22px 32px 26px;border-top:1px solid rgba(35,53,36,.12);font:12.5px/1.6 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#7a8471;">' +
    'The Rhizome Space &middot; Chiang Mai<br>' +
    'You are receiving this because you asked for the guidebook. <a href="' + unsub + '" style="color:#7a8471;">Unsubscribe</a>.' +
    '</td></tr>' +
    '</table></td></tr></table></div>';

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
        headers: {
          'List-Unsubscribe': '<' + unsub + '>',
        },
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
