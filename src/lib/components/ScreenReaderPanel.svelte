<script>
  import { onDestroy } from 'svelte'

  export let toggles = {}
  export let altText = ''
  export let plainText = ''
  export let jargonText = ''
  export let captions = []
  export let announcement = ''
  export let selectedLang = 'nl'
  export let onClose = () => {}

  const langLabel = { nl: 'Dutch', es: 'Spanish', fr: 'French' }

  // Track captions independently so panel doesn't need parent's interval state
  let captionIndex = 0
  let captionInterval

  $: if (toggles.captions && captions.length) {
    clearInterval(captionInterval)
    captionIndex = 0
    captionInterval = setInterval(() => {
      captionIndex = (captionIndex + 1) % captions.length
    }, 2200)
  } else {
    clearInterval(captionInterval)
    captionIndex = 0
  }

  $: currentCaption = captions[captionIndex] ?? null

  onDestroy(() => clearInterval(captionInterval))
</script>

<!-- Backdrop -->
<div
  role="presentation"
  style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;"
  on:click={onClose}
  on:keydown={e => e.key === 'Escape' && onClose()}
></div>

<!-- Panel -->
<section
  role="complementary"
  aria-label="Screen reader simulation panel"
  style="
    position:fixed; bottom:0; left:0; right:0;
    max-height: 60vh;
    z-index:50;
    background:#050810;
    border-top:1px solid #1e2d42;
    display:flex; flex-direction:column;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    animation: slideUp 0.22s ease-out both;
  "
