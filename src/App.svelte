<script>
  import ToggleRow from './lib/components/ToggleRow.svelte'
  import ContentCard from './lib/components/ContentCard.svelte'
  import ScoreRing from './lib/components/ScoreRing.svelte'
  import ExplainerStrip from './lib/components/ExplainerStrip.svelte'
  import ScreenReaderPanel from './lib/components/ScreenReaderPanel.svelte'
  import { transform } from './api.js'
  import { IMAGE_CONTEXT, JARGON_TEXT, TOGGLE_META, MAX_SCORE, CAPTIONS, AUDIO_SUMMARY } from './lib/data/content.js'
  import pregenerated from './lib/data/pregenerated.json'

  let toggles = {
    altText: false,
    plainLanguage: true,
    audio: false,
    captions: false,
    translation: false,
    contrast: true
  }

  let altTextResult = null
  let plainResult = null
  let lastToggled = null
  let srAnnouncement = ''
  let showSRPanel = false
  let selectedLang = 'nl'

  $: score = Object.entries(toggles)
    .filter(([, v]) => v)
    .reduce((sum, [k]) => sum + (TOGGLE_META[k]?.points ?? 0), 0)

  $: activeMeta = lastToggled && toggles[lastToggled] ? TOGGLE_META[lastToggled] : null

  async function handleToggle(key) {
    toggles[key] = !toggles[key]
    toggles = { ...toggles }
    lastToggled = key

    const meta = TOGGLE_META[key]
    if (toggles[key]) {
      srAnnouncement = `${meta.label} enabled. ${meta.after}. Score increased by ${meta.points} points.`
    } else {
      srAnnouncement = `${meta.label} disabled. ${meta.before}. Score decreased by ${meta.points} points.`
    }

    if (key === 'altText' && toggles.altText && !altTextResult) {
      altTextResult = await transform('alt_text', IMAGE_CONTEXT)
    }
    if (key === 'plainLanguage' && toggles.plainLanguage && !plainResult) {
      plainResult = await transform('plain_language', JARGON_TEXT)
    }
  }
</script>

<!-- Skip link -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
  Skip to main content
</a>

<!-- Screen reader announcements -->
<div class="sr-only" role="status" aria-live="assertive" aria-atomic="true">{srAnnouncement}</div>

<div class="app-shell" class:contrast-on={toggles.contrast} style="grid-template-rows: auto 1fr auto;">
  <!-- Header -->
  <header style="
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  ">
    <div>
      <h1 style="margin:0; font-size: 15px; font-weight: 700; color: var(--text-bright); line-height: 1.2;">
        AI Accessibility Demo
      </h1>
      <p style="margin:0; font-size: 11px; color: var(--text-ui-dim); margin-top: 2px;">
        94.8% of top websites fail accessibility — watch AI fix it
      </p>
    </div>
    <ScoreRing {score} maxScore={MAX_SCORE} />
  </header>

  <!-- Body -->
  <main id="main-content" class="app-body">
    <!-- Content -->
    <div class="content-col">
      <ContentCard {toggles} {altTextResult} {plainResult} {selectedLang} onLangChange={(code) => selectedLang = code} />
      <ExplainerStrip {activeMeta} />
    </div>

    <!-- Sidebar -->
    <aside class="sidebar" aria-label="Accessibility controls">
      <ToggleRow {toggles} onToggle={handleToggle} />

      <!-- SR view button -->
      <button
        aria-pressed={showSRPanel}
        aria-label="Screen reader view: {showSRPanel ? 'open' : 'closed'}"
        on:click={() => showSRPanel = !showSRPanel}
        style="
          display:flex; align-items:center; justify-content:center; gap:6px;
          width:100%; padding:8px 10px; border-radius:8px; cursor:pointer;
          border:1px solid {showSRPanel ? 'var(--blue-border)' : 'var(--border)'};
          background:{showSRPanel ? 'var(--blue-bg)' : 'var(--surface-2)'};
          color:{showSRPanel ? 'var(--blue-text)' : 'var(--text-ui)'};
          font-size:12px; font-weight:500;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          margin-top:4px;
        "
      >
        <span aria-hidden="true" style="font-size:14px;">🔊</span>
        Screen reader view
      </button>
    </aside>
  </main>

  <!-- Footer -->
  <footer style="
    border-top: 1px solid var(--border);
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-size: 11px;
    color: var(--text-ui-dim);
    background: var(--surface);
    flex-shrink: 0;
  ">
    <span>Built by Oleksander Derechei</span>
    <a
      href="https://www.linkedin.com/in/oleksander-derechei/"
      target="_blank"
      rel="noopener noreferrer"
      style="color: var(--text-ui); text-decoration: none; display: flex; align-items: center; gap: 5px;"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      LinkedIn
    </a>
    <a
      href="https://medium.com/@odere.pub"
      target="_blank"
      rel="noopener noreferrer"
      style="color: var(--text-ui); text-decoration: none; display: flex; align-items: center; gap: 5px;"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
      Medium
    </a>
  </footer>
</div>

{#if showSRPanel}
  <ScreenReaderPanel
    {toggles}
    {score}
    {TOGGLE_META}
    {MAX_SCORE}
    altText={altTextResult?.result ?? pregenerated.alt_text.result}
    plainText={plainResult?.result ?? pregenerated.plain_language.result}
    jargonText={JARGON_TEXT}
    captions={CAPTIONS}
    announcement={srAnnouncement}
    {selectedLang}
    {activeMeta}
    onClose={() => showSRPanel = false}
  />
{/if}
