# AdeptSense — Full Information Architecture

> Three surfaces · research-backed · includes improvements
>
> **Legend:** `[New]` = recommended addition · `[Key]` = must-have · `[Fix]` = needs improvement

---

## Surface 1 — Marketing site

**URL:** adeptsense.tech

### 01 · Navigation `[Key]`

- Logo · Products · Use Cases · Docs · Pricing · Sign in · **Get API key** (CTA)
- Sticky on scroll · Mobile hamburger · Transparent → solid on scroll

### 02 · Hero `[Key]`

- Strong one-liner claim → sub-headline → dual CTA (Get API key + Live demo)
- Live API response card on the right showing a real JSON result
- > **Research insight:** Developer-first products that show actual output in the hero convert better than abstract imagery (Stripe, Twilio pattern)

### 03 · Trust strip

- Social proof logos + compliance badges
- GDPR · SOC2 Ready · 256-bit Encryption · ISO 27001
- > **Research insight:** In identity/security products, CTOs look for compliance signals before anything else

### 04 · Bangladesh advantage callout `[New]`

- Dedicated "Built for Bangladesh" strip or section
- NID OCR tuned for BD cards + Bangla transliteration
- Onfido and Jumio don't do this
- > **Research insight:** This is AdeptSense's unfair advantage vs global players. It should be a standalone section, not buried in the services grid

### 05 · Services `[Key]`

Five cards, each with a brief description + link to demo + link to API docs:

- NID OCR
- Face Match
- Liveness Verification
- Name Translation
- Gender Estimation

### 06 · Use cases `[New]`

Industry-specific scenarios with "View Guide" links:

- Fintech & KYC / AML
- HR & Employee onboarding
- Healthcare
- E-commerce age verification
- Ride-sharing / gig economy
- > **Research insight:** Fintech buyers have specific KYC/AML compliance pain — calling that out by name increases conversion from that segment significantly

### 07 · How it works

- 3 steps: Start session → Collect data → Get JSON
- Show actual JSON snippets at each step, not icons

### 08 · Integration / code

- Code tabs: Node.js · Python · cURL
- SDK list: Android · iOS · WebView
- Links to GitHub and full docs

### 09 · Stats / proof

- 99.4% accuracy
- <1s average response time
- 180+ countries supported
- 50M+ verifications processed

### 10 · Pricing `[Fix]`

Three tiers:

- **Starter** — per verification, up to X/month
- **Growth** — volume discount
- **Enterprise** — custom quote
- Add a volume estimator or simple pricing calculator
- > **Fix note:** Missing from current v2. Developers want to estimate cost before signing up

### 11 · CTA band + Footer

- Full-width CTA before footer: "Start verifying identities today"
- Footer columns: Services · Developers · Use Cases · Company · Status · Legal
- Include: live API status indicator · social links · blog

---

## Surface 2 — API documentation

**URL:** api.adeptsense.tech/docs

### 01 · Persistent sidebar `[Key]`

- Left-side sticky nav with all sections
- Search bar at top
- Version selector
- Sandbox / Live environment toggle
- > **Research insight:** Stripe and Twilio both use this pattern — developers navigate docs non-linearly and need persistent orientation

### 02 · Overview / intro

- What is AdeptSense
- Base URL
- Authentication format — show explicitly as: `Authorization: Bearer YOUR_API_KEY`
- Rate limits
- Supported file formats

### 03 · Quickstart `[Key]`

- Get from zero to first successful API call in <5 minutes
- Language tabs: Node.js · Python · cURL
- Copy-paste ready code blocks
- > **Research insight:** Stripe's quickstart is the single most copied pattern in API docs. Developers decide to adopt within the first 5 minutes or not at all

### 04 · Sandbox / test environment `[New]` `[Fix]`

- Separate base URL: `api-sandbox.adeptsense.tech`
- Mock responses — no real NID data processed
- No credits used in sandbox
- > **Fix note:** Enterprise clients will not integrate without a safe test environment. This is a blocker for B2B sales

### 05 · Endpoints reference

One section per service, each containing:

- Description
- Request params + request body schema
- **Dual response schema** — document both formats (see below)
- Code examples (success + failure for both formats)
- Error examples

**Endpoints:**

- `POST /verify/nid`
- `POST /verify/face-match`
- `POST /verify/liveness`
- `POST /translate/name`
- `POST /predict/gender`

**Response format: dual-shape documentation**

Each endpoint should document both response shapes side-by-side:

**Format A — Simple (current):**

```json
{
  "verified": false,
  "face_match_score": 0.42,
  "liveness_score": null
}
```

**Format B — Structured error codes (target):**

```json
{
  "verified": false,
  "face_match_score": 0.42,
  "error_code": "ERR_LOW_MATCH",
  "error_message": "Face match score below threshold",
  "recommended_action": "Ask user to retake selfie with better lighting"
}
```

> **Design note:** Document Format A as "current" and Format B as "enhanced". This lets developers integrate today while setting expectations for the richer format. The playground and docs handle both seamlessly.

### 06 · Score thresholds guide `[New]`

Explain what scores mean for each service:

| Score range | Verdict | Recommended action |
|---|---|---|
| 0.90 – 1.00 | Strong match | Automatic approval |
| 0.70 – 0.89 | Possible match | Flag for manual review |
| 0.00 – 0.69 | No match | Reject |

Same table format for liveness_score.
> **Research insight:** Without this, every developer will open a support ticket asking "what score counts as a pass?"

### 07 · Error code reference `[New]` `[Key]`

Two-tier approach — works regardless of current API behaviour:

**Tier 1 — HTTP status codes (always available):**