>
  <!-- Header bar -->
  <div style="
    display:flex; align-items:center; justify-content:space-between;
    padding:8px 14px;
    border-bottom:1px solid #1e2d42;
    flex-shrink:0;
  ">
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:13px;">🔊</span>
      <span style="font-size:12px; font-weight:600; color:#e2e8f0;">Screen Reader View</span>
      <span style="font-size:10px; color:#4a5a6e;">— what VoiceOver / NVDA reads</span>
    </div>
    <button
      aria-label="Close screen reader panel"
      on:click={onClose}
      style="
        background:none; border:1px solid #1e2d42; color:#94a3b8;
        padding:2px 8px; border-radius:4px; cursor:pointer;
        font-size:11px; font-family:inherit;
      "
    >✕ close</button>
  </div>

  <!-- Tree output -->
  <div
    role="log"
    aria-label="Accessibility tree output"
    aria-live="off"
    style="overflow-y:auto; padding:10px 14px 16px; flex:1; min-height:0; font-size:11px; line-height:1.8; color:#64748b;"
  >

    <!-- Live announcement -->
    {#if announcement}
      <div style="
        margin-bottom:10px; padding:6px 10px;
        background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25);
        border-radius:5px;
      ">
        <span style="color:#60a5fa; font-weight:700;">▶ live region</span>
        <span style="color:#93c5fd; margin-left:8px;">"{announcement}"</span>
      </div>
    {/if}

    <!-- Page structure -->
    <div style="margin-bottom:6px; color:#334155;">
      ├── <span style="color:#475569;">[landmark: banner]</span>
    </div>
    <div style="margin-bottom:2px; padding-left:20px;">
      ├── <span style="color:#7dd3fc;">[heading 1]</span>
      <span style="color:#e2e8f0;"> "AI Accessibility Demo"</span>
    </div>
    <div style="margin-bottom:8px; padding-left:20px;">
      └── <span style="color:#94a3b8;">[text]</span>
      <span style="color:#e2e8f0;"> "94.8% of top websites fail accessibility — watch AI fix it"</span>
    </div>

    <div style="margin-bottom:6px; color:#334155;">
      ├── <span style="color:#475569;">[landmark: navigation]</span>
      <span style="color:#64748b;"> "Accessibility toggles"</span>
    </div>
    {#each Object.entries(toggles).filter(([k]) => k !== 'selectedLang') as [key, val]}
      <div style="padding-left:20px; margin-bottom:2px;">
        ├── <span style="color:#a78bfa;">[switch {val ? 'on' : 'off'}]</span>
        <span style="color:{val ? '#4ade80' : '#94a3b8'};"> "{key === 'altText' ? 'Alt text' : key === 'plainLanguage' ? 'Plain language' : key === 'audio' ? 'Audio' : key === 'captions' ? 'Captions' : key === 'translation' ? 'Translation' : 'Contrast'}: {val ? 'on' : 'off'}"</span>
      </div>
    {/each}

    <div style="margin-top:8px; margin-bottom:6px; color:#334155;">
      └── <span style="color:#475569;">[landmark: main]</span>
    </div>

    <!-- Heading + contrast -->
    <div style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#7dd3fc;">[heading 2]</span>
      <span style="color:#e2e8f0;"> "AI Is Giving 1.3 Billion People Access to the Web"</span>
    </div>
    <div style="padding-left:20px; margin-bottom:8px;">
      ├── <span style="color:#a78bfa;">[status]</span>
      {#if toggles.contrast}
        <span style="color:#4ade80;"> "✓ 12.6:1 passes"</span>
      {:else}
        <span style="color:#f87171;"> "✕ 2.8:1 fails"</span>
        <span style="color:#f87171; margin-left:6px;">⚠ contrast failure announced</span>
      {/if}
    </div>

    <!-- Alt text region -->
    <div style="padding-left:20px; margin-bottom:4px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Image accessibility"</span>
    </div>
    <div style="padding-left:40px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[figure]</span>
      {#if toggles.altText}
        <span style="color:#4ade80;"> "Image with AI-generated alt text"</span>
      {:else}
        <span style="color:#f87171;"> "Image missing alt text"</span>
      {/if}
    </div>
    <div style="padding-left:40px; margin-bottom:{toggles.altText ? 8 : 2}px;">
      {#if toggles.altText}
        ├── <span style="color:#475569;">[img]</span>
        <span style="color:#4ade80;"> "{altText}"</span>
      {:else}
        ├── <span style="color:#475569;">[img]</span>
        <span style="color:#f87171;"> alt=""</span>
        <span style="color:#f87171; margin-left:6px;">⚠ skipped — no description</span>
      {/if}
    </div>
    {#if !toggles.altText}
      <div style="padding-left:40px; margin-bottom:8px;">
        └── <span style="color:#fbbf24;">[sr-only]</span>
        <span style="color:#fde68a;"> "Warning: this image has no alt text."</span>
      </div>
    {/if}

    <!-- Plain language region -->
    <div style="padding-left:20px; margin-bottom:4px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Text readability"</span>
    </div>
    <div style="padding-left:40px; margin-bottom:2px;">
      {#if !toggles.plainLanguage}
        ├── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "Grade 16 — hard to read"</span>
      {:else}
        ├── <span style="color:#4ade80;">[status]</span>
        <span style="color:#4ade80;"> "Grade 6 — simplified"</span>
      {/if}
    </div>
    <div style="padding-left:40px; margin-bottom:8px; max-width:680px;">
      └── <span style="color:#475569;">[paragraph]</span>
      <span style="color:#cbd5e1; white-space:pre-wrap; word-break:break-word;">
        {#if toggles.plainLanguage}
          "{plainText.slice(0, 120)}…"
        {:else}
          "{jargonText.slice(0, 120)}…"
        {/if}
      </span>
    </div>

    <!-- Captions region -->
    <div style="padding-left:20px; margin-bottom:4px;">
      ├── <span style="color:#475569;">[region]</span>
      {#if toggles.captions}
        <span style="color:#4ade80;"> "Video player with captions"</span>
      {:else}
        <span style="color:#f87171;"> "Video player without captions"</span>
      {/if}
    </div>
    <div style="padding-left:40px; margin-bottom:8px;">
      {#if !toggles.captions}
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> ⚠ no captions — audio content inaccessible</span>
      {:else if currentCaption}
        └── <span style="color:#4ade80;">[status aria-live="polite"]</span>
        <span style="color:#4ade80;">
          {#if currentCaption.tone} "[{currentCaption.tone}] {/if}"{currentCaption.text.replace(/\[.*?\]\s*/g, '')}" {currentCaption.time}
        </span>
      {/if}
    </div>

    <!-- Audio region -->
    <div style="padding-left:20px; margin-bottom:4px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Audio alternative"</span>
    </div>
    <div style="padding-left:40px; margin-bottom:8px;">
      {#if !toggles.audio}
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "No audio alternative"</span>
      {:else}
        └── <span style="color:#60a5fa;">[button]</span>
        <span style="color:#93c5fd;"> "Play audio summary"</span>
      {/if}
    </div>

    <!-- Translation region -->
    <div style="padding-left:20px; margin-bottom:4px;">
      └── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Language translation"</span>
    </div>
    <div style="padding-left:40px;">
      {#if !toggles.translation}
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "English only — no translation available"</span>
      {:else}
        └── <span style="color:#4ade80;">[status]</span>
        <span style="color:#4ade80;"> "Translated to {langLabel[selectedLang] ?? 'Dutch'}"</span>
      {/if}
    </div>

  </div>
</section>

<style>
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
</style>
