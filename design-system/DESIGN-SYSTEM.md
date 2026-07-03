# AdeptSense — Design System

> **Single source of truth.** Mirrors `src/css/tokens.css`.
> When this file and the tokens disagree, **the tokens win** — update this doc.
> Live visual reference: `styleguide.html` (self-contained, mirrors the tokens).
> Last revised: Variant C · Deeper rollout.

---

## 1. Philosophy

> Mostly **black + white**, one **purple** accent, one **red** accent kept tiny.

The brand was derived directly from `assets/logo/adeptsense-logo-original.png`:

| Logo color | Hex | Pixels | Role in UI |
|---|---|---|---|
| Black | `#000000` | 64% | Ink spine — primary text, surface inversion |
| Red | `#BB2D2E` | 17.4% | **Reserved** — eyebrow dot, live indicator, danger, destructive only |
| Deep purple | `#26125B` | 10.9% | Voice — code blocks, mono tokens, subtle references |

The **accent purple** (`#4B1D95`) is one shade brighter than the logo's deep purple — same hue family, +8% lightness. It bridges the logo and the UI: bright enough for CTAs, deep enough to feel premium-fintech (Linear / Plaid / Mercury vibe).

Red is **never** used as a CTA or background band. It exists for the few moments a developer actually cares: "live", "verified fail", "revoke". The 1-3 occurrences of red per screen is a hard rule.

---

## 2. Color Tokens

All colors are defined in `src/css/tokens.css`. **Do not hardcode hex values in component CSS** — always use `var(--token)`.

### Brand Accent — deep purple
| Token | Hex | Use |
|---|---|---|
| `--blue` | `#4B1D95` | Primary CTAs, links, focus rings |
| `--blue-hover` | `#5A23B3` | Hover state on accent surfaces |
| `--blue-pressed` | `#3A1773` | Active / pressed state |
| `--blue-dim` | `#F3EFFB` | Tinted chip / pill background |
| `--blue-glow` | `rgba(75,29,149,.22)` | Focus ring halo |

### Voice — logo's deep purple (reserved)
| Token | Hex | Use |
|---|---|---|
| `--voice` | `#26125B` | Mono text, inline code on light surfaces |
| `--voice-soft` | `#EDE9F7` | Voice chip background |
| `--voice-line` | `#C7BCE0` | Voice chip border |

> Use on **light surfaces only**. On dark `#0D1117` terminals, use `--code-acc` instead.

### Red — RESERVED
| Token | Hex | Use |
|---|---|---|
| `--red` | `#BB2D2E` | Eyebrow dot, live indicator, danger chip |
| `--red-hover` | `#9E2224` | Hover on destructive CTA |
| `--red-dim` | `#FCEBEC` | Destructive chip background |
| `--red-line` | `#E9B4B5` | Destructive chip border |

**Cap: ≤3 occurrences per screen, never a band/background.**

### Neutrals — "Ink Spine"
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B0B0F` | Primary text (warm black, matches logo's true black) |
| `--ink-2` | `#1F2937` | Nav text, secondary headlines |
| `--ink-3` | `#4B5563` | Body text |
| `--ink-4` | `#6B7280` | Helper, placeholder |
| `--bg` | `#FAFAFA` | Page background (off-white, not pure) |
| `--surface` | `#FFFFFF` | Cards, modals |
| `--border` | `#E5E7EB` | Default border |
| `--border-2` | `#F3F4F6` | Card-on-card dividers |

### Code / Terminal (on dark surfaces)
| Token | Hex | Use |
|---|---|---|
| `--code-bg` | `#0D1117` | Code block background |
| `--code-bg-2` | `#0B0F19` | Hero terminal mock background |
| `--code-fg` | `#C9D1D9` | Default terminal text |
| `--code-fg-2` | `#D1D5DB` | Terminal text (hero variant) |
| `--code-line` | `#21262D` | Terminal border |
| `--code-kw` | `#FF7B72` | Keyword (`def`, `import`, `return`) |
| `--code-fn` | `#79C0FF` | Function / call |
| `--code-str` | `#A5D6FF` | String literal |
| `--code-val` | `#56D364` | Numeric / boolean literal |
| `--code-var` | `#FFA657` | Variable / parameter |
| `--code-cm` | `#6E7681` | Comment |
| `--code-acc` | `#A78BFA` | Accent-highlight (≈ violet-400 on dark) |
| `--code-ok` | `#34D399` | Success string |
| `--code-warn` | `#F59E0B` | Warning / number |

