# AdeptSense — Identity Verification API

AI-powered identity verification: NID OCR, face match, liveness, name translation, gender estimation — five production endpoints behind one consistent JSON contract.

- **Site:** `index.html` — marketing landing page
- **Docs:** `docs.html` — full API reference
- **Playground:** `playground.html` — try the API live (sandbox mode)

## Stack

- Vite 8 (multi-entry build, no framework)
- Vanilla JS, no TypeScript
- Multi-file CSS architecture (`src/css/`)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview  # serve dist/
```

Requires **Node 18+**.

## Folder Map

```
.
├── index.html              # Marketing landing page (entry)
├── docs.html               # API reference (entry)
├── playground.html         # Interactive API tester (entry)
├── package.json
├── vite.config.js
├── public/                 # Static assets served at /
│   ├── favicon.svg
│   └── logo.png
├── src/                    # Source code bundled by Vite
│   ├── main.js
│   ├── style.css           # Index entry stylesheet
│   ├── docs.css            # Docs entry stylesheet
│   ├── playground.css      # Playground entry stylesheet
│   ├── hero.png            # Hero dashboard poster
│   ├── nid-sample-b.png    # Sample NID back
│   ├── nid-sample-f.png    # Sample NID front
│   └── css/
│       ├── tokens.css      # Design tokens (single source of truth)
│       ├── base.css        # Resets + base typography
│       ├── components.css  # Buttons, cards, badges, etc.
│       ├── responsive.css  # Breakpoint overrides
│       └── sections/
│           ├── hero.css
│           ├── features.css
│           ├── footer.css
│           ├── video-showcase.css
│           └── pricing-cta.css
├── design-system/          # Brand & component docs
│   └── DESIGN-SYSTEM.md
├── research/               # Market research, IA, competitors
│   ├── adeptsense-ia.md
│   ├── competitors.md
│   └── AdeptSense_UX_Market_Research_Report.md
└── internal/               # Working files NOT shipped
    ├── hero-explorations.html
    ├── showcase-options.html
    ├── styleguide.html
    ├── content-draft.html
    └── api-helper-source.html
```

## Brand

- Primary: `--blue: #4B1D95` (deep violet)
- Accent: `--voice: #26125B` (mono/code purple)
- Reserved: `--red: #BB2D2E` (use ≤3 per screen)
- New: `--green: #10B981` (status/success)
- Ink scale: `--ink / --ink-2 / --ink-3 / --ink-4`
- Surfaces: `--bg: #FAFAFA`, `--surface: #FFFFFF`, `--border: #E5E7EB`

Fonts: Plus Jakarta Sans (body) · Sora (display) · Lora (italic accent) · JetBrains Mono (code)

## Conventions

- 2-space indent, LF line endings (see `.editorconfig`)
- CSS variables from `src/css/tokens.css` — never hardcode colors or fonts
- New components go in `src/css/components.css`; section styles in `src/css/sections/`
- Multi-entry HTML — each entry has its own `<link>`/`<script>` and CSS file
- Internal/exploratory files in `internal/` — never link from shipped pages

## API quickstart

```bash
curl -X POST https://api.adeptsense.tech/api/v1/ocr \
  -H "Authorization: Bearer $ADEPTSENSE_API_KEY" \
  -F "document=@nid-front.jpg" \
  -F "document_back=@nid-back.jpg"
```

See `docs.html` for full reference, or `playground.html` to try it live.