| HTTP status | Meaning | Developer action |
|---|---|---|
| 200 | Success — verification complete | Read `verified`, scores, and extracted fields |
| 400 | Bad request — missing or invalid params | Check request body against schema |
| 413 | File too large | Compress image before upload |
| 403 | Unauthorized or quota exceeded | Check API key / upgrade plan |
| 422 | Unprocessable — image quality issue | Ask user to retake photo |
| 500 | Server error | Retry with exponential backoff |

**Tier 2 — Structured error codes (when available / roadmap):**

| Code | HTTP status | Cause | Fix |
|---|---|---|---|
| ERR_IMAGE_BLURRY | 422 | OCR couldn't read text | Ask user to retake photo |
| ERR_LOW_LIGHT | 422 | Liveness check failed — poor lighting | Improve lighting guidance |
| ERR_INVALID_DOCUMENT | 422 | Not a Bangladesh NID | Validate doc type client-side |
| ERR_LOW_MATCH | 200 | Face match score below threshold | Prompt better selfie |
| ERR_LIVENESS_FAIL | 200 | Liveness check didn't pass | Re-attempt with anti-spoof guidance |
| ERR_FILE_TOO_LARGE | 413 | File exceeds size limit | Compress before upload |
| ERR_UNAUTHORIZED | 403 | API key invalid or expired | Recheck API key |
| ERR_QUOTA_EXCEEDED | 403 | Monthly limit reached | Upgrade plan |

> **Implementation note:** If the API currently returns only HTTP status + boolean, document Tier 1 now and mark Tier 2 as "Enhanced error codes — rolling out". This sets developer expectations and gives the backend team a clear target contract to implement incrementally.

### 08 · Webhooks `[New]`

For async liveness results:

- POST callback to your server when result is ready
- Payload schema
- Retry logic + backoff
- Signature verification
- > **Research insight:** Polling is an anti-pattern for mobile apps. Webhooks are expected by enterprise clients

### 09 · SDKs

- Android SDK — install · basic usage · GitHub link · changelog
- iOS SDK — install · basic usage · GitHub link · changelog
- Node.js SDK — install · basic usage · npm link · changelog

### 10 · Postman collection + OpenAPI spec `[New]`

- "Download Postman collection" button (JSON)
- "Download OpenAPI spec" button (YAML)
- > **Research insight:** Twilio's Postman collection is one of their highest-converting developer onboarding tools

### 11 · Rate limits + file specs

- Requests per second per plan tier
- Max file size (e.g. 5MB)
- Supported formats: JPEG · PNG · WebP
- Max resolution
- Timeout recommendations (e.g. 5000ms)

---

## Surface 3 — API helper / playground

**URL:** api.adeptsense.tech/api-helper

### 01 · Header bar `[Key]`

- Logo
- Environment toggle: Sandbox / Live
- Live API status indicator (green dot — "API: Online")
- Link to full docs
- > **Research insight:** A live uptime indicator builds instant trust in identity verification products — uptime is everything in this category

### 02 · Service selector sidebar

Left nav listing all 5 services — click to load that service's form:

- NID OCR
- Face Match
- Liveness Verification
- Name Translation
- Gender Estimation

### 03 · Demo mode with sample data `[New]` `[Fix]`

- No API key needed to try
- "Use sample images" button loads pre-built dummy NID + selfie
- Prevents real PII being uploaded by visitors
- > **Fix note:** Currently users must upload real NID data to test. This is a privacy risk and a conversion killer — most prospects won't upload their ID to a site they haven't paid for yet

### 04 · Split-screen layout `[New]`

- **Left panel:** input form — file uploads, options, API key field
- **Right panel:** live JSON response in syntax-highlighted code block
- Synced — response updates as soon as request completes

### 05 · Dynamic cURL generator `[New]`

- As the user fills the form, auto-generate the exact cURL command for their terminal
- One-click copy button
- > **Research insight:** Developers love copy-paste cURL commands. Low-effort, high-impact feature that signals developer-first thinking

### 06 · Response interpretation panel

- Human-readable verdict below or alongside JSON
- Colour-coded by threshold level (green / amber / red)
- **Handles both response formats:**
  - **If structured error code present →** show specific message: `"ERR_LOW_LIGHT — Improve lighting and retry"`
  - **If only boolean + score →** derive verdict from score thresholds: `"Face match: Weak (0.42) — Flag for manual review"`
- Example output for Format A: `"Liveness: Passed (0.97) · Face match: Strong (0.94) — Recommended to approve"`
- Example output for Format B: `"Liveness: Passed (0.97) · Face match: Failed — ERR_LOW_MATCH — Ask user to retake selfie"`

### 07 · Masked response for privacy `[New]`

- If real images are used: return `nid_number: "••••••4821"` in the helper response
- Reinforces privacy commitment visually

### 08 · Quick links to SDK docs `[Fix]`

- Sidebar or header: "Need mobile SDK? → Android · iOS"
- Developers who start on the helper often need to move to SDK for camera handling

---

## Response format strategy

> **Resolved:** The docs and playground are designed to handle **both** response formats:
>
> - **Format A (simple):** `{ "verified": false, "face_match_score": 0.42 }` — boolean + scores only
> - **Format B (structured):** Adds `error_code`, `error_message`, and `recommended_action` fields
>
> **Approach:**
>
> 1. Document both formats in the API docs (§05) — Format A as "current", Format B as "enhanced"
> 2. Error reference (§07) uses a two-tier table — HTTP status codes (always work) + structured codes (when available)
> 3. Playground interpretation panel (Surface 3 §06) reads `error_code` if present, otherwise derives verdicts from score thresholds
> 4. Backend team can migrate from A → B incrementally, endpoint by endpoint, without breaking existing integrations
>
> **No blocker.** Surface 2 + 3 can proceed immediately.