Verified contrasts:
- `--code-acc` on `--code-bg-2` = **6.95:1** (WCAG AAA)
- `--voice` on white = **15.91:1** (AAA)
- `--voice` on `--code-bg` = 1.19:1 — **invisible**, never use voice token on dark surfaces

### Status (use sparingly)
| Token | Hex | Use |
|---|---|---|
| `--success` | `#15803D` | Success text |
| `--success-soft` | `#DCFCE7` | Success chip bg |
| `--warning` | `#B45309` | Warning text |
| `--warning-soft` | `#FEF3C7` | Warning chip bg |
| `--danger` | `#991B1B` | Destructive only (darker than --red) |
| `--danger-soft` | `#FEE2E2` | Destructive chip bg |

---

## 3. Usage Ratios

The page should read **mostly black on white**, with purple punching at the focal points. Aim for these rough proportions per screen:

| Surface | Token | Target % |
|---|---|---|
| Off-white background | `--bg` | ~72% |
| Warm black / primary text | `--ink` | ~18% |
| Accent purple (CTAs, links, focus) | `--blue` | ~8% |
| Voice purple (mono tokens) | `--voice` | ~1.5% |
| Status red (live / danger / dot) | `--red` | ~0.5% |

If a screen uses **>20%** purple, mute something. If red appears in more than **3 distinct spots**, it's not reserved anymore.

---

## 4. Typography

| Token | Family | Use |
|---|---|---|
| `--font-sans` | Plus Jakarta Sans | Body, UI text |
| `--font-display` | Sora | Headlines |
| `--font-mono` | JetBrains Mono | Code, technical labels |
| italic emphasis | Lora | "Em" highlights, quotes |

Display headlines use `--font-display` (Sora) — geometric, high-impact, dev-friendly.

Italic emphasis `<em>` switches to **Lora** (serif italic). This is the only serif in the system and should be reserved for emphasis that earns it: brand words, quotes, "voice moments".

---

## 5. Geometry & Spacing

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `6px` | Buttons, chips, small radii |
| `--r` | `10px` | Cards (was 12px, narrowed to feel more "developer") |
| `--r-lg` | `16px` | Large surfaces, code blocks |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard material-ish ease |

Spacing scale (unchanged):
`--space-xs` (4) · `--space-sm` (8) · `--space-md` (16) · `--space-lg` (24) · `--space-xl` (32) · `--space-2xl` (48) · `--space-3xl` (64)

---

## 6. Shadow Scale

