import './style.css'

// ── CODE SNIPPETS ──
const codes = {
  node: `<span class="c-kw">import</span> AdeptSense <span class="c-kw">from</span> <span class="c-str">'@adeptsense/node'</span>

<span class="c-kw">const</span> client = <span class="c-kw">new</span> <span class="c-fn">AdeptSense</span>({
  apiKey: process.<span class="c-var">env</span>.ADEPT_KEY
})

<span class="c-cm">// Verify NID + liveness + face match</span>
<span class="c-kw">const</span> result = <span class="c-kw">await</span> client.verify.<span class="c-fn">nid</span>({
  front:     frontBuffer,
  back:      backBuffer,
  selfie:    selfieBuffer,
  liveness:  <span class="c-val">true</span>,
  faceMatch: <span class="c-val">true</span>
})

<span class="c-cm">// { verified: true, liveness_score: 0.97, ... }</span>
console.<span class="c-fn">log</span>(result.verified)`,

  python: `<span class="c-kw">from</span> adeptsense <span class="c-kw">import</span> AdeptSense

client = <span class="c-fn">AdeptSense</span>(api_key=os.environ[<span class="c-str">"ADEPT_KEY"</span>])

<span class="c-cm"># Verify NID + liveness + face match</span>
result = client.verify.<span class="c-fn">nid</span>(
  front=front_bytes,
  back=back_bytes,
  selfie=selfie_bytes,
  liveness=<span class="c-val">True</span>,
  face_match=<span class="c-val">True</span>
)

<span class="c-cm"># { "verified": true, "liveness_score": 0.97 }</span>
<span class="c-fn">print</span>(result[<span class="c-str">"verified"</span>])`,

  curl: `<span class="c-fn">curl</span> -X POST https://api.adeptsense.tech/v1/verify/nid \\
  -H <span class="c-str">"Authorization: Bearer $ADEPT_KEY"</span> \\
  -H <span class="c-str">"Content-Type: application/json"</span> \\
  -d '{
    <span class="c-str">"front_image"</span>: <span class="c-str">"base64..."</span>,
    <span class="c-str">"back_image"</span>:  <span class="c-str">"base64..."</span>,
    <span class="c-str">"selfie"</span>:      <span class="c-str">"base64..."</span>,
    <span class="c-str">"liveness"</span>:   <span class="c-val">true</span>,
    <span class="c-str">"face_match"</span>: <span class="c-val">true</span>
  }'`
}

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar')
window.addEventListener('scroll', () => {
  navbar.classList.toggle('opaque', window.scrollY > 20)
}, { passive: true })

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
