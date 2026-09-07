# Phase A+B Implementation Brief

Shipped in PR against `main`. Marc deploys.

## What changed

### New: AI Readiness Map (`/map`, `map.html`)

Interactive client-side quiz. Eight questions across four axes (Comfort, Safety, Task, Supervision), scored 0-2 each. Three entry paths: for myself, for my team, for my small business.

- **No email required to see results.** Results display immediately after the last question.
- **Four-root rhizome visual:** SVG with four roots growing downward from a central crown. Root thickness and fill reflect axis strength (weak = thin/dashed, growing = medium, strong = turmeric-filled).
- **Result routing:** one primary CTA based on scores + path, with secondary links to guidebook, waitlist and WhatsApp. Routing logic: low Safety points to guidebook; low Comfort + OK Safety points to space waitlist / workshop; team path + mixed scores points to Team Sprint; business path + strong tasks points to Audit; strong Task + Safety with weak Supervision points to Clinic; high overall points to free call.
- **Optional email capture** after result: reuses `/api/subscribe` with `source: "map"`, stores scores and path in KV record, emails the guidebook to first-time subscribers.

### Homepage changes (`index.html`)

- **Hero softened for learners:** H1 now "Learn AI for the work you already do." (turmeric underline on "already do"). Sub keeps "bring something you already do most weeks." Production-systems language removed from hero (remains in the Chiang Mai / About section).
- **Hero CTAs:** primary "Take the free map" links to `/map`. Secondary "Join the space waitlist" links to `#space`.
- **Three-doors strip** after safety strip: Learn (map, guidebook, workshops coming soon), Get help (clinic / audit / sprint), Come by (coffee and coworking, coming early 2027, waitlist link).
- **The Space section** (`#space`): Mae Hia context, forward-looking "coming in early 2027" framing, waitlist form with name (optional), email (required), WhatsApp (optional). Honeypot + client validation matching guidebook form pattern.
- **Offer cards:** added short "Fits if..." one-liners tied to map outcomes.
- **Nav updated:** Map, Services, Guidebook, About, WhatsApp, "Join the waitlist" gold CTA button. Mobile hamburger menu matches.
- **Footer updated:** Map link added, sample-handover link removed (still accessible via `/sample-handover`).

### Navigation updates (all pages)

- `about.html`: nav now includes Map, Services, Guidebook, WhatsApp, waitlist CTA.
- `sample-handover.html`: same nav pattern.
- `guidebook.html`: nav CTA changed from "Request a free call" to "Take the free map".
- `map.html`: nav includes Services, Guidebook, About, WhatsApp, waitlist CTA.

### API extension (`functions/api/subscribe.js`)

- Accepts `source` field: `guidebook` (default, backward-compatible), `map`, or `space-waitlist`.
- `map` source stores `scores` (four-axis object) and `path` (self/team/business) in the KV record. Sends guidebook email on first subscribe.
- `space-waitlist` source stores optional `name` and `whatsapp`. Does not send guidebook email.
- Re-subscribes from a different source append to a `sources` array, preserving the original source record.
- Honeypot check remains. Email validation unchanged.

## What did not change

- Existing guidebook subscribe flow: untouched, backward-compatible.
- Palette, fonts, CSS variables: all reused from existing site.
- Safety strip, method 01-05, guidebook Resend opt-in, sample handover link, contact paths (WhatsApp + Gmail-compose), baht prices: all kept.
- No `mailto:` on any page. No em dashes. No antithesis patterns. Practitioner unnamed ("we").
- `wrangler.toml`: unchanged. Same KV binding.

## Voice/style rules followed

- No `mailto:` links on pages (Gmail-compose deep links used where email CTA needed).
- No em dashes (colons used instead).
- No "not X, it is Y" antithesis.
- Practitioner unnamed: "we" throughout.
- Palette: leaf, paper, turmeric, ginger, soil, stem, mist.
- Fonts: Bricolage Grotesque, Instrument Sans, IBM Plex Mono.
- Space waitlist copy: forward-looking "coming in early 2027", no invented hours.
