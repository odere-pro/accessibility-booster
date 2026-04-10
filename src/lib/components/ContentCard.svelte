<script>
  import AltTextOverlay from './AltTextOverlay.svelte'
  import PlainLanguage from './PlainLanguage.svelte'
  import AudioPlayer from './AudioPlayer.svelte'
  import CaptionOverlay from './CaptionOverlay.svelte'
  import TranslationPicker from './TranslationPicker.svelte'
  import ContrastToggle from './ContrastToggle.svelte'
  import { IMAGE_URL, JARGON_TEXT, CAPTIONS, AUDIO_SUMMARY } from '../data/content.js'
  import pregenerated from '../data/pregenerated.json'

  export let toggles = {}
  export let altTextResult = null   // { result, latency_ms, live }
  export let plainResult = null     // { result, latency_ms, live }

  $: altText = altTextResult?.result ?? pregenerated.alt_text.result
  $: altLive = altTextResult?.live ?? false
  $: altLatency = altTextResult?.latency_ms ?? pregenerated.alt_text.latency_ms

  $: plainText = plainResult?.result ?? pregenerated.plain_language.result
  $: plainLive = plainResult?.live ?? false
  $: plainLatency = plainResult?.latency_ms ?? pregenerated.plain_language.latency_ms
</script>

<article class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
  <h2 class="text-lg font-semibold text-gray-900">Municipal Accessibility Policy Update</h2>

  <!-- Image -->
  <AltTextOverlay
    active={toggles.altText}
    {altText}
    imageUrl={IMAGE_URL}
    live={altLive}
    latencyMs={altLatency}
  />

  <!-- Article text -->
  <div class="text-sm leading-relaxed"
    style="font-size: {toggles.contrast ? '0.875rem' : '0.75rem'}; color: {toggles.contrast ? '#111827' : '#9ca3af'}"
  >
    <PlainLanguage
      active={toggles.plainLanguage}
      jargonText={JARGON_TEXT}
      plainText={plainText}
      live={plainLive}
      latencyMs={plainLatency}
    />
  </div>

  <!-- Audio player -->
  <AudioPlayer active={toggles.audio} text={AUDIO_SUMMARY} />

  <!-- Translation -->
  <TranslationPicker active={toggles.translation} translations={pregenerated.translation} />

  <!-- Video with captions -->
  <CaptionOverlay active={toggles.captions} captions={CAPTIONS} />
</article>
