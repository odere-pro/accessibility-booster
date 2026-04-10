<script>
  import AltTextOverlay from './AltTextOverlay.svelte'
  import PlainLanguage from './PlainLanguage.svelte'
  import AudioPlayer from './AudioPlayer.svelte'
  import CaptionOverlay from './CaptionOverlay.svelte'
  import TranslationPicker from './TranslationPicker.svelte'
  import { IMAGE_URL, JARGON_TEXT, CAPTIONS, AUDIO_SUMMARY } from '../data/content.js'
  import pregenerated from '../data/pregenerated.json'

  export let toggles = {}
  export let altTextResult = null
  export let plainResult = null
  export let selectedLang = 'nl'
  export let onLangChange = (_code) => {}

  $: altText    = altTextResult?.result    ?? pregenerated.alt_text.result
  $: altLive    = altTextResult?.live      ?? false
  $: altLatency = altTextResult?.latency_ms ?? pregenerated.alt_text.latency_ms

  $: plainText    = plainResult?.result     ?? pregenerated.plain_language.result
  $: plainLive    = plainResult?.live       ?? false
  $: plainLatency = plainResult?.latency_ms ?? pregenerated.plain_language.latency_ms
</script>

<!-- Title bar -->
<div style="
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
">
  <h2 style="
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-heading);
    transition: color 0.5s ease;
  ">AI Is Giving 1.3 Billion People Access to the Web</h2>

  <!-- Contrast ratio badge -->
  <div aria-live="polite" style="flex-shrink:0;">
    {#if !toggles.contrast}
      <span style="
        display:inline-flex; align-items:center; gap:4px;
        font-size:10px; font-weight:600;
        padding:2px 8px; border-radius:20px;
        background:var(--red-bg); border:1px solid var(--red-border);
        color: var(--red-text);
      ">✕ 2.8:1 fails</span>
    {:else}
      <span style="
        display:inline-flex; align-items:center; gap:4px;
        font-size:10px; font-weight:600;
        padding:2px 8px; border-radius:20px;
        background:var(--green-bg); border:1px solid var(--green-border);
        color: var(--green-text);
      ">✓ 12.6:1 passes</span>
    {/if}
  </div>
</div>

<!-- 2×2 demo grid -->
<div class="demo-grid" style="flex:1; min-height:0;">
  <section aria-label="Image accessibility" style="min-height:0; display:flex; flex-direction:column;">
    <AltTextOverlay active={toggles.altText} {altText} imageUrl={IMAGE_URL} live={altLive} latencyMs={altLatency} />
  </section>

  <section aria-label="Text readability" style="min-height:0; display:flex; flex-direction:column;">
    <PlainLanguage
      active={toggles.plainLanguage}
      jargonText={JARGON_TEXT}
      plainText={plainText}
      live={plainLive}
      latencyMs={plainLatency}
    />
  </section>

  <section aria-label="Video captions" style="min-height:0; display:flex; flex-direction:column;">
    <CaptionOverlay active={toggles.captions} captions={CAPTIONS} />
  </section>

  <div style="display:flex; flex-direction:column; gap:8px; min-height:0;">
    <section aria-label="Audio alternative" style="flex-shrink:0;">
      <AudioPlayer active={toggles.audio} text={AUDIO_SUMMARY} />
    </section>
    <section aria-label="Language translation" style="flex:1; min-height:0; display:flex; flex-direction:column;">
      <TranslationPicker active={toggles.translation} translations={pregenerated.translation} selected={selectedLang} {onLangChange} />
    </section>
  </div>
</div>
