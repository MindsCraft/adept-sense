import './style.css'

// ── NAV SCROLL (glassmorphism — no state change needed) ──
// The glass nav is always visible; no opaque toggle required

// ── MOBILE NAV ──
const hamburger = document.getElementById('nav-hamburger')
const navLinks = document.querySelector('.nav-links')
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open')
    hamburger.classList.toggle('active')
  })
}

// ── NAV DROPDOWNS (Services) ──
// Modern pattern: CSS handles the hover-open via the ::before bridge.
// JS manages click toggle, outside-click close, ESC close, and a small
// close-grace so the cursor can travel from trigger to panel without
// losing the menu.
function initNavDropdowns() {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'))
  if (!dropdowns.length) return

  const isDesktop = () => window.matchMedia('(min-width: 881px)').matches
  const graceTimers = new WeakMap()

  function open(dd) {
    if (graceTimers.has(dd)) {
      clearTimeout(graceTimers.get(dd))
      graceTimers.delete(dd)
    }
    dropdowns.forEach(other => {
      if (other !== dd) other.setAttribute('aria-expanded', 'false')
    })
    dd.setAttribute('aria-expanded', 'true')
  }

  function close(dd, { grace = false } = {}) {
    if (graceTimers.has(dd)) {
      clearTimeout(graceTimers.get(dd))
      graceTimers.delete(dd)
    }
    if (grace && isDesktop()) {
      const t = setTimeout(() => {
        dd.setAttribute('aria-expanded', 'false')
        graceTimers.delete(dd)
      }, 120)
      graceTimers.set(dd, t)
    } else {
      dd.setAttribute('aria-expanded', 'false')
    }
  }

  function closeAll() {
    dropdowns.forEach(dd => close(dd))
  }

  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown-trigger')
    if (!trigger) return
    dd.setAttribute('aria-expanded', 'false')

    // Click toggles (works on both desktop and touch)
    trigger.addEventListener('click', e => {
      e.stopPropagation()
      const isOpen = dd.getAttribute('aria-expanded') === 'true'
      isOpen ? close(dd) : open(dd)
    })

    // Hover open on desktop only — CSS handles the actual show/hide,
    // we just coordinate the open state and the close-grace window.
    dd.addEventListener('mouseenter', () => {
      if (!isDesktop()) return
      open(dd)
    })
    dd.addEventListener('mouseleave', () => {
      if (!isDesktop()) return
      close(dd, { grace: true })
    })
  })

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) closeAll()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll()
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavDropdowns)
} else {
  initNavDropdowns()
}

// ── REVEAL ON SCROLL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      observer.unobserve(e.target)
    }
  })
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

// ── STAT COUNTER ANIMATION ──
// Animate [data-count] elements from 0 → target when they scroll into view.
// Honors a single decimal place (e.g. "99.4") and an optional [data-suffix] ("%", "+", "M+").
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return
    const el = e.target
    const target = parseFloat(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    if (Number.isNaN(target)) { statObserver.unobserve(el); return }
    const isFloat = String(el.dataset.count).includes('.')
    const duration = 1400
    const start = performance.now()
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const v = target * eased
      el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix
      if (t < 1) requestAnimationFrame(tick)
      else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix
    }
    requestAnimationFrame(tick)
    statObserver.unobserve(el)
  })
}, { threshold: 0.4 })

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el))

