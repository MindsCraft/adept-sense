# Step 01: Research & Empathize (Discover)

> **UX Design Phase:** 01 — Discover  
> **Document Status:** Master Reference for Step 1  
> **Context:** AI-Powered Identity Verification & Developer Experience (AdeptSense Case Study)

---

## 1. Research Objectives & Methodology

The goal of this research phase is to investigate the global and regional Identity Verification (IDV) landscape, identify the key points of user and developer friction, and benchmark the world’s top developer-centric AI products to understand what makes them best-in-class.

### Methodology
- **Competitive Landscape Analysis:** Auditing 10 top IDV and developer SaaS platforms (Persona, Stripe Identity, Sumsub, Veriff, Shufti Pro, Linear, Resend, Supabase).
- **User Friction & Onboarding Study:** Examining abandonment statistics, camera capture UX hurdles, and error recovery patterns.
- **Regional Market Audit (Emerging Markets & Bangladesh):** Documenting physical ID variations, OCR failure modes, script transliteration barriers, and regulatory compliance constraints.

---

## 2. In-Depth Competitor Benchmarking

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                COMPETITIVE MATRIX & AUDIT SUMMARY                                │
├─────────────────┬──────────────────────┬──────────────────────┬──────────────────────────────────┤
│ Competitor      │ Target Audience      │ Key UX/DX Strengths  │ Primary Limitations              │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Persona         │ Modern Tech & Devs   │ Modular workflows,   │ Enterprise pricing model,        │
│                 │                      │ "Identity as Code",  │ struggles with non-Latin scripts │
│                 │                      │ inspectable JSON.    │ and older laminated IDs.         │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Stripe Identity │ Fast-moving Startups │ 3-minute setup,      │ Rigid customization, limited to  │
│                 │ & Marketplaces       │ prebuilt UI sheets,  │ Stripe ecosystem, no deep local  │
│                 │                      │ high-trust brand.    │ South Asian ID specialization.   │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Sumsub          │ Global Enterprise    │ Full KYC/AML engine, │ Complex setup, heavy UI,         │
│                 │ & Fintechs           │ passive liveness,    │ expensive for emerging-market    │
│                 │                      │ deepfake defense.    │ startups.                        │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Veriff          │ High-Volume Consumer │ Real-time camera AI, │ High cost per check in USD,      │
│                 │ Apps & Mobility      │ sub-second feedback, │ heavy bandwidth demands on       │
│                 │                      │ video liveness.      │ 3G/4G edge networks.             │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Shufti Pro      │ Emerging Markets     │ Bengali script OCR,  │ Outdated marketing UI, clunky    │
│                 │ & Regional Banks     │ Smart NID support,   │ sandbox, developer-unfriendly    │
│                 │                      │ BFIU compliance.     │ integration experience.          │
├─────────────────┼──────────────────────┼──────────────────────┼──────────────────────────────────┤
│ Linear / Resend │ Modern Developers    │ Monochromatic craft, │ N/A (Used as benchmark for visual│
│ / Supabase      │                      │ tactile interactions,│ aesthetics, terminal ergonomics, │
│                 │                      │ instant feedback.    │ and DX standards).               │
└─────────────────┴──────────────────────┴──────────────────────┴──────────────────────────────────┘
```

### Detailed Competitor Profiles

#### 1. Persona (`withpersona.com`)
- **Strengths:** Industry leader in developer experience. Treats identity verification as modular software rather than a rigid black box. Allows teams to configure verification logic visually and manage rules in code.
- **UX Insight:** Developers love seeing the exact decision tree and inspecting every field payload in real time.
- **Vulnerability:** Highly optimized for North America and Europe; lacks specialized models for complex South Asian document variations.

#### 2. Stripe Identity (`stripe.com/identity`)
- **Strengths:** Unrivaled integration speed. Developers can drop a pre-built modal (`IdentityVerificationSheet`) into iOS, Android, or Web in an afternoon.
- **UX Insight:** High conversion comes from extreme reduction of user steps and seamless handoff to mobile via QR/SMS.
- **Vulnerability:** "One size fits all" approach. Does not handle older paper-laminated documents or Bengali phonetic transliteration.

#### 3. Sumsub (`sumsub.com`)
- **Strengths:** Comprehensive compliance stack (KYC, KYB, AML, transaction monitoring). Strong passive liveness and anti-deepfake capabilities.
- **UX Insight:** Enterprise buyers require audit-ready PDF/JSON certificates and clear evidence logs.
- **Vulnerability:** Interface feels dense and overwhelming for developers who simply want fast, high-accuracy verification.

#### 4. Shufti Pro (`shuftipro.com`)
- **Strengths:** Strong localization in South Asia; handles Smart NIDs and regulatory alignments with Bangladesh Bank (BB) and BFIU.
- **UX Insight:** Local compliance is a non-negotiable hard requirement for regional fintechs.
- **Vulnerability:** Dated visual identity, clunky developer documentation, and poor sandbox testing tooling.

---

## 3. User Pain Points & Friction Points

Research reveals four critical areas of failure in modern IDV applications:

```
                               CRITICAL USER & DEV FRICTION POINTS
  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
  │  63% Onboarding  │  Camera Capture  │ Script & Format  │   Developer DX   │
  │   Abandonment    │    Failures      │    Breakdowns    │     Dead Ends    │
  │                  │                  │                  │                  │
  │ Users drop off   │ Glare, blur,     │ Bengali ligature │ Complex auth,    │
  │ when flows take  │ low-light, and   │ errors and old   │ no instant demo, │
  │ > 60 seconds.    │ guilloché mesh.  │ laminated cards. │ cryptic errors.  │
  └──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