Shadows are tinted toward **ink** (warm black), not blue — this keeps the cool accent from bleeding into elevations.

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(11,11,15,.06)` |
| `--shadow-md` | `0 4px 12px rgba(11,11,15,.08)` |
| `--shadow-lg` | `0 12px 24px rgba(11,11,15,.10)` |
| `--shadow-xl` | `0 20px 32px rgba(11,11,15,.14)` |

---

## 7. Component Conventions

### Buttons
- **Primary** — `bg: var(--blue)`, white text, `padding: 11px 18px`, `--r-sm`. Hover: `var(--blue-hover)` + `translateY(-1px)`.
- **Secondary** — `bg: var(--ink)`, white text. Use when the primary purple would compete with another purple on the page.
- **Ghost** — transparent, `border: var(--border)`, `color: var(--ink)`. Hover: `var(--ink-4)` border.
- **Danger** — `border: var(--border)`, `color: var(--danger)`. Hover: `var(--danger-soft)` bg. Reserve for revoke, delete, force-stop.
- **Link** — transparent, `color: var(--blue)`, no bg. Hover: `border-bottom: 2px solid var(--blue)`.

### Chips
Four flavors: `chip-accent` (purple), `chip-voice` (deep purple), `chip-success`, `chip-warning`. Each is `bg -soft / color / border -line`.

### Code blocks
Two flavors:
1. **Inline** `<code>` — uses `var(--voice)` on light surfaces, monospace, 13px, `bg: var(--border-2)`.
2. **Block** — `bg: var(--code-bg)`, `color: var(--code-fg)`, syntax classes `.c-kw .c-fn .c-str .c-val .c-cm .c-var` (all tokenized).

### Terminal mocks (hero, video previews)
Use `--code-bg-2` background, `--code-fg-2` text, with `.hv-k .hv-str .hv-n` classes mapped to `--code-acc --code-ok --code-warn`.

---

## 8. Red-Reservation Rule

Red is the most expensive color in the palette. Overuse dilutes its meaning.

**Reserve `--red` for:**
1. The red dot in the eyebrow chip (≤3 chars wide, ~6px circle).
2. The "live" / "streaming" indicator dot (always with pulse animation).
3. Destructive CTA (with `var(--danger)`, not `--red`, for the button itself).
4. Danger state badges / "Failed" labels on verified-fail results.

**Never:**
- Use red as a background band (the one violator in the original codebase was the `.stats-wrap` strip — moved to `--ink`).
- Pair red text with red icon on the same surface (use `--red-dim` bg for chip context).
- Use red for accents that aren't tied to a state (no decorative red bars, no red dividers).

When in doubt, use `--blue`. If the state really needs red (and only red will read), keep it to **≤3 occurrences per viewport**.

---

## 9. Anti-Patterns (don't)

- ❌ Hardcoding hex values anywhere in section CSS — always use `var(--token)`. The token system exists to make rebrands trivial.
- ❌ Using Tailwind utility classes outside `hero-explorations.html` (it's an exploration file, not part of the live system).
- ❌ Scaling a card on hover (`transform: scale(1.02)`) — layout shift. Use shadow + 1px translate instead.
- ❌ Using `var(--voice)` on a dark surface — invisible. Use `--code-*` tokens instead.
- ❌ Adding new hex literals to terminal mocks — extend the `--code-*` family in `tokens.css`.
- ❌ More than one accent per page. Pick purple or red per screen, never both at the same focal point.

---

## 10. File Map

| Concern | File |
|---|---|
| Tokens (source of truth) | `src/css/tokens.css` |
| Global reset + typography | `src/css/base.css` |
| Buttons, chips, cards, forms | `src/css/components.css` |
| Sections (hero, features, pricing, footer) | `src/css/sections/*.css` |
| Live visual reference | `styleguide.html` (open in browser) |
| Logo (canonical source) | `assets/logo/adeptsense-logo-original.png` |
| Logo (served) | `public/logo.png` |

---

## 11. Known Issues / Open Follow-ups

| Issue | Where | Action |
|---|---|---|
| `services-showcase.mp4` referenced from `index.html` (line 211, 617) but missing from `public/` | `public/` | Re-add the mp4 or change source paths |
| `dist/` is not committed | repo | Not a source file; rebuild with `npx vite build` |
| `hero-explorations.html` uses old `--blue: #7C3AED` tokens (intentionally — it's an exploration artifact) | `hero-explorations.html` | Leave; explore files keep their old palette |
| Stale `dist/services-showcase.mp4` (old build artifact) was wiped during clean rebuild | `dist/` | Will re-emerge once the source mp4 is added back to `public/` |

---

**Version log:**
- *Variant C · Deeper* — adopted `#4B1D95` as primary accent (deep purple, Tailwind violet-800). Red reserved. Full code-token coverage added.
- *Variant C* — initial "Bento Hybrid": purple primary, red as 6px dot only.
- *Variant B (deprecated)* — Red as full accent. Replaced.
- *Variant A (deprecated)* — Black · White · Red. Replaced.
