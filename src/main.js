import './style.css'

/* ─────────────────────────────────────────────────────────────
   ADEPT-SENSE 2.0 INTERACTION ENGINE (Step 4 High-Fidelity)
   ───────────────────────────────────────────────────────────── */

// ── 1. MODERN NAVBAR ENGINE & MOBILE DRAWER ──
const siteHeader = document.getElementById('site-header')
const hamburger = document.getElementById('nav-hamburger')
const mobileMenu = document.getElementById('mobile-menu')
const mobileBackdrop = document.getElementById('mobile-menu-backdrop')

// Header scroll state
const handleScroll = () => {
  if (!siteHeader) return
  if (window.scrollY > 20) {
    siteHeader.classList.add('scrolled')
  } else {
    siteHeader.classList.remove('scrolled')
  }
}
window.addEventListener('scroll', handleScroll, { passive: true })
handleScroll()

// Mobile menu toggle
const toggleMobileMenu = (open) => {
  const shouldOpen = open !== undefined ? open : !mobileMenu?.classList.contains('open')
  if (mobileMenu && hamburger && mobileBackdrop) {
    mobileMenu.classList.toggle('open', shouldOpen)
    mobileBackdrop.classList.toggle('open', shouldOpen)
    hamburger.classList.toggle('active', shouldOpen)
    hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false')
    document.body.style.overflow = shouldOpen ? 'hidden' : ''
  }
}

if (hamburger) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleMobileMenu()
  })
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false))
}

// Close mobile menu on Esc key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    toggleMobileMenu(false)
  }
})

// Close mobile menu when clicking any nav link
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => toggleMobileMenu(false))
})

// Active link highlighting on scroll (Scrollspy)
const sections = document.querySelectorAll('section[id]')
const navDesktopLinks = document.querySelectorAll('.nav-links .nav-link')
const updateActiveNav = () => {
  const scrollPos = window.scrollY + 100
  sections.forEach((sec) => {
    const top = sec.offsetTop
    const height = sec.offsetHeight
    const id = sec.getAttribute('id')
    if (scrollPos >= top && scrollPos < top + height) {
      navDesktopLinks.forEach((link) => {
        const href = link.getAttribute('href')
        if (href && (href.endsWith(`#${id}`) || href === `#${id}`)) {
          link.classList.add('active')
        } else if (href && !href.includes('#') && !href.includes('pricing') && !href.includes('docs')) {
          link.classList.remove('active')
        } else {
          link.classList.remove('active')
        }
      })
    }
  })
}
window.addEventListener('scroll', updateActiveNav, { passive: true })

// ── 2. SCROLL REVEAL OBSERVER ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      revealObserver.unobserve(e.target)
    }
  })
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

