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

