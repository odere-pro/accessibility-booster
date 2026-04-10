<script>
  import ToggleRow from './lib/components/ToggleRow.svelte'
  import ContentCard from './lib/components/ContentCard.svelte'
  import ScoreRing from './lib/components/ScoreRing.svelte'
  import ExplainerStrip from './lib/components/ExplainerStrip.svelte'
  import { transform } from './api.js'
  import { EXPLAINER, IMAGE_CONTEXT, JARGON_TEXT } from './lib/data/content.js'

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
  let explainerMessage = ''

  $: score = Object.values(toggles).filter(Boolean).length

  async function handleToggle(key) {
    toggles[key] = !toggles[key]
    toggles = { ...toggles }

    if (key === 'altText' && toggles.altText && !altTextResult) {
      altTextResult = await transform('alt_text', IMAGE_CONTEXT)
    }

    if (key === 'plainLanguage' && toggles.plainLanguage && !plainResult) {
      plainResult = await transform('plain_language', JARGON_TEXT)
    }

    explainerMessage = toggles[key] ? (EXPLAINER[key] ?? '') : ''
  }
</script>

<div class="min-h-screen bg-gray-50">
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-5">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">AI Accessibility Demo</h1>
        <p class="text-sm text-gray-500 mt-0.5">Flip a switch. Watch AI fix it.</p>
      </div>
      <ScoreRing {score} total={6} />
    </header>

    <ToggleRow {toggles} onToggle={handleToggle} />

    <ContentCard {toggles} {altTextResult} {plainResult} />

    <ExplainerStrip message={explainerMessage} />
  </main>
</div>