// ── 3. HERO INTERACTIVE SCANNER & TELEMETRY ENGINE ──
const sampleDocs = {
  smart: {
    type: 'Smart NID (Bangladesh)',
    img: '/src/nid-sample-f.png',
    status: '200 OK',
    latency: '382ms',
    confidence: '99.8%',
    bboxes: [
      { top: '22%', left: '38%', width: '48%', height: '14%', tag: 'NAME: RAHIM' },
      { top: '48%', left: '38%', width: '56%', height: '15%', tag: 'NID: 19942610...' },
      { top: '68%', left: '38%', width: '38%', height: '14%', tag: 'DOB: 12-04-1994' }
    ],
    json: `<span class="json-cm">// AdeptSense AI-OCR Engine Response</span>
{
  <span class="json-k">"status"</span>: <span class="json-val">"VERIFIED"</span>,
  <span class="json-k">"latency_ms"</span>: <span class="json-acc">382</span>,
  <span class="json-k">"confidence_score"</span>: <span class="json-acc">0.998</span>,
  <span class="json-k">"document"</span>: {
    <span class="json-k">"type"</span>: <span class="json-str">"BD_SMART_NID"</span>,
    <span class="json-k">"nid_number"</span>: <span class="json-str">"8241094821"</span>,
    <span class="json-k">"name_en"</span>: <span class="json-str">"MOHAMMAD RAHIM"</span>,
    <span class="json-k">"name_bn"</span>: <span class="json-str">"মোহাম্মদ রহিম"</span>,
    <span class="json-k">"dob"</span>: <span class="json-str">"1994-04-12"</span>,
    <span class="json-k">"blood_group"</span>: <span class="json-str">"O+"</span>
  },
  <span class="json-k">"security_checks"</span>: {
    <span class="json-k">"tamper_detected"</span>: <span class="json-val">false</span>,
    <span class="json-k">"guilloche_pattern_valid"</span>: <span class="json-val">true</span>
  }
}`
  },
  laminated: {
    type: 'Laminated Paper NID',
    img: '/src/nid-sample-b.png',
    status: '200 OK',
    latency: '418ms',
    confidence: '98.9%',
    bboxes: [
      { top: '18%', left: '30%', width: '58%', height: '16%', tag: 'NAME_BN: সুমাইয়া' },
      { top: '42%', left: '30%', width: '60%', height: '16%', tag: 'NID: 19885409...' },
      { top: '65%', left: '30%', width: '42%', height: '14%', tag: 'ADDRESS_PARSED' }
    ],
    json: `<span class="json-cm">// Robust Laminated OCR & Transliteration</span>
{
  <span class="json-k">"status"</span>: <span class="json-val">"VERIFIED"</span>,
  <span class="json-k">"latency_ms"</span>: <span class="json-acc">418</span>,
  <span class="json-k">"confidence_score"</span>: <span class="json-acc">0.989</span>,
  <span class="json-k">"document"</span>: {
    <span class="json-k">"type"</span>: <span class="json-str">"BD_OLD_LAMINATED_NID"</span>,
    <span class="json-k">"nid_number"</span>: <span class="json-str">"198854092210"</span>,
    <span class="json-k">"name_bn"</span>: <span class="json-str">"সুমাইয়া রহমান"</span>,
    <span class="json-k">"transliterated_en"</span>: <span class="json-str">"SUMAIYA RAHMAN"</span>,
    <span class="json-k">"glare_normalized"</span>: <span class="json-val">true</span>
  },
  <span class="json-k">"security_checks"</span>: {
    <span class="json-k">"laminate_reflection_suppressed"</span>: <span class="json-val">true</span>,
    <span class="json-k">"edge_boundary_aligned"</span>: <span class="json-val">true</span>
  }
}`
  },
  passport: {
    type: 'e-Passport (ICAO 9303)',
    img: '/src/hero.png',
    status: '200 OK',
    latency: '340ms',
    confidence: '99.9%',
    bboxes: [
      { top: '15%', left: '20%', width: '65%', height: '20%', tag: 'ICAO_MRZ_ZONE' },
      { top: '45%', left: '20%', width: '50%', height: '15%', tag: 'PASS_NO: A092841' },
      { top: '65%', left: '20%', width: '40%', height: '14%', tag: 'NAT: BGD' }
    ],
    json: `<span class="json-cm">// ICAO 9303 Global Passport Parser</span>
{
  <span class="json-k">"status"</span>: <span class="json-val">"VERIFIED"</span>,
  <span class="json-k">"latency_ms"</span>: <span class="json-acc">340</span>,
  <span class="json-k">"confidence_score"</span>: <span class="json-acc">0.999</span>,
  <span class="json-k">"document"</span>: {
    <span class="json-k">"type"</span>: <span class="json-str">"ICAO_PASSPORT"</span>,
    <span class="json-k">"passport_number"</span>: <span class="json-str">"A09284192"</span>,
    <span class="json-k">"mrz_checksum"</span>: <span class="json-val">true</span>,
    <span class="json-k">"issuing_country"</span>: <span class="json-str">"BGD"</span>,
    <span class="json-k">"expiry_date"</span>: <span class="json-str">"2031-11-20"</span>
  }
}`
  }
}

