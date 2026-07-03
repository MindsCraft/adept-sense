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
          playPromise.catch(err => console.log('Video play interrupted:', err));
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
        playPromise.catch(err => {
          console.log('Lightbox play fail:', err);
          // Fallback: if browser blocks loud autoplay, mute it and try playing again
          lightboxVideo.muted = true;
          lightboxVideo.play().catch(e => console.log('Muted lightbox autoplay also failed:', e));
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