// ── INTERACTIVE PIPELINE PRICING CALCULATOR ──
function initPricingCalculator() {
  const epItems = document.querySelectorAll('.ep-item')
  const volSlider = document.getElementById('calc-vol-slider')
  const volNum = document.getElementById('calc-vol-num')
  const totalCostEl = document.getElementById('calc-total-cost')
  const unitRateEl = document.getElementById('calc-unit-rate')
  const jsonOutput = document.getElementById('calc-json-output')
  const discountBadge = document.getElementById('calc-discount-badge')
  const discText = document.getElementById('calc-disc-text')

  if (!epItems.length || !volSlider || !totalCostEl || !unitRateEl || !jsonOutput) return

  function updateCalculator() {
    let baseRate = 0
    let selectedKeys = []
    let totalCount = 0

    epItems.forEach(item => {
      if (item.classList.contains('selected')) {
        baseRate += parseFloat(item.dataset.price || '0')
        selectedKeys.push(item.dataset.id)
        totalCount++
      }
    })

    const volume = parseInt(volSlider.value, 10)
    if (volNum) volNum.textContent = volume.toLocaleString() + ' verifications'

    // Tier volume discount:
    let volMultiplier = 1.0
    if (volume > 50000) volMultiplier = 0.65
    else if (volume > 20000) volMultiplier = 0.80
    else if (volume > 5000) volMultiplier = 0.90

    // Multi-service bundle discount
    let bundleDiscount = (totalCount === 5) ? 0.75 : (totalCount >= 3 ? 0.88 : 1.0)
    
    // Preserve fixed layout without jumping
    if (discountBadge && discText) {
      if (totalCount >= 3) {
        discountBadge.classList.remove('hidden')
        discText.textContent = totalCount === 5 ? '-25% BUNDLE' : '-12% MULTI-SVC'
      } else {
        discountBadge.classList.add('hidden')
      }
    }

    const effectiveUnitRate = Math.max(0.01, baseRate * volMultiplier * bundleDiscount)
    const totalCost = volume * effectiveUnitRate

    totalCostEl.textContent = '$' + Math.round(totalCost).toLocaleString()
    unitRateEl.textContent = `Effective rate: $${effectiveUnitRate.toFixed(3)} / call`

    // Update JSON preview with exact design system syntax tokens
    const servicesStr = selectedKeys.length > 0 
      ? selectedKeys.map(k => `<span class="str">"${k}"</span>`).join(', ')
      : `<span class="cm">/* none */</span>`
    
    const slaTier = volume > 20000 ? "99.99% Enterprise Dedicated" : "99.9% Production"
    const totalStr = '$' + totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    jsonOutput.innerHTML = `<span class="cm">// Calculated API Contract</span>
{
  <span class="key">"services"</span>: [${servicesStr}],
  <span class="key">"volume"</span>: <span class="val">${volume}</span>,
  <span class="key">"unit_rate"</span>: <span class="str">"$${effectiveUnitRate.toFixed(3)}"</span>,
  <span class="key">"monthly_total"</span>: <span class="str">"${totalStr}"</span>,
  <span class="key">"sla_tier"</span>: <span class="str">"${slaTier}"</span>,
  <span class="key">"p50_latency"</span>: <span class="acc">"142ms"</span>
}`
  }

  epItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected')
      updateCalculator()
    })
  })

  volSlider.addEventListener('input', updateCalculator)
  updateCalculator()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricingCalculator)
} else {
  initPricingCalculator()
}


// ── HERO VISUAL SHOWCASE SWITCHER ──
const showcaseTabs = document.querySelectorAll('.showcase-tab')
const showcaseViews = document.querySelectorAll('.showcase-view')

showcaseTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.getAttribute('data-target')
    
    // Remove active classes from all tab buttons and view panels
    showcaseTabs.forEach(t => t.classList.remove('active'))
    showcaseViews.forEach(v => v.classList.remove('active'))
    
    // Add active classes to selected tab and panel
    tab.classList.add('active')
    const activeView = document.getElementById(targetId)
    if (activeView) {
      activeView.classList.add('active')
      
      // Tactile detail: Re-trigger radial SVG drawing check animation on tab activation
      if (targetId === 'view-live-timeline') {
        const ring = activeView.querySelector('.progress-ring-fill')
        if (ring) {
          ring.style.animation = 'none'
          ring.offsetHeight // force reflow trigger
          ring.style.animation = ''
        }
      }
      
      // Tactile detail: Re-trigger width-growing progress bar on tab activation
      if (targetId === 'view-bangla-ocr') {
        const fill = activeView.querySelector('.conf-fill')
        if (fill) {
          fill.style.animation = 'none'
          fill.offsetHeight // force reflow trigger
          fill.style.animation = ''
        }
      }
    }
  })
})