function initHeroScanner() {
  const tabs = document.querySelectorAll('.console-tab')
  const docImg = document.getElementById('hero-doc-img')
  const jsonView = document.getElementById('hero-json-output')
  const bboxesWrap = document.getElementById('hero-bboxes')
  const statusLatency = document.getElementById('hero-status-latency')
  const statusMatch = document.getElementById('hero-status-match')
  const badgeTelemetry = document.getElementById('hero-badge-telemetry')

  if (!tabs.length || !docImg || !jsonView || !bboxesWrap) return

  function renderSample(sampleKey) {
    const data = sampleDocs[sampleKey] || sampleDocs.smart

    // Update Doc Image
    docImg.src = data.img
    docImg.alt = data.type

    // Render Bounding Boxes
    bboxesWrap.innerHTML = data.bboxes.map(b => `
      <div class="bbox" style="top:${b.top}; left:${b.left}; width:${b.width}; height:${b.height};">
        <span class="bbox-tag">${b.tag}</span>
      </div>
    `).join('')

    // Render JSON with smooth transition
    jsonView.innerHTML = data.json

    // Update Telemetry
    if (statusLatency) statusLatency.textContent = data.latency
    if (statusMatch) statusMatch.textContent = data.confidence
    if (badgeTelemetry) badgeTelemetry.textContent = `${data.status} · ${data.latency}`
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      const sampleKey = tab.dataset.sample || 'smart'
      renderSample(sampleKey)
    })
  })

  // Initial render
  renderSample('smart')
}

// ── 4. DEVELOPER SUITE: MULTI-LANGUAGE CODE SWITCHER ──
const codeSnippets = {
  curl: `curl -X POST https://api.spectre.id/v1/identity/verify \\
  -H "Authorization: Bearer $SPECTRE_API_KEY" \\
  -F "document=@nid-front.jpg" \\
  -F "selfie=@user-selfie.jpg" \\
  -F "workflow=fintech_fast_pass"`,

  node: `import { Spectre } from '@spectre/sdk';

const client = new Spectre({ apiKey: process.env.SPECTRE_KEY });

const result = await client.identity.verify({
  document: './nid-front.jpg',
  selfie: './user-selfie.jpg',
  workflow: 'fintech_fast_pass'
});

console.log(result.status, result.confidence); // "VERIFIED", 0.998`,

  python: `from spectre import Spectre
import os

client = Spectre(api_key=os.getenv("SPECTRE_KEY"))

verification = client.identity.verify(
    document="./nid-front.jpg",
    selfie="./user-selfie.jpg",
    workflow="fintech_fast_pass"
)

print(verification.status, verification.confidence) # VERIFIED 0.998`,

  go: `package main

import (
    "context"
    "fmt"
    "os"
    "github.com/spectre/spectre-go"
)

func main() {
    client := spectre.NewClient(os.Getenv("SPECTRE_KEY"))
    res, _ := client.Identity.Verify(context.Background(), &spectre.VerifyParams{
        Document: "./nid-front.jpg",
        Selfie:   "./user-selfie.jpg",
        Workflow: "fintech_fast_pass",
    })
    fmt.Println(res.Status, res.Confidence) // VERIFIED 0.998
}`,

  php: `<?php
require_once 'vendor/autoload.php';

$client = new \\Spectre\\Client(getenv('SPECTRE_KEY'));

$verification = $client->identity->verify([
    'document' => './nid-front.jpg',
    'selfie'   => './user-selfie.jpg',
    'workflow' => 'fintech_fast_pass'
]);

echo $verification->status . ': ' . $verification->confidence;`
}

function initCodeSwitcher() {
  const tabs = document.querySelectorAll('.dev-lang-tab')
  const codeBlock = document.getElementById('dev-code-display')
  const copyBtn = document.getElementById('dev-copy-btn')

  if (!tabs.length || !codeBlock) return

  let currentLang = 'curl'

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      currentLang = tab.dataset.lang || 'curl'
      codeBlock.textContent = codeSnippets[currentLang] || codeSnippets.curl
    })
  })

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = codeSnippets[currentLang] || codeBlock.textContent
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerHTML
        copyBtn.innerHTML = `✓ Copied`
        setTimeout(() => {
          copyBtn.innerHTML = originalText
        }, 2000)
      })
    })
  }
}