### 1. The 60-Second Drop-off Threshold
- Up to **63% of users abandon digital onboarding** if the ID verification process feels sluggish, confusing, or asks for redundant data.
- **Solution:** Passive verification (sub-second AI response), clear progress cues, and single-selfie liveness (no unnatural head turns).

### 2. Physical Document Hurdles (Emerging Markets)
- **Dual NID Formats:** Bangladesh utilizes both newer Smart NIDs (chip-embedded, clean typography) and older Laminated NIDs (irregular fonts, faded laminate, background guilloché patterns).
- **Camera Capture Degradation:** High glare from plastic laminate, shaky handheld capture, and low-light conditions cause standard global OCR engines to fail.
- **Solution:** Client-side pre-processing (real-time edge bounding, glare detection, automatic cropping before upload).

### 3. Script & Transliteration Disconnect
- Government records frequently write names in Bengali script (e.g., `"মোহাম্মদ রহিম"`), while banking and merchant systems use English (e.g., `"Mohammad Rahim"` vs. `"Md. Rahim"`).
- Global IDV tools flag these as identity mismatches.
- **Solution:** Built-in phonetic NLP translation and fuzzy transliteration matching.

### 4. Developer Integration Dead Ends
- Developers waste hours debugging obscure error codes (`Error 400: Bad Request`) without actionable diagnostics.
- Legacy portals force developers to create accounts, wait for sales approval, and generate API keys before seeing a single working payload.
- **Solution:** Instant in-browser hero sandbox + copyable SDKs in 5 languages + descriptive error schemas.

---

## 4. Key Discovery Takeaways & Strategic Opportunities

1. **Sell Full-Stack Identity, Not Isolated Endpoints:** Customers don't want to wire together 5 separate APIs (OCR + Liveness + Match + Translation + Gender). They want a unified, intelligent identity engine.
2. **First Use = First Win (Stripe / Supabase standard):** The marketing site itself must let developers interact with real AI outputs in under 3 seconds.
3. **Regional Champion + Global Standards:** Deliver the speed, compliance, and OCR accuracy tailored for South Asian emerging markets, wrapped in a world-class, Linear-grade developer interface.