// ── VIDEO SHOWCASE CONTROLS & LIGHTBOX ──
function initVideoShowcase() {
  // Helper: Format time
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  // Setup generic video controls
  function setupVideoControls({
    video,
    playPauseBtn,
    overlay,
    timelineContainer,
    progressBar,
    currentTimeEl,
    durationEl,
    muteBtn,
    volumeSlider,
    playerWrapper,
  }) {
    if (!video) return;

    const playIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="play-icon" style="width:20px;height:20px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    const pauseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pause-icon" style="width:20px;height:20px;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    const volumeHighIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon" style="width:20px;height:20px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    const muteIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon" style="width:20px;height:20px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;

    let playPromise = null;

    function togglePlay() {
      if (video.paused) {
        playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { /* play interrupted — silent */ });
        }
      } else {
        if (playPromise) {
          playPromise.then(() => {
            video.pause();
          }).catch(() => {
            // Already paused or failed
          });
        } else {
          video.pause();
        }
      }
    }

    // Play/Pause actions
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (playerWrapper) {
      playerWrapper.addEventListener('click', (e) => {
        // Only toggle if clicking the video directly, not controls or inner elements
        if (e.target === video || e.target === overlay || e.target.closest('.play-btn-circle')) {
          togglePlay();
        }
      });
    }

    video.addEventListener('play', () => {
      if (playPauseBtn) playPauseBtn.innerHTML = pauseIcon;
      if (playerWrapper) playerWrapper.classList.add('playing');
    });

    video.addEventListener('pause', () => {
      if (playPauseBtn) playPauseBtn.innerHTML = playIcon;
      if (playerWrapper) playerWrapper.classList.remove('playing');
    });

    // Time & Progress Update
    video.addEventListener('timeupdate', () => {
      const pct = (video.currentTime / video.duration) * 100 || 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
    });

    video.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(video.duration);
    });

    // Handle initial state if metadata is already loaded
    if (video.duration && durationEl) {
      durationEl.textContent = formatTime(video.duration);
    }

    // Scrubber seeking
    if (timelineContainer) {
      timelineContainer.addEventListener('click', (e) => {
        const rect = timelineContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
      });
    }

    // Mute/Unmute
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        updateVolumeUI();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        video.volume = e.target.value;
        video.muted = (video.volume === 0);
        updateVolumeUI();
      });
    }

    function updateVolumeUI() {
      if (video.muted || video.volume === 0) {
        if (muteBtn) muteBtn.innerHTML = muteIcon;
        if (volumeSlider) volumeSlider.value = 0;
      } else {
        if (muteBtn) muteBtn.innerHTML = volumeHighIcon;
        if (volumeSlider) volumeSlider.value = video.volume;
      }
    }

    // Initial volume UI state
    updateVolumeUI();
  }

  // 1. Setup Inline Video controls
  const inlineVideo = document.getElementById('inline-showcase-video');
  const inlineWrapper = document.getElementById('inline-video-wrapper');
  
  if (inlineVideo) {
    setupVideoControls({
      video: inlineVideo,
      playPauseBtn: document.getElementById('inline-play-pause-btn'),
      overlay: document.getElementById('inline-video-play-overlay'),
      timelineContainer: document.getElementById('inline-timeline-container'),
      progressBar: document.getElementById('inline-progress-bar'),
      currentTimeEl: document.getElementById('inline-current-time'),
      durationEl: document.getElementById('inline-duration'),
      muteBtn: document.getElementById('inline-mute-btn'),
      volumeSlider: document.getElementById('inline-volume-slider'),
      playerWrapper: inlineWrapper,
    });
  }

  // 2. Setup Lightbox Video controls
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxModal = document.getElementById('video-lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const inlineExpandBtn = document.getElementById('inline-expand-btn');

  if (lightboxVideo) {
    setupVideoControls({
      video: lightboxVideo,
      playPauseBtn: document.getElementById('lightbox-play-pause-btn'),
      overlay: null, // no overlay on lightbox
      timelineContainer: document.getElementById('lightbox-timeline-container'),
      progressBar: document.getElementById('lightbox-progress-bar'),
      currentTimeEl: document.getElementById('lightbox-current-time'),
      durationEl: document.getElementById('lightbox-duration'),
      muteBtn: document.getElementById('lightbox-mute-btn'),
      volumeSlider: document.getElementById('lightbox-volume-slider'),
      playerWrapper: null,
    });
  }

  // Open/Close Lightbox
  function openLightbox(time = 0, playing = true) {
    if (!lightboxModal || !lightboxVideo) return;
    
    // Pause inline video if it's playing
    if (inlineVideo && !inlineVideo.paused) {
      inlineVideo.pause();
    }

    // Set lightbox video state
    lightboxVideo.currentTime = time;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // lock scroll

    if (playing) {
      // Unmute lightbox video and play
      lightboxVideo.muted = false;
      const playPromise = lightboxVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: if browser blocks loud autoplay, mute it and try playing again
          lightboxVideo.muted = true;
          lightboxVideo.play().catch(() => { /* muted autoplay blocked too — silent */ });
        });
      }
    }
  }

  function closeLightbox() {
    if (!lightboxModal || !lightboxVideo) return;
    
    lightboxVideo.pause();
    lightboxModal.classList.remove('active');
    document.body.style.overflow = ''; // unlock scroll
  }

  if (inlineExpandBtn) {
    inlineExpandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const time = inlineVideo ? inlineVideo.currentTime : 0;
      const playing = inlineVideo ? !inlineVideo.paused : true;
      openLightbox(time, playing);
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      // Close only if clicking outside content (on lightbox backdrop)
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoShowcase);
} else {
  initVideoShowcase();
}