// ── 5. INTERACTIVE ROI & VOLUME PRICING CALCULATOR ──
function initPricingCalculator() {
  const slider = document.getElementById('pricing-volume-slider')
  const volDisplay = document.getElementById('pricing-vol-display')
  const costTotal = document.getElementById('pricing-cost-total')
  const unitRate = document.getElementById('pricing-unit-rate')
  const currBtns = document.querySelectorAll('.calc-currency-btn')

  if (!slider || !volDisplay || !costTotal || !unitRate) return

  let currentCurrency = 'BDT' // 'BDT' or 'USD'

  const rates = {
    BDT: { symbol: '৳', baseRate: 5.0, minRate: 2.8 },
    USD: { symbol: '$', baseRate: 0.045, minRate: 0.025 }
  }

  function compute() {
    const volume = parseInt(slider.value, 10)
    volDisplay.textContent = volume.toLocaleString() + ' checks / mo'

    // Tier volume discount factor (smooth logarithmic decay)
    const factor = Math.max(0.6, 1 - (volume / 250000) * 0.4)
    const activeRate = rates[currentCurrency]
    const effectiveUnitRate = Math.max(activeRate.minRate, activeRate.baseRate * factor)
    const totalCost = volume * effectiveUnitRate

    if (currentCurrency === 'BDT') {
      costTotal.textContent = `৳ ${Math.round(totalCost).toLocaleString()}`
      unitRate.textContent = `৳ ${effectiveUnitRate.toFixed(2)} per verification`
    } else {
      costTotal.textContent = `$ ${Math.round(totalCost).toLocaleString()}`
      unitRate.textContent = `$ ${effectiveUnitRate.toFixed(3)} per verification`
    }
  }

  currBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentCurrency = btn.dataset.curr || 'BDT'
      compute()
    })
  })

  slider.addEventListener('input', compute)
  compute()
}

// ── 6. 1-CLICK CLI BADGE COPY ──
function initCliBadge() {
  const copyBtn = document.getElementById('cli-copy-btn')
  if (!copyBtn) return

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('npm i @spectre/sdk').then(() => {
      const original = copyBtn.innerHTML
      copyBtn.innerHTML = '✓'
      setTimeout(() => {
        copyBtn.innerHTML = original
      }, 2000)
    })
  })
}

