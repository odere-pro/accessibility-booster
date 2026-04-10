<script>
  import ToggleRow from './lib/components/ToggleRow.svelte'
  import ContentCard from './lib/components/ContentCard.svelte'
  import ScoreRing from './lib/components/ScoreRing.svelte'
  import ExplainerStrip from './lib/components/ExplainerStrip.svelte'
  import ScreenReaderPanel from './lib/components/ScreenReaderPanel.svelte'
  import { transform } from './api.js'
  import { IMAGE_CONTEXT, JARGON_TEXT, TOGGLE_META, MAX_SCORE, CAPTIONS } from './lib/data/content.js'
  import pregenerated from './lib/data/pregenerated.json'

  let toggles = {
    altText: false,
    plainLanguage: false,
    audio: false,
    captions: false,
    translation: false,
    contrast: false
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

<div class="app-shell" class:contrast-on={toggles.contrast}>
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
</div>

{#if showSRPanel}
  <ScreenReaderPanel
    {toggles}
    altText={altTextResult?.result ?? pregenerated.alt_text.result}
    plainText={plainResult?.result ?? pregenerated.plain_language.result}
    jargonText={JARGON_TEXT}
    captions={CAPTIONS}
    announcement={srAnnouncement}
    {selectedLang}
    onClose={() => showSRPanel = false}
  />
{/if}
