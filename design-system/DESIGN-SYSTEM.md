# AdeptSense — Design System 2.0 (Single Accent & Monochrome)

> **Single source of truth.** Mirrors `src/css/tokens.css`.
> When this file and the tokens disagree, **the tokens win**.

---

## 1. Core Philosophy: Monochrome Precision + 1 Accent

The design system is engineered around **ultra-clean minimalism, high contrast, and functional developer aesthetics**:

- **95% Monochrome**: Pure Black (`#000000` / `#09090B`), Crisp Whites (`#FFFFFF` / `#FAFAFA`), and precision Slate/Zinc Grayscale (`#18181B` to `#E4E4E7`).
- **5% Single Accent Color**: **Electric Indigo (`#6366F1`)** — used exclusively for primary CTAs, interactive highlights, focus halos, and active telemetry signals.
- **Zero Color Clutter**: No mixed rainbow tokens, no competing secondary accents, no separate blues/purples/reds. Everything is cohesive and laser-focused.

---

## 2. Color Tokens

### 1 Single Accent Color
| Token | Value | Role / Usage |
|---|---|---|
| `--accent` | `#6366F1` | Primary CTA buttons, key links, active tabs, focus rings |
| `--accent-hover` | `#4F46E5` | Hover state on accent surfaces |
| `--accent-pressed` | `#4338CA` | Active / pressed state |
| `--accent-dim` | `rgba(99, 102, 241, 0.08)` | Subdued badge / chip background |
| `--accent-glow` | `rgba(99, 102, 241, 0.24)` | Subtle glow around active hero widgets / focus rings |
| `--accent-line` | `rgba(99, 102, 241, 0.28)` | Accent borders / active outlines |

### Monochrome Scale (Ink Spine)
| Token | Value | Role / Usage |
|---|---|---|
| `--ink` | `#09090B` | Primary headings, solid dark buttons, high-emphasis text |
| `--ink-2` | `#18181B` | Secondary headings, navigation links |
| `--ink-3` | `#52525B` | Standard body copy, descriptions |
| `--ink-4` | `#71717A` | Sub-labels, metadata, placeholders |
| `--ink-5` | `#A1A1AA` | Disabled text, subtle icon strokes |

### Surfaces & Borders
| Token | Value | Role / Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | Global light page canvas |
| `--surface` | `#FFFFFF` | Cards, elevated sheets, dropdown menus |
| `--surface-2` | `#F4F4F5` | Sub-cards, table rows, input backgrounds |
| `--surface-3` | `#E4E4E7` | Pill backgrounds, hover states |
| `--border` | `#E4E4E7` | Standard hairline border (1px) |
| `--border-2` | `#F4F4F5` | Subtle nested border |

### Terminal & Code Canvas
| Token | Value | Role / Usage |
|---|---|---|
| `--code-bg` | `#09090B` | Deep obsidian terminal background |
| `--code-bg-2` | `#121215` | Elevated terminal card surface |
| `--code-fg` | `#E4E4E7` | Primary code text |
| `--code-fg-2` | `#A1A1AA` | Secondary comments / metadata |
| `--code-line` | `#27272A` | Terminal window border |
| `--code-acc` | `#6366F1` | Highlighted syntax tokens |

---

## 3. Typography

| Role | Font Family | Purpose |
|---|---|---|
| **Display Headings** | `Sora`, system-ui, sans-serif | High-impact, geometric, modern fintech hero headings |
| **Body & UI** | `Plus Jakarta Sans`, sans-serif | Highly legible, clean body copy, inputs, navigation |
| **Code & Data** | `JetBrains Mono`, monospace | Code snippets, JSON streams, latencies, telemetry |

---

## 4. Geometry & Elevation

- **Radii**: `--r-sm: 6px` (buttons/chips), `--r: 10px` (cards/bento), `--r-lg: 16px` (modals/hero console), `--r-full: 9999px` (pills).
- **Shadows**: Pure neutral ink shadows (`0 4px 12px rgba(0,0,0,0.06)`), never tinted with arbitrary colors.
- **Transitions**: Fast, responsive spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