// ── 7. SCOREBOARD FLIP LOGO ENGINE (SLOW MECHANICAL FLIP ONE BY ONE) ──
const scoreboardSets = [
  // Set 0 (Fintech & Banking Pioneers)
  [
    {
      name: 'bKash',
      svg: `<svg viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="bKash"><path d="M16 4L26 14L16 24L12 20L18 14L12 8L16 4Z" fill="currentColor"/><path d="M8 8L14 14L8 20L4 16L7.5 14L4 12L8 8Z" fill="currentColor" opacity="0.7"/><text x="34" y="23" font-family="'Inter', sans-serif" font-weight="700" font-size="19" letter-spacing="-0.02em" fill="currentColor">bKash</text></svg>`
    },
    {
      name: 'Nagad',
      svg: `<svg viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nagad"><circle cx="14" cy="17" r="11" stroke="currentColor" stroke-width="2.2"/><path d="M14 10V24M9 15L19 19M19 15L9 19" stroke="currentColor" stroke-width="2"/><text x="32" y="23" font-family="'Inter', sans-serif" font-weight="600" font-size="19" letter-spacing="-0.01em" fill="currentColor">nagad</text></svg>`
    },
    {
      name: 'BRAC Bank',
      svg: `<svg viewBox="0 0 140 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BRAC Bank"><rect x="3" y="6" width="8" height="8" rx="1.5" fill="currentColor"/><rect x="14" y="6" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6"/><rect x="3" y="17" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6"/><rect x="14" y="17" width="8" height="8" rx="1.5" fill="currentColor"/><text x="29" y="22" font-family="'Inter', sans-serif" font-weight="800" font-size="15" letter-spacing="0.04em" fill="currentColor">BRAC BANK</text></svg>`
    },
    {
      name: 'Pathao',
      svg: `<svg viewBox="0 0 125 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Pathao"><path d="M4 6H15C19 6 22 9 22 13C22 17 19 20 15 20H9V26H4V6Z" fill="currentColor"/><path d="M9 10V16H14.5C15.8 16 17 14.8 17 13C17 11.2 15.8 10 14.5 10H9Z" fill="var(--surface)"/><text x="30" y="22" font-family="'Inter', sans-serif" font-weight="800" font-size="16.5" letter-spacing="0.02em" fill="currentColor">PATHAO</text></svg>`
    },
    {
      name: 'City Bank',
      svg: `<svg viewBox="0 0 135 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="City Bank"><polygon points="14,5 17,12 24,13 19,18 20.5,25 14,21 7.5,25 9,18 4,13 11,12" fill="currentColor"/><text x="32" y="22" font-family="'Inter', sans-serif" font-weight="700" font-size="15" letter-spacing="0.04em" fill="currentColor">CITY BANK</text></svg>`
    },
    {
      name: 'Dutch-Bangla Bank',
      svg: `<svg viewBox="0 0 135 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dutch-Bangla Bank"><circle cx="14" cy="17" r="10" fill="currentColor"/><circle cx="14" cy="17" r="4.5" fill="var(--bg, #FAFAFA)"/><text x="32" y="23" font-family="'Inter', sans-serif" font-weight="800" font-size="16" letter-spacing="0.04em" fill="currentColor">DBBL</text></svg>`
    }
  ],
  // Set 1 (Commerce & Enterprise Leaders)
  [
    {
      name: 'ShopUp',
      svg: `<svg viewBox="0 0 125 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ShopUp"><path d="M5 9H21L19.5 25H6.5L5 9Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M10 9V7C10 5 11.5 3.5 13 3.5C14.5 3.5 16 5 16 7V9" stroke="currentColor" stroke-width="2.2"/><text x="29" y="23" font-family="'Inter', sans-serif" font-weight="700" font-size="18" letter-spacing="-0.02em" fill="currentColor">Shop<tspan font-weight="400">Up</tspan></text></svg>`
    },
    {
      name: 'Chaldal',
      svg: `<svg viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Chaldal"><path d="M14 5C8 9 6 16 14 25C22 16 20 9 14 5Z" fill="currentColor"/><path d="M14 8V22" stroke="var(--surface)" stroke-width="2"/><text x="28" y="23" font-family="'Inter', sans-serif" font-weight="700" font-size="18" letter-spacing="-0.01em" fill="currentColor">chaldal</text></svg>`
    },
    {
      name: 'Daraz',
      svg: `<svg viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Daraz"><path d="M14 4L23 10V22L14 28L5 22V10L14 4Z" stroke="currentColor" stroke-width="2.2"/><path d="M14 4V28M5 10L23 22M23 10L5 22" stroke="currentColor" stroke-width="1.3"/><text x="32" y="23" font-family="'Inter', sans-serif" font-weight="800" font-size="18" letter-spacing="-0.03em" fill="currentColor">daraz</text></svg>`
    },
    {
      name: 'Upay',
      svg: `<svg viewBox="0 0 115 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Upay"><path d="M6 10V17C6 21 9 24 13 24C17 24 20 21 20 17V10" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M15 15L19 19L26 10" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="33" y="23" font-family="'Inter', sans-serif" font-weight="700" font-size="18" letter-spacing="-0.02em" fill="currentColor">upay</text></svg>`
    },
    {
      name: 'Arogga',
      svg: `<svg viewBox="0 0 125 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Arogga"><rect x="4" y="6" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2.2"/><path d="M13 9V21M7 15H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><text x="30" y="23" font-family="'Inter', sans-serif" font-weight="600" font-size="18" letter-spacing="-0.01em" fill="currentColor">arogga</text></svg>`
    },
    {
      name: 'Grameenphone',
      svg: `<svg viewBox="0 0 140 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Grameenphone"><circle cx="14" cy="17" r="11" stroke="currentColor" stroke-width="2.4"/><path d="M14 6V17L22 22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><text x="32" y="23" font-family="'Inter', sans-serif" font-weight="700" font-size="15" letter-spacing="0.02em" fill="currentColor">Grameen<tspan font-weight="400">phone</tspan></text></svg>`
    }
  ],
  // Set 2 (Logistics & Financial Infrastructure)
  [
    {
      name: 'Paperfly',
      svg: `<svg viewBox="0 0 130 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Paperfly"><path d="M4 16L24 6L16 26L12 18L4 16Z" fill="currentColor"/><text x="32" y="22" font-family="'Inter', sans-serif" font-weight="700" font-size="17" letter-spacing="-0.01em" fill="currentColor">paperfly</text></svg>`
    },
    {
      name: 'Sheba.xyz',
      svg: `<svg viewBox="0 0 135 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Sheba.xyz"><path d="M13 5L22 11V21L13 27L4 21V11L13 5Z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="13" cy="16" r="4" fill="currentColor"/><text x="30" y="22" font-family="'Inter', sans-serif" font-weight="700" font-size="16.5" letter-spacing="-0.01em" fill="currentColor">sheba<tspan font-weight="400">.xyz</tspan></text></svg>`
    },
    {
      name: 'Eastern Bank',
      svg: `<svg viewBox="0 0 145 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Eastern Bank"><path d="M5 8L15 4L22 12L15 20L5 16V8Z" fill="currentColor"/><circle cx="14" cy="12" r="3" fill="var(--surface)"/><text x="29" y="22" font-family="'Inter', sans-serif" font-weight="800" font-size="14.5" letter-spacing="0.04em" fill="currentColor">EASTERN BANK</text></svg>`
    },
    {
      name: 'Prime Bank',
      svg: `<svg viewBox="0 0 140 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Prime Bank"><polygon points="14,5 24,23 4,23" stroke="currentColor" stroke-width="2.2" fill="none"/><polygon points="14,12 19,21 9,21" fill="currentColor"/><text x="30" y="22" font-family="'Inter', sans-serif" font-weight="800" font-size="14.5" letter-spacing="0.04em" fill="currentColor">PRIME BANK</text></svg>`
    },
    {
      name: 'Shurjopay',
      svg: `<svg viewBox="0 0 135 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shurjopay"><circle cx="14" cy="16" r="6" fill="currentColor"/><path d="M14 4V7M14 25V28M2 16H5M23 16H26M5.5 7.5L7.5 9.5M20.5 22.5L22.5 24.5M5.5 24.5L7.5 22.5M20.5 9.5L22.5 7.5" stroke="currentColor" stroke-width="2"/><text x="32" y="22" font-family="'Inter', sans-serif" font-weight="700" font-size="17" letter-spacing="-0.02em" fill="currentColor">shurjopay</text></svg>`
    },
    {
      name: 'Standard Chartered',
      svg: `<svg viewBox="0 0 145 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Standard Chartered"><path d="M6 17C6 10 12 6 18 6L14 17L18 28C12 28 6 24 6 17Z" fill="currentColor"/><path d="M15 17C15 12 19 9 24 9L20 17L24 25C19 25 15 22 15 17Z" fill="currentColor" opacity="0.6"/><text x="30" y="22" font-family="'Inter', sans-serif" font-weight="800" font-size="13" letter-spacing="0.05em" fill="currentColor">STANDARD CHARTERED</text></svg>`
    }
  ]
]