/* ── USE CASES — Split Architectural Sandbox Deck with Auto-Slide ── */
function initUseCasesTabs() {
  const root = document.querySelector('.usecases-wrap')
  const tabsContainer = root ? root.querySelector('.uc-tabs') : null
  const tabs = Array.from(document.querySelectorAll('.uc-tab-btn'))
  const badgeEl = document.getElementById('uc-badge-text')
  const kickerEl = document.getElementById('uc-kicker-text')
  const titleEl = document.getElementById('uc-title-text')
  const descEl = document.getElementById('uc-desc-text')
  const statsRow = document.getElementById('uc-stats-row')
  const checklistEl = document.getElementById('uc-checklist')
  const stageBox = document.getElementById('uc-stage-box')
  const jsonPreview = document.getElementById('uc-json-preview')
  const autoLabel = document.getElementById('uc-auto-label')
  const prevBtn = document.getElementById('uc-prev-btn')
  const nextBtn = document.getElementById('uc-next-btn')
  const leftNarrative = document.querySelector('.uc-deck-left')

  if (!tabs.length || !titleEl || !descEl || !stageBox || !jsonPreview) return

  const keys = ['fintech', 'hr', 'healthcare', 'ecommerce', 'mobility', 'igaming']
  let currentIndex = 0
  let autoTimer = null
  let isPaused = false

  const verticalData = {
    fintech: {
      badge: "Production Live",
      kicker: "FINTECH & DIGITAL BANKING",
      title: "Onboard customers in sub-seconds <em>without KYC drop-off.</em>",
      desc: "Leading digital banks replace manual back-office queues with AdeptSense drop-in biometric verification. Smart card NID OCR, passive 3D liveness, and 1:1 facial matching execute seamlessly in one unified API session.",
      stats: [
        { val: "99.4%", lbl: "Field Precision", cls: "green" },
        { val: "~840ms", lbl: "p50 Pipeline", cls: "accent" },
        { val: "0 ops", lbl: "Manual Queue", cls: "" }
      ],
      bullets: [
        "Full compliance with Bangladesh Bank e-KYC guidelines out of the box.",
        "Idempotent session tokens with webhook + real-time polling fallback.",
        "Automatic PII encryption & configurable purge policies."
      ],
      stages: [
        { num: "01", title: "Smart NID Document Parser", sub: "Bangla OCR · 99.4% Field Match", tag: "PASSED", tagCls: "pass", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "1:1 Biometric Face Match", sub: "Vector Cosine: 0.994 score", tag: "99.4% MATCH", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "Passive 3D Liveness Check", sub: "iBeta Level 2 PAD Anti-Spoof", tag: "REAL PERSON", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// Verified Output Payload</span><br>{ <span class="key">"verified"</span>: <span class="val">true</span>, <span class="key">"risk_score"</span>: <span class="val">0.002</span>, <span class="key">"kyc_tier"</span>: <span class="str">"APPROVED_LEVEL_3"</span>, <span class="key">"signed_token"</span>: <span class="acc">"jwt_live_8f3a..."</span> }`
    },
    hr: {
      badge: "Workforce Day-1",
      kicker: "HR & CANDIDATE ONBOARDING",
      title: "Verify hundreds of new hires <em>before Day 1 orientation.</em>",
      desc: "Automate identity verification for distributed and on-site workforces. Candidates complete self-serve mobile verification, while HR receives real-time webhook status directly in Workday or BambooHR.",
      stats: [
        { val: "100%", lbl: "Audit Trail", cls: "green" },
        { val: "12.4s", lbl: "Avg Candidate Time", cls: "accent" },
        { val: "100k+", lbl: "Batch Capacity", cls: "" }
      ],
      bullets: [
        "Covers Bangladesh NID, passports, driver's licenses, and international IDs.",
        "Single signed CSV upload for bulk candidate batch invitations.",
        "PII auto-purged 30 days after verification compliance clearance."
      ],
      stages: [
        { num: "01", title: "Bulk Candidate CSV Dispatch", sub: "Auto SMS & Email Magic Link", tag: "QUEUED", tagCls: "info", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "Mobile Self-Service Capture", sub: "Candidate uploaded NID + selfie", tag: "RECEIVED", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "ATS Webhook Sync", sub: "Dispatched to Workday & HRIS", tag: "SYNCED", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// HR Candidate Verification Result</span><br>{ <span class="key">"candidate_id"</span>: <span class="str">"cand_9104"</span>, <span class="key">"nid_matched"</span>: <span class="val">true</span>, <span class="key">"ats_status"</span>: <span class="str">"CLEARED_FOR_HIRE"</span> }`
    },
    healthcare: {
      badge: "HIPAA Compliant",
      kicker: "HEALTHCARE & TELEMEDICINE",
      title: "Confirm patient identity <em>before prescriptions & claims.</em>",
      desc: "Hospitals and telehealth networks prevent insurance fraud and identity mix-ups before virtual doctor consultations. Multilingual OCR handles Bengali, English, and regional dialect IDs instantly.",
      stats: [
        { val: "100%", lbl: "HIPAA Aligned", cls: "green" },
        { val: "< 30s", lbl: "Pre-Visit Flow", cls: "accent" },
        { val: "0 PII", lbl: "Plaintext Logs", cls: "" }
      ],
      bullets: [
        "Zero camera permission friction — works smoothly inside mobile WebViews.",
        "High accuracy OCR on old laminated and new smart card NIDs.",
        "Secure encrypted patient tokens compatible with standard EMRs."
      ],
      stages: [
        { num: "01", title: "Pre-Visit SMS Identity Link", sub: "Sent 10m before consultation", tag: "OPENED", tagCls: "info", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "Patient NID OCR & Biometrics", sub: "Sub-second 3D liveness check", tag: "CONFIRMED", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "EMR Consultation Unlock", sub: "Prescription signing authorized", tag: "AUTHORIZED", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// Patient Consultation Clearance</span><br>{ <span class="key">"patient_verified"</span>: <span class="val">true</span>, <span class="key">"emr_record_match"</span>: <span class="str">"EMR_MATCH_CONFIRMED"</span> }`
    },
    ecommerce: {
      badge: "Trust & Safety",
      kicker: "E-COMMERCE & MARKETPLACES",
      title: "Build verified trust on <em>both sides of the transaction.</em>",
      desc: "Age-verify buyers in 3 seconds at checkout and authenticate high-volume marketplace merchants before issuing payment payouts. Increase buyer conversion with verified profile badges.",
      stats: [
        { val: "3.2s", lbl: "Avg Checkout Age-Gate", cls: "accent" },
        { val: "+18%", lbl: "Merchant Conversion", cls: "green" },
        { val: "Zero", lbl: "Payout Fraud", cls: "" }
      ],
      bullets: [
        "Age verification with minimal drop-off during checkout flow.",
        "Merchant KYC re-check before first bank transfer payout.",
        "Verified seller trust badge surfaced in customer chat."
      ],
      stages: [
        { num: "01", title: "Buyer 3s Age-Gate Overlay", sub: "Instant document age verification", tag: "VERIFIED 21+", tagCls: "pass", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "Seller Business NID Check", sub: "Cross-checked with trade license", tag: "AUTHENTICATED", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "Payout Gate Unlock", sub: "First bank payout unlocked", tag: "UNLOCKED", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// Marketplace Trust Status</span><br>{ <span class="key">"merchant_id"</span>: <span class="str">"m_8821"</span>, <span class="key">"payout_status"</span>: <span class="str">"CLEARED"</span>, <span class="key">"trust_badge"</span>: <span class="val">true</span> }`
    },
    mobility: {
      badge: "Driver Security",
      kicker: "RIDE-SHARING & MOBILITY",
      title: "Verify drivers &amp; couriers <em>before their first trip.</em>",
      desc: "Ride-sharing and delivery platforms verify driver identity, license numbers, and face biometrics at registration, then run random rolling selfie checks to prevent account sharing and impersonation.",
      stats: [
        { val: "99.8%", lbl: "Face Verification", cls: "green" },
        { val: "142ms", lbl: "Rolling Check", cls: "accent" },
        { val: "100%", lbl: "License Match", cls: "" }
      ],
      bullets: [
        "Instant parsing of Bangladesh Driving Licenses & Smart NIDs.",
        "Periodic random selfie check before going online.",
        "Passenger-visible 'Verified Driver' badge lifts booking trust."
      ],
      stages: [
        { num: "01", title: "Driver License & NID OCR", sub: "Validates expiration & category", tag: "VALIDATED", tagCls: "pass", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "Pre-Shift Facial Liveness", sub: "Driver selfie matched to profile", tag: "MATCH 99.8%", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "Online Dispatch Authorized", sub: "Driver enabled for trips", tag: "ONLINE READY", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// Driver Shift Auth Payload</span><br>{ <span class="key">"driver_id"</span>: <span class="str">"drv_447"</span>, <span class="key">"shift_authorized"</span>: <span class="val">true</span>, <span class="key">"liveness"</span>: <span class="val">0.992</span> }`
    },
    igaming: {
      badge: "Regulated Gate",
      kicker: "IGAMING & CRYPTO EXCHANGES",
      title: "Maintain regulatory compliance <em>without signup drop-off.</em>",
      desc: "Two-stage verification flow: a light 3-second age gate during initial registration that maximizes conversion, paired with a comprehensive biometric KYC check at first fiat withdrawal.",
      stats: [
        { val: "2-Stage", lbl: "Progressive KYC", cls: "accent" },
        { val: "100%", lbl: "Regulator Ready", cls: "green" },
        { val: "Audit Log", lbl: "Signed Receipts", cls: "" }
      ],
      bullets: [
        "Instant age-gate without overwhelming new users.",
        "Biometric verification with self-exclusion & sanctions screening.",
        "Cryptographically signed audit receipts for regulatory audits."
      ],
      stages: [
        { num: "01", title: "Registration Fast Age-Gate", sub: "Instant 3s date-of-birth check", tag: "CLEARED 18+", tagCls: "pass", iconBg: "rgba(121, 192, 255, 0.15)", iconColor: "var(--code-fn)" },
        { num: "02", title: "Full Tier-2 KYC at Withdrawal", sub: "NID OCR + 3D Liveness Vector", tag: "VERIFIED", tagCls: "pass", iconBg: "rgba(167, 139, 250, 0.15)", iconColor: "var(--code-acc)" },
        { num: "03", title: "Signed Audit Envelope", sub: "Immutable compliance receipt", tag: "SIGNED 200 OK", tagCls: "pass", iconBg: "rgba(86, 211, 100, 0.15)", iconColor: "var(--code-val)" }
      ],
      json: `<span class="cm">// Compliance Audit Receipt</span><br>{ <span class="key">"user_id"</span>: <span class="str">"usr_9981"</span>, <span class="key">"aml_status"</span>: <span class="str">"CLEAR"</span>, <span class="key">"withdrawal_authorized"</span>: <span class="val">true</span> }`
    }
  }

  function activate(index) {
    currentIndex = (index + keys.length) % keys.length
    const key = keys[currentIndex]
    const data = verticalData[key]
    if (!data) return

    tabs.forEach((t, i) => {
      const active = i === currentIndex
      t.classList.toggle('active', active)
      t.setAttribute('aria-selected', active ? 'true' : 'false')
      if (active && tabsContainer) {
        const scrollLeft = t.offsetLeft - (tabsContainer.clientWidth / 2) + (t.clientWidth / 2)
        tabsContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    })

    if (badgeEl) badgeEl.textContent = data.badge
    if (kickerEl) kickerEl.textContent = data.kicker
    titleEl.innerHTML = data.title
    descEl.textContent = data.desc

    if (statsRow) {
      statsRow.innerHTML = data.stats.map(s => `
        <div class="uc-stat-item">
          <span class="uc-stat-val ${s.cls}">${s.val}</span>
          <span class="uc-stat-lbl">${s.lbl}</span>
        </div>
      `).join('')
    }

    if (checklistEl) {
      checklistEl.innerHTML = data.bullets.map(b => `
        <li><span class="uc-checklist-ico">✓</span><span>${b}</span></li>
      `).join('')
    }

    if (stageBox) {
      stageBox.innerHTML = data.stages.map(st => `
        <div class="uc-pipeline-step">
          <div class="uc-psc-left">
            <div class="uc-psc-icon" style="background:${st.iconBg}; color:${st.iconColor};">${st.num}</div>
            <div>
              <div class="uc-psc-title">${st.title}</div>
              <div class="uc-psc-sub">${st.sub}</div>
            </div>
          </div>
          <span class="uc-psc-tag ${st.tagCls}">${st.tag}</span>
        </div>
      `).join('')
    }

    if (jsonPreview) {
      jsonPreview.innerHTML = data.json
    }

    // Micro-fade trigger
    if (leftNarrative) {
      leftNarrative.classList.remove('uc-anim-fade')
      void leftNarrative.offsetWidth
      leftNarrative.classList.add('uc-anim-fade')
    }
    if (stageBox) {
      stageBox.classList.remove('uc-anim-fade')
      void stageBox.offsetWidth
      stageBox.classList.add('uc-anim-fade')
    }

    restartTimer()
  }

  function startTimer() {
    stopTimer()
    if (isPaused) return
    autoTimer = setTimeout(() => {
      activate(currentIndex + 1)
    }, 5000)
  }

  function stopTimer() {
    if (autoTimer) {
      clearTimeout(autoTimer)
      autoTimer = null
    }
  }

  function restartTimer() {
    stopTimer()
    startTimer()
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activate(i)
    })
  })

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activate(currentIndex - 1)
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activate(currentIndex + 1)
    })
  }

  // Hover Pause Handlers
  if (root) {
    root.addEventListener('mouseenter', () => {
      isPaused = true
      root.classList.add('is-paused')
      stopTimer()
      if (autoLabel) autoLabel.textContent = 'Paused (hovering) · Release to resume'
    })
    root.addEventListener('mouseleave', () => {
      isPaused = false
      root.classList.remove('is-paused')
      if (autoLabel) autoLabel.textContent = 'Auto-sliding (5s) · Hover to pause'
      restartTimer()
    })
  }

  // Start auto-slide
  startTimer()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUseCasesTabs)
} else {
  initUseCasesTabs()
}

/* ── HOW IT WORKS (Pattern D) — step nav click-to-scroll & scroll-spy ─ */
function initHowItWorks() {
  const root = document.querySelector('[data-howit-root]');
  if (!root) return;
  const panels = Array.from(root.querySelectorAll('[data-howit-panel]'));
  const dots = Array.from(root.querySelectorAll('[data-howit-step]'));
  if (!panels.length || !dots.length) return;

  function setActive(i) {
    dots.forEach((d, idx) => {
      const isActive = idx === i;
      d.classList.toggle('active', isActive);
      if (isActive) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    panels.forEach((p, idx) => {
      p.classList.toggle('in-view', idx === i);
    });
  }

  // Click-to-scroll with sticky navbar offset
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const targetPanel = panels[idx];
      if (targetPanel) {
        const top = targetPanel.getBoundingClientRect().top + window.pageYOffset - 96;
        window.scrollTo({ top, behavior: 'smooth' });
        setActive(idx);
      }
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      let best = null;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (!best || Math.abs(e.boundingClientRect.top - 120) < Math.abs(best.boundingClientRect.top - 120)) {
          best = e;
        }
      });
      if (best) {
        const i = Number(best.target.getAttribute('data-howit-panel'));
        if (!Number.isNaN(i)) setActive(i);
      }
    },
    { rootMargin: '-20% 0px -40% 0px', threshold: [0.1, 0.5] }
  );

  panels.forEach((p) => io.observe(p));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHowItWorks)
} else {
  initHowItWorks()
}


/* ── By-vertical cookbook tabs (docs.html) ───────────────────────── */
function initVerticalCookbook() {
  const roots = document.querySelectorAll('[data-ucbv-root]')
  roots.forEach(root => {
    const tabs   = Array.from(root.querySelectorAll('[data-ucbv-tab]'))
    const panels = Array.from(root.querySelectorAll('[data-ucbv-panel]'))
    if (!tabs.length || !panels.length) return

    const activate = (key) => {
      tabs.forEach(t => t.setAttribute(
        'aria-selected', String(t.dataset.ucbvTab === key)
      ))
      panels.forEach(p => p.classList.toggle(
        'is-active', p.dataset.ucbvPanel === key
      ))
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab.dataset.ucbvTab))
      tab.addEventListener('keydown', (e) => {
        let next = i
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
        else if (e.key === 'Home') next = 0
        else if (e.key === 'End') next = tabs.length - 1
        else return
        e.preventDefault()
        tabs[next].focus()
        activate(tabs[next].dataset.ucbvTab)
      })
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVerticalCookbook)
} else {
  initVerticalCookbook()
}


/* ── CONTACT FORM (contact.html) — show success state on submit ──
   No backend yet; this just gives the right UX so the page feels done.
   Wire to a real endpoint when the API Console exists. */
function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  const success = form.querySelector('.form-success')
  const submitBtn = form.querySelector('.form-submit')
  if (!success || !submitBtn) return

  form.addEventListener('submit', e => {
    e.preventDefault()

    // HTML5 validity check (required fields)
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    submitBtn.disabled = true
    submitBtn.style.opacity = '0.6'
    submitBtn.textContent = 'Sending…'

    // Simulate network — replace with real fetch when backend is ready
    setTimeout(() => {
      form.querySelectorAll('input, select, textarea').forEach(el => {
        el.disabled = true
        el.style.opacity = '0.6'
      })
      submitBtn.hidden = true
      success.hidden = false
    }, 700)
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm)
} else {
  initContactForm()
}


