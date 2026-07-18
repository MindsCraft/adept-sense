import './style.css'

// ── CODE SNIPPETS ──
const codes = {
  node: `<span class="c-kw">import</span> fs <span class="c-kw">from</span> <span class="c-str">'node:fs/promises'</span>
<span class="c-kw">import</span> FormData <span class="c-kw">from</span> <span class="c-str">'form-data'</span>

<span class="c-kw">const</span> form = <span class="c-kw">new</span> <span class="c-fn">FormData</span>()
form.<span class="c-fn">append</span>(<span class="c-str">'front'</span>, frontBuffer, <span class="c-str">'front.jpg'</span>)
form.<span class="c-fn">append</span>(<span class="c-str">'back'</span>, backBuffer, <span class="c-str">'back.jpg'</span>)

<span class="c-kw">const</span> res = <span class="c-kw">await</span> <span class="c-fn">fetch</span>(<span class="c-str">'https://api.adeptsense.tech/api/v1/ocr/nid'</span>, {
  method: <span class="c-str">'POST'</span>,
  headers: {
    <span class="c-str">'x-api-key'</span>: process.<span class="c-var">env</span>.ADEPT_KEY
  },
  body: form
})

<span class="c-kw">const</span> result = <span class="c-kw">await</span> res.<span class="c-fn">json</span>()
console.<span class="c-fn">log</span>(result.ok) <span class="c-cm">// true</span>`,

  python: `<span class="c-kw">import</span> requests

files = {
  <span class="c-str">'front'</span>: (<span class="c-str">'front.jpg'</span>, open(<span class="c-str">'front.jpg'</span>, <span class="c-str">'rb'</span>), <span class="c-str">'image/jpeg'</span>),
  <span class="c-str">'back'</span>: (<span class="c-str">'back.jpg'</span>, open(<span class="c-str">'back.jpg'</span>, <span class="c-str">'rb'</span>), <span class="c-str">'image/jpeg'</span>)
}

res = requests.<span class="c-fn">post</span>(
  <span class="c-str">'https://api.adeptsense.tech/api/v1/ocr/nid'</span>,
  headers={<span class="c-str">'x-api-key'</span>: os.environ[<span class="c-str">"ADEPT_KEY"</span>]},
  files=files
)

result = res.<span class="c-fn">json</span>()
<span class="c-fn">print</span>(result[<span class="c-str">"ok"</span>]) <span class="c-cm"># True</span>`,

  curl: `<span class="c-fn">curl</span> -X POST https://api.adeptsense.tech/api/v1/ocr/nid \\
  -H <span class="c-str">"x-api-key: $ADEPT_KEY"</span> \\
  -F <span class="c-str">"front=@/path/to/front.jpg"</span> \\
  -F <span class="c-str">"back=@/path/to/back.jpg"</span>`
}

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

// ── PRICING VOLUME ESTIMATOR ──
// Sliding scale: 500–2,000 = $0.35, 2,001–25,000 = $0.18, 25,001–100,000 = $0.10, 100k+ = $0.05
const peRange = document.getElementById('pe-volume')
const peVol   = document.querySelector('[data-pe-volume]')
const peCost  = document.querySelector('[data-pe-cost]')

function priceForVolume(v) {
  if (v <= 2000)   return v * 0.35
  if (v <= 25000)  return v * 0.18
  if (v <= 100000) return v * 0.10
  return v * 0.05
}

function formatVol(n) { return n.toLocaleString('en-US') }
function formatCost(n) {
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  return '$' + n.toFixed(2)
}

if (peRange && peVol && peCost) {
  const update = () => {
    const v = Number(peRange.value)
    peVol.textContent  = formatVol(v)
    peCost.textContent = formatCost(priceForVolume(v))
  }
  peRange.addEventListener('input', update)
  update()
}

// ── CODE TAB SWITCHER ──
const tabsEl = document.getElementById('tabs')
const codeEl = document.getElementById('code-block')

if (tabsEl && codeEl) {
  codeEl.innerHTML = codes.node

  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-lang]')
    if (!btn) return
    tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    btn.classList.add('active')
    codeEl.innerHTML = codes[btn.dataset.lang]
  })
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

/* ── USE CASES — Option A tabbed verticals ──
   6 cards swap a single <article data-uc-panel> by cloning the
   matching <template data-uc-tpl="X">. Keyboard nav on the cards.
   ────────────────────────────────────────────────────────────── */
function initUseCasesTabs() {
  const root = document.querySelector('[data-uc-root]')
  if (!root) return

  const cards  = Array.from(root.querySelectorAll('[data-uc-card]'))
  const panel  = root.querySelector('[data-uc-panel]')
  const templates = new Map(
    Array.from(root.querySelectorAll('[data-uc-tpl]'))
         .map(t => [t.dataset.ucTpl, t])
  )
  if (!cards.length || !panel) return

  function activate(key, focus = false) {
    cards.forEach(c => {
      const active = c.dataset.ucCard === key
      c.setAttribute('aria-selected', active ? 'true' : 'false')
      c.setAttribute('tabindex', active ? '0' : '-1')
      if (active && focus) c.focus()
    })
    const tpl = templates.get(key)
    if (tpl) panel.innerHTML = ''
    if (tpl) panel.appendChild(tpl.content.cloneNode(true))
  } cards.forEach((card, i) => {
    card.addEventListener('click', () => activate(card.dataset.ucCard))
    card.addEventListener('keydown', (e) => {
      let next = -1
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % cards.length
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + cards.length) % cards.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = cards.length - 1
      if (next !== -1) {
        e.preventDefault()
        activate(cards[next].dataset.ucCard, true)
      }
    })
  })

  // Hydrate the initial panel from the card marked is-active.
  const initial = cards.find(c => c.classList.contains('is-active')) || cards[0]
  if (initial) activate(initial.dataset.ucCard)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUseCasesTabs)
} else {
  initUseCasesTabs()
}

/* ── HOW IT WORKS (Pattern D) — toggle active progress dot on scroll ─ */
function initHowItWorks() {
  const root = document.querySelector('[data-howit-root]');
  if (!root) return;
  const panels = Array.from(root.querySelectorAll('[data-howit-panel]'));
  const dots = Array.from(root.querySelectorAll('[data-howit-step]'));
  if (!panels.length || !dots.length) return;

  function setActive(i) {
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  const io = new IntersectionObserver(
    (entries) => {
      let best = null;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (!best || e.boundingClientRect.top < best.boundingClientRect.top) best = e;
      });
      if (best) {
        const i = Number(best.target.getAttribute('data-howit-panel'));
        if (!Number.isNaN(i)) setActive(i);
      }
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
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