function initScoreboard() {
  const container = document.getElementById('trust-scoreboard')
  if (!container) return

  const cards = container.querySelectorAll('.scoreboard-card')
  const totalSlots = cards.length
  if (totalSlots === 0) return

  // Track the brand set index for each individual slot
  const slotSetIndices = new Array(totalSlots).fill(0)
  let currentSlotToFlip = 0
  let timer = null
  let isPaused = false

  function flipSingleSlot(slotIdx) {
    const card = cards[slotIdx]
    if (!card) return

    slotSetIndices[slotIdx] = (slotSetIndices[slotIdx] + 1) % scoreboardSets.length
    const nextSetIdx = slotSetIndices[slotIdx]
    const nextBrand = scoreboardSets[nextSetIdx][slotIdx]
    if (!nextBrand) return

    // Slower, smooth mechanical flip
    card.classList.add('flip-out')

    setTimeout(() => {
      card.innerHTML = nextBrand.svg
      const slot = card.closest('.scoreboard-slot')
      if (slot) slot.setAttribute('title', nextBrand.name)

      card.classList.remove('flip-out')
      card.classList.add('flip-prep')

      void card.offsetWidth

      card.classList.remove('flip-prep')
    }, 380)
  }

  function advanceNextSlot() {
    if (isPaused) return
    flipSingleSlot(currentSlotToFlip)
    currentSlotToFlip = (currentSlotToFlip + 1) % totalSlots
  }

  function startTimer() {
    if (timer) clearInterval(timer)
    // Slower pacing: one logo flips at a time every 2.6 seconds
    timer = setInterval(advanceNextSlot, 2600)
  }

  container.addEventListener('mouseenter', () => {
    isPaused = true
  })
  container.addEventListener('mouseleave', () => {
    isPaused = false
  })

  startTimer()
}

