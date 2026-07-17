# Handoff — rhizome-content-revision (therhizomespace.com)

_Last session: 2026-07-17. Tracked in git, but excluded from every deploy — the staging-dir rsync never lists it, so it cannot reach production._

## Live state — SHIPPED

Deployed to production via `wrangler pages deploy` (deployment `28ead97f`).
Verified on therhizomespace.com + www + rhizome-5qf.pages.dev.

- Branch `content-revision`, worktree clean, git == live.
- 3 commits this session:
  - `c1312d1` baseline snapshot of the earlier direct-upload deploy (git was diverged)
  - `f6f2abd` trim homepage to scannable flow + new pages
  - `f0a8679` meta-text tightening sweep
- Deploy method: **staging-dir** (`rsync` html/assets/functions/wrangler.toml to a temp dir, deploy that). HANDOFF.md must stay excluded — verified it serves the homepage fallback, not the file.

## Pages
- `/` homepage — hero rhizome selector, bridge, 3 offers, process + sample link, guidebook opt-in, compact practice, CTA
- `/sample-handover` — the interactive engagement specimen (moved off homepage)
- `/about` — practice depth + proof lines + contact card
- `/guidebook` — full written guide (3-zone data-safety taxonomy, thirty-second test, five-step method, workflow-brief template, review checklist). `noindex`.

## Guidebook opt-in — PARTIAL
- Form → `functions/api/subscribe.js` → KV namespace `SUBSCRIBERS` (id `443c191d6f8b46ab80c8c70ca6b3413e`), bound via `wrangler.toml`.
- Honeypot + client/server email validation. Live-tested on prod: valid stores, bad rejects, bot no-ops.
- **GAP: no email is actually sent.** Subscriber gets the on-page "read it now" link only. No delivery pipeline wired (needs Cloudflare Email Routing or a provider).
- Read captured emails: `wrangler kv key list --binding SUBSCRIBERS`.

## Contact
WhatsApp +66 61 793 0404 (Thai/English). Office 207/44, Village 3, Mae Hia, Mueang Chiang Mai 50100. hello@therhizomespace.com.

---

## NEXT-SESSION BACKLOG — AI-smell critique (external review, 2026-07-17)

Verdict from review: "moderate AI smell." Triaged below — some points conflict with the user's own earlier decisions, so confirm before acting.

**Act on (clear wins):**
1. Make "The Rhizome Space" the hero-level signal; the generic H1 "Make AI useful at work." could belong to any AI consultancy. Brand currently lives only in the nav.
2. Thin the hero: brand + one line + one CTA + one visual. Move the audience/rhizome widget and the 3-up trust strip below the fold.
3. Square off the buttons — `border-radius:100px` pill CTAs are a strong AI-UI tell. (Global `.btn` change, touches all 4 pages.)
4. Break the 3 offers out of the identical template (audience→promise→duration/format/price→deliverable→CTA reads as generated schema). Vary structure/length per offer.

**Confirm first (conflicts with prior user calls):**
5. "Shift palette off the cream/turmeric cluster" — DIRECTLY conflicts with the user's explicit choice to match the greener, location-appropriate palette from their phone references. Do NOT change without asking.
6. 3-up principle strip ("Fixed scope / Sanitized examples / Human review") flagged as AI-pattern. But it encodes the real fixed-scope promise. Rewrite as one sentence vs cut vs keep — user's call.
7. Copy tropes ("one real task", "working method", "handover", "not the hype") flagged as over-sanded. User wrote/approved most of this voice. Light edits, not wholesale.

**Not smelling (keep):** intentional fonts (Bricolage/Instrument/IBM Plex Mono), no purple/emoji/fake-stat chrome, real specificity (Chiang Mai, baht prices, WhatsApp), the custom rhizome metaphor.

## Standing rules for this repo
- User merges/deploys; deploy only on explicit "deploy" instruction.
- Deploy = staging-dir payload, then verify BOTH custom domains AND the live function (never trust the per-deploy hash host for Functions — it 404s them).
- Keep the practitioner unnamed; use "we". No meta-text / spec-sheet field lists rendered to the consumer.
