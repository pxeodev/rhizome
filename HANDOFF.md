# Handoff — rhizome-content-revision (therhizomespace.com)

_Last session: 2026-07-17. Tracked in git, but excluded from every deploy — the staging-dir rsync never lists it, so it cannot reach production._

## Live state — SHIPPED

Deployed to production via `wrangler pages deploy` (deployment `9e9f1d89`, 2026-07-17).
Verified on therhizomespace.com + www: guidebook renders new closing section + inline CTAs, zero mailto in pages, Gmail-compose CTAs live, visible hello@ address CF-obfuscated (1 email-protection span), Function `/api/subscribe` POST -> `{"ok":true,"emailed":true}`, HANDOFF.md serves homepage fallback (not leaked).

- Branch `content-revision`, git == live.
- Latest commit: `e45163a` — contact-path (mailto -> Gmail-compose) + guidebook conversion rewrite + email wrapper polish.
- Earlier session commits: `c55e8ff` send from verified mail. subdomain, `3a41b53` AI-smell reduction + rhizome alignment/spore-stem fixes, `c1312d1` baseline snapshot, `f6f2abd` scannable-flow trim + new pages.
- Deploy method: **staging-dir** (`rsync` html/assets/functions/wrangler.toml to a temp dir, deploy that). HANDOFF.md must stay excluded — verified it serves the homepage fallback, not the file.

## Pages
- `/` homepage — hero rhizome selector, bridge, 3 offers, process + sample link, guidebook opt-in, compact practice, CTA
- `/sample-handover` — the interactive engagement specimen (moved off homepage)
- `/about` — practice depth + proof lines + contact card
- `/guidebook` — full written guide (3-zone data-safety taxonomy, thirty-second test, five-step method, workflow-brief template, review checklist). `noindex`.

## Guidebook opt-in — email LIVE (Resend), fully activated 2026-07-17
- Form → `functions/api/subscribe.js` → KV namespace `SUBSCRIBERS` (id `443c191d6f8b46ab80c8c70ca6b3413e`), bound via `wrangler.toml`.
- Honeypot + client/server email validation. Live-tested on prod: valid stores, bad rejects, bot no-ops.
- **Send LIVE via Resend** (`c55e8ff`): first-time subscribers get the guidebook link emailed; best-effort + non-fatal (no key or failed send still stores + returns `ok`, on-page link is fallback). Repeat submits don't re-send. Homepage copy shows "Sent to your inbox" when `emailed:true`.
- **ACTIVATED:** domain `mail.therhizomespace.com` verified in Resend (DKIM/SPF live); `RESEND_API_KEY` set on the **production** env (`wrangler pages secret list --project-name=rhizome` shows it). `from` = `The Rhizome Space <hello@mail.therhizomespace.com>` (verified sending subdomain); `reply_to` = `hello@therhizomespace.com` (root inbox Email Routing forwards). Override via optional `RESEND_FROM` — must stay on the verified domain. Secrets take effect without redeploy. Tracked in pxeodev/rhizome#1.
- **Gotcha (cost a session):** custom domains serve the **production** branch (`main`) only. Preview deploys (branch `content-revision`, `*.rhizome-5qf.pages.dev`) never reach `therhizomespace.com`. Deploy prod with `--branch=main`. Verify `emailed:true` on the apex, not a preview host.
- Read captured emails: `wrangler kv key list --namespace-id 443c191d6f8b46ab80c8c70ca6b3413e --remote`.

## Contact
WhatsApp +66 61 793 0404 (Thai/English). Office 207/44, Village 3, Mae Hia, Mueang Chiang Mai 50100. hello@therhizomespace.com.

## Contact path + guidebook conversion (shipped `e45163a`, deploy `9e9f1d89`, 2026-07-17)
- **Page contact CTAs are Gmail-compose deep-links, NOT mailto.** Format: `https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=hello@therhizomespace.com&amp;su=<subject>` + `target="_blank" rel="noopener"`. WhatsApp = equal-prominence alt; a visible non-linked `hello@` sits in the `.cta-alt` lines for non-Gmail/non-WhatsApp readers. **DO NOT re-add `mailto:` to pages** — it grows the harvest surface and Cloudflare rewrites it into the ugly `cdn-cgi/l/email-protection` wrapper. Cloudflare Scrape Shield email-obfuscation stays **ON** (it protects the visible plain-text address; verified 1 `email-protection` span live).
- The only `mailto:` in the repo is the **unsubscribe** link/header inside the transactional email (`subscribe.js`). That is intended.
- Inline `.mid-cta` prompts anchor to `#talk` (guidebook bottom call block). Guidebook nav CTA = `/#start` (homepage contact section, id `start`).
- Guidebook closing section: renamed "Where this guide stops" (banned AI slop) -> "The three places this breaks on your own", naming 3 concrete solo-failure modes. **Do not reintroduce "where this guide stops".**
- Voice enforced this pass (all 4 pages): no em dashes (colons), no "not X, it is Y" antithesis. Fable-reviewed.
- Email wrapper (`subscribe.js`): bulletproof button = padding + `bgcolor` on the `<td>` (Outlook Word-engine ignores inline-block + anchor padding); `List-Unsubscribe` header; logo via absolute https URL + alt fallback + text wordmark. Preview render: submit a real address on the live form (best-effort, non-fatal).