// ── 8. HERO PRODUCT SHOWCASE CAROUSEL (5 SLIDES: 3 VISIBLE, 2 HIDDEN, CENTER ACTIVE) ──
function initHeroShowcase() {
  const container = document.getElementById('hero-showcase')
  if (!container) return

  const trackOuter = container.querySelector('.showcase-track-outer')
  const track = document.getElementById('showcase-track')
  if (!trackOuter || !track) return

  const originalSlides = Array.from(track.querySelectorAll('.showcase-slide'))
  const total = originalSlides.length
  if (total !== 5) return

  // Prepend clones so left-neighbor peeks smoothly when activeIndex is 0
  ;[...originalSlides].reverse().forEach(slide => {
    const clone = slide.cloneNode(true)
    clone.classList.add('is-clone')
    clone.setAttribute('aria-hidden', 'true')
    track.prepend(clone)
  })

  // Append clones so right-neighbor peeks smoothly when activeIndex is 4
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true)
    clone.classList.add('is-clone')
    clone.setAttribute('aria-hidden', 'true')
    track.appendChild(clone)
  })

  // Track now has: [5 prepended clones] [5 real slides] [5 appended clones]
  const allSlides = Array.from(track.querySelectorAll('.showcase-slide'))
  let currentIndex = total // Starts at real slide 0 (index 5)
  let timer = null
  let isPaused = false
  let isAnimating = false
  let animationTimeout = null

  // Drag-to-slide states
  let isPointerDown = false
  let isDragging = false
  let startX = 0
  let currentX = 0
  let dragDelta = 0
  let dragStartTime = 0

  function getDimensions() {
    const viewportWidth = trackOuter.clientWidth || window.innerWidth
    const maxContainerWidth = 1200
    const gutter = viewportWidth < 768 ? 32 : (viewportWidth < 1024 ? 48 : 80)
    const slideWidth = Math.min(maxContainerWidth, viewportWidth - gutter)

    // Inactive slides scale in CSS (0.90)
    const scale = 0.90
    const desiredGap = 24 // Visual gap between active and passive slides is set to 24px

    // Step is distance between slide centers ensuring exact 24px gap between active and neighbor cards
    const activeHalf = slideWidth / 2
    const inactiveHalf = (slideWidth * scale) / 2
    const step = Math.round(activeHalf + desiredGap + inactiveHalf)

    // Compensate scale shrinkage so slides come close with exactly 24px visual gap
    const marginPerSide = Math.round((step - slideWidth - desiredGap) / 2)

    allSlides.forEach(s => {
      s.style.width = `${slideWidth}px`
      s.style.marginLeft = `${marginPerSide}px`
      s.style.marginRight = `${marginPerSide}px`
    })

    return { viewportWidth, slideWidth, step }
  }

  function getOffset(idx) {
    const { viewportWidth, slideWidth, step } = getDimensions()
    return Math.round(idx * step - (viewportWidth - slideWidth) / 2)
  }

  function updateActiveClasses(targetIdx) {
    allSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === targetIdx)
    })
  }

  // Instantaneous teleportation with ZERO visual blink (transitions suppressed)
  function silentSnapTo(idx) {
    currentIndex = idx
    isAnimating = false
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }

    updateActiveClasses(currentIndex)
    track.classList.add('is-snapping')
    track.style.transition = 'none'

    const offset = getOffset(currentIndex)
    track.style.transform = `translate3d(${-offset}px, 0, 0)`

    // Force browser reflow to commit transform immediately
    void track.offsetHeight

    requestAnimationFrame(() => {
      track.classList.remove('is-snapping')
      track.style.transition = ''
    })
  }

  function goTo(idx, animate = true) {
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }

    if (!animate) {
      silentSnapTo(idx)
      return
    }

    currentIndex = idx
    updateActiveClasses(currentIndex)
    isAnimating = true

    track.classList.remove('is-snapping')
    track.style.transition = 'transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)'

    const offset = getOffset(currentIndex)
    track.style.transform = `translate3d(${-offset}px, 0, 0)`

    // Failsafe timeout in case browser drops or throttles transitionend (e.g. background tab or scroll)
    animationTimeout = setTimeout(() => {
      onTransitionEnd()
    }, 760)
  }

  function onTransitionEnd() {
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
    isAnimating = false

    if (isDragging || isPointerDown) return

    // Seamless loop: if we landed on an appended clone, jump to corresponding real slide
    if (currentIndex >= total * 2) {
      silentSnapTo(currentIndex - total)
    }
    // If we landed on a prepended clone, jump to corresponding real slide
    else if (currentIndex < total) {
      silentSnapTo(currentIndex + total)
    }
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target !== track || e.propertyName !== 'transform') return
    onTransitionEnd()
  })

  function advance() {
    if (isPaused || isDragging || isPointerDown || isAnimating) return

    // Self-healing bound check: NEVER let currentIndex drift out of bounds!
    if (currentIndex >= total * 2) {
      silentSnapTo(currentIndex - total)
    } else if (currentIndex < total) {
      silentSnapTo(currentIndex + total)
    }

    goTo(currentIndex + 1, true)
  }

  function startTimer() {
    if (timer) clearInterval(timer)
    timer = setInterval(advance, 5000)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // ── DRAG TO SLIDE INTERACTION (MOUSE & TOUCH) ──
  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return
    isPointerDown = true
    isDragging = false
    startX = e.clientX
    currentX = e.clientX
    dragDelta = 0
    dragStartTime = Date.now()

    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
    isAnimating = false

    trackOuter.classList.add('is-dragging')
    track.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isPointerDown) return
    currentX = e.clientX
    dragDelta = currentX - startX

    if (!isDragging && Math.abs(dragDelta) > 6) {
      isDragging = true
      stopTimer()
    }

    if (isDragging) {
      track.style.transition = 'none'
      const baseOffset = getOffset(currentIndex)
      track.style.transform = `translate3d(${-(baseOffset - dragDelta)}px, 0, 0)`
    }
  }

  function onPointerUp(e) {
    if (!isPointerDown) return
    isPointerDown = false
    trackOuter.classList.remove('is-dragging')

    try {
      track.releasePointerCapture(e.pointerId)
    } catch (_) {}

    if (isDragging) {
      const duration = Date.now() - dragStartTime
      const velocity = Math.abs(dragDelta) / (duration || 1)
      const threshold = 60

      if (dragDelta < -threshold || (dragDelta < -20 && velocity > 0.35)) {
        goTo(currentIndex + 1, true)
      } else if (dragDelta > threshold || (dragDelta > 20 && velocity > 0.35)) {
        goTo(currentIndex - 1, true)
      } else {
        goTo(currentIndex, true)
      }

      setTimeout(() => {
        isDragging = false
      }, 50)

      startTimer()
    }
  }

  track.addEventListener('pointerdown', onPointerDown)
  track.addEventListener('pointermove', onPointerMove)
  track.addEventListener('pointerup', onPointerUp)
  track.addEventListener('pointercancel', onPointerUp)

  // Allow clicking any visible slide / clone to activate it (if not dragging)
  allSlides.forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      if (isDragging || Math.abs(dragDelta) > 6) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (idx !== currentIndex) {
        goTo(idx, true)
        startTimer()
      }
    })
  })

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    if (!isDragging) isPaused = true
  })
  container.addEventListener('mouseleave', () => {
    if (!isDragging) isPaused = false
  })

  // Tab Visibility Protection (Prevents desync / infinite running in background tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true
      stopTimer()
    } else {
      isPaused = false
      if (currentIndex >= total * 2) {
        silentSnapTo(currentIndex - total)
      } else if (currentIndex < total) {
        silentSnapTo(currentIndex + total)
      }
      startTimer()
    }
  })

  // Resize handler
  window.addEventListener('resize', () => {
    if (currentIndex >= total * 2) {
      currentIndex = currentIndex - total
    } else if (currentIndex < total) {
      currentIndex = currentIndex + total
    }
    goTo(currentIndex, false)
  })

  // Init
  silentSnapTo(total)
  startTimer()
}

// ── DOM READY INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  initHeroScanner()
  initCodeSwitcher()
  initPricingCalculator()
  initCliBadge()
  initScoreboard()
  initHeroShowcase()
})

