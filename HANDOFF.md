# Handoff — rhizome-content-revision (therhizomespace.com)

_Last session: 2026-07-17. Tracked in git, but excluded from every deploy — the staging-dir rsync never lists it, so it cannot reach production._

## Live state — SHIPPED

Deployed to production via `wrangler pages deploy` (deployment `ea76c6b4`, 2026-07-17).
Verified on therhizomespace.com + www: new markers present, Function `/api/subscribe` POST -> 200 (not 404), HANDOFF.md serves homepage fallback (not leaked).

- Branch `content-revision`, git == live.
- Latest commit: `3a41b53` — AI-smell reduction + rhizome alignment/spore-stem fixes.
- Earlier session commits: `c1312d1` baseline snapshot, `f6f2abd` scannable-flow trim + new pages, `f0a8679` meta-text sweep, `abbdac0` track HANDOFF.md.
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

## AI-smell critique (external review, 2026-07-17) — RESOLVED, shipped in `3a41b53`

Verdict was "moderate AI smell." Homepage (`index.html`) only. What shipped:

**Done:**
- Squared buttons + guidebook input (`border-radius` 100px -> 7/8px). NOTE: only `index.html` changed; about/guidebook/sample-handover still have `border-radius:100px` `.btn` — apply the same sweep there if consistency wanted.
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

## Git Snapshot (auto-generated 2026-07-17 12:49)

**Branch:** `content-revision`

**Recent commits:**
```
abbdac0 Track session handoff; stop gitignoring HANDOFF.md
f0a8679 Tighten meta-text across all pages
f6f2abd Trim homepage to scannable flow; add guidebook, sample-handover and about pages
c1312d1 Match live deployment d74773af: rhizome hero, cutaway horizon, phone-reference palette
a8575e1 Grow audience shoots upward from root nodes
```

<!-- git-snapshot-end -->