---

## AI-smell critique (external review, 2026-07-17) — RESOLVED, shipped in `3a41b53`

Verdict was "moderate AI smell." Homepage (`index.html`) only. What shipped:

**Done:**
- Squared buttons + guidebook input (`border-radius` 100px -> 7/8px). Sweep completed across all 4 pages (`cfe259d` did about/guidebook/sample-handover) — no `100px` radius remains anywhere.
- Hero de-duped: brand stays in the sticky nav only; eyebrow -> "Practical AI · Chiang Mai". (Reviewer's "move the widget below fold" was REJECTED — the rhizome widget is the distinctive asset; kept in hero. User confirmed.)
- Trust strip: 3-equal-column feature grid -> "How we keep it safe" lead + flowing list (`.strip-inner/.strip-lead/.strip-points`). Same 3 promises, breaks the pattern. `.principle` classes removed.
- Offer #3 (Small Business Audit) -> single-column narrative w/ inline `.offer-meta` row (`.offer--compact`). Three offers now read as three shapes.
- Copy: dropped "not the hype"; loosened hero sub.

**Deliberately NOT done (user calls, confirmed):** palette unchanged (greens/turmeric = deliberate phone-ref choice); rhizome metaphor kept; hero widget kept in hero; overall voice kept (light edits only).

## Rhizome alignment + spore-stem fixes (shipped `3a41b53`) — better than the old live

Two real bugs, both were also on the old live:
1. Crown + professional tuber sat ~5px right of the card stem, and the offset SCALED with viewport (card stem is fixed-px; tubers are %-of-width in a scaled SVG). Fix = `alignRhizome()` measures stem vs crown via `getBoundingClientRect` and sets `translateX` on `.roots`, re-run on resize (rAF-throttled) + after fonts load. Aligns at every width incl. mobile 1-col. DO NOT replace with a constant px — that only works at one width.
2. Small-business spore stem left a gap at the crown: its drop path (472->48) exceeds the shared `stroke-dasharray:400`, truncating the grow animation. Fix = `pathLength="100"` on `#dropPath` + `.roots .drop{stroke-dasharray:100;stroke-dashoffset:100}` normalizes coverage to any path length. The spore-stem-from-selected-root behaviour is ORIGINAL and intended — do not flatten it.

**Not smelling (keep):** intentional fonts (Bricolage/Instrument/IBM Plex Mono), no purple/emoji/fake-stat chrome, real specificity (Chiang Mai, baht prices, WhatsApp), the custom rhizome metaphor.

## Standing rules for this repo
- User merges/deploys; deploy only on explicit "deploy" instruction.
- Deploy = staging-dir payload, then verify BOTH custom domains AND the live function (never trust the per-deploy hash host for Functions — it 404s them).
- Keep the practitioner unnamed; use "we". No meta-text / spec-sheet field lists rendered to the consumer.

<!-- git-snapshot-start -->

## Git Snapshot (auto-generated 2026-07-17 15:32)

**Branch:** `content-revision`

**Recent commits:**
```
7322145 docs: mark guidebook email live; note prod-branch deploy gotcha
c55e8ff fix: send guidebook from verified mail. subdomain
aa47579 Update handoff: guidebook email wired via Resend (deploy acdc1b83)
7fec146 Send guidebook to new subscribers via Resend (best-effort)
ed4abe7 Update handoff: button sweep done, deploy 2c4a3220
```

**Uncommitted changes:**
```
 M functions/api/subscribe.js
```

**Diff summary:**
```
 functions/api/subscribe.js | 42 +++++++++++++++++++++++++-----
 1 file changed, 35 insertions(+), 7 deletions(-)
```

<!-- git-snapshot-end -->
