<script>
  import { onDestroy } from 'svelte'

  export let toggles = {}
  export let score = 0
  export let TOGGLE_META = {}
  export let MAX_SCORE = 100
  export let altText = ''
  export let plainText = ''
  export let jargonText = ''
  export let captions = []
  export let announcement = ''
  export let selectedLang = 'nl'
  export let activeMeta = null
  export let onClose = () => {}

  const langLabel = { nl: 'Dutch', es: 'Spanish', fr: 'French' }

  // ── Caption ticker ────────────────────────────────────────────
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

  // ── Score meter (mirrors ScoreRing aria-label) ───────────────
  $: pct   = Math.round((score / MAX_SCORE) * 100)
  $: grade = pct === 0 ? 'Failing' : pct <= 33 ? 'Poor' : pct <= 66 ? 'Fair' : pct < 100 ? 'Good' : 'Excellent'

  // ── Speech synthesis ──────────────────────────────────────────
  let speaking = false
  let activeNodeIndex = -1

  /**
   * Build the node list that a screen reader traverses in linear reading order.
   *
   * Rules applied:
   *   INCLUDE  — landmarks, headings, interactive controls (read via aria-label),
   *              content text, live regions, sr-only warnings
   *   EXCLUDE  — aria-hidden elements (decorative badges, icons, waveform,
   *              score child text, video title, "Speech API" label)
   *   NO DUPE  — when aria-label overrides child text (switches, score meter),
   *              only the aria-label version is used
   */
  function buildNodes(t, aT, pT, jT, cc, lang, meta, toggleMeta, maxSc, sc) {
    const nodes = []
    const p = Math.round((sc / maxSc) * 100)
    const g = p === 0 ? 'Failing' : p <= 33 ? 'Poor' : p <= 66 ? 'Fair' : p < 100 ? 'Good' : 'Excellent'

    // Banner ────────────────────────────────────────────────────
    nodes.push({ key: 'banner',   text: 'Banner.' })
    nodes.push({ key: 'h1',       text: 'Heading level 1. AI Accessibility Demo.' })
    nodes.push({ key: 'subtitle', text: '94.8 percent of top websites fail accessibility. Watch AI fix it.' })
    // ScoreRing: role="meter" aria-label — child text divs are aria-hidden (fixed)
    nodes.push({ key: 'meter',    text: `Meter. Accessibility score: ${sc} of ${maxSc} points, ${p} percent, rated ${g}.` })

    // Navigation ────────────────────────────────────────────────
    nodes.push({ key: 'nav', text: 'Navigation. Accessibility toggles.' })
    // aria-label overrides ALL visible child text (icon emoji, label, +pts pill)
    for (const [k, v] of Object.entries(t)) {
      const m = toggleMeta[k]
      if (!m) continue
      nodes.push({ key: `sw-${k}`, text: `Switch, ${v ? 'on' : 'off'}. ${m.label}: ${v ? 'on' : 'off'}, ${m.points} points.` })
    }

    // Main ──────────────────────────────────────────────────────
    nodes.push({ key: 'main', text: 'Main.' })
    nodes.push({ key: 'h2',   text: 'Heading level 2. AI Is Giving 1.3 Billion People Access to the Web.' })
    // Contrast badge is inside aria-live="polite" wrapper — announced on change
    nodes.push({
      key: 'contrast',
      text: t.contrast
        ? 'Status. Contrast ratio 12.6 to 1. Passes WCAG AAA.'
        : 'Status. Contrast ratio 2.8 to 1. Fails WCAG. Contrast failure.'
    })

    // Image region ──────────────────────────────────────────────
    nodes.push({ key: 'img-region', text: 'Region. Image accessibility.' })
    // Status badges (✕ alt="" / ✓ alt text) are aria-hidden — not announced
    if (t.altText) {
      nodes.push({ key: 'img-figure', text: 'Figure. Image with AI-generated alt text.' })
      nodes.push({ key: 'img-alt',    text: aT })   // figcaption, aria-live="polite"
    } else {
      nodes.push({ key: 'img-figure', text: 'Figure. Image missing alt text.' })
      // alt="" → screen reader skips the <img> element entirely
      nodes.push({ key: 'img-warn',   text: 'Warning: this image has no alt text.' })  // sr-only div
    }

    // Text readability region ────────────────────────────────────
    nodes.push({ key: 'text-region', text: 'Region. Text readability.' })
    // ✕/✓ symbols are aria-hidden; the label text IS read
    nodes.push({
      key: 'text-status',
      text: t.plainLanguage ? 'Status. Grade 6. Simplified.' : 'Status. Grade 16. Hard to read.'
    })
    nodes.push({ key: 'text-body', text: (t.plainLanguage ? pT : jT).slice(0, 220) + '…' })

    // Captions region ───────────────────────────────────────────
    // "1.3B People & AI" title is aria-hidden — not announced (fixed)
    // ✕ NO CC / ✓ CC badges are aria-hidden — not announced
    nodes.push({
      key: 'caption-region',
      text: t.captions ? 'Region. Video player with captions.' : 'Region. Video player without captions.'
    })
    if (!t.captions) {
      nodes.push({ key: 'caption-warn', text: 'No captions. Audio content inaccessible.' })
    } else if (cc) {
      nodes.push({ key: 'caption-live', text: `Status. ${cc.text.replace(/\[.*?\]\s*/g, '')}` })
    }

    // Audio region ──────────────────────────────────────────────
    // Waveform bars are aria-hidden — not announced
    // SVG icons are aria-hidden — not announced
    // "Speech API" label is now aria-hidden — not announced (fixed)
    nodes.push({ key: 'audio-region', text: 'Region. Audio alternative.' })
    if (t.audio) {
      nodes.push({ key: 'audio-label',  text: 'Audio summary.' })   // visible text div
      nodes.push({ key: 'audio-button', text: 'Button. Play audio summary.' })  // aria-label
    } else {
      nodes.push({ key: 'audio-status', text: 'Status. No audio alternative.' })
    }

    // Translation region ────────────────────────────────────────
    nodes.push({ key: 'lang-region', text: 'Region. Language translation.' })
    if (t.translation) {
      nodes.push({ key: 'lang-label',   text: 'Label. Translate.' })            // <label for>
      nodes.push({ key: 'lang-select',  text: `Combo box. ${langLabel[lang] ?? 'Dutch'}. 3 options.` })
      nodes.push({ key: 'lang-content', text: `Translated content in ${langLabel[lang] ?? 'Dutch'}.` })
    } else {
      nodes.push({ key: 'lang-status', text: 'Status. English only. No translation available.' })
    }

    // ExplainerStrip: aria-live="assertive" aria-atomic="true" — fires after every toggle
    nodes.push({ key: 'explainer', text: meta
      ? `Live region. ${meta.label} enabled. ${meta.wcag}. Before: ${meta.before}. After: ${meta.after}.`
      : 'Live region. Flip a toggle to see what changes and why.'
    })

    return nodes
  }

  function readAloud() {
    if (speaking) {
      window.speechSynthesis.cancel()
      speaking = false
      activeNodeIndex = -1
      return
    }

    const nodes = buildNodes(
      toggles, altText, plainText, jargonText,
      currentCaption, selectedLang, activeMeta,
      TOGGLE_META, MAX_SCORE, score
    )
    speaking = true
    activeNodeIndex = 0
    let i = 0

    window.speechSynthesis.cancel()
    function speakOne() {
      if (i >= nodes.length || !speaking) {
        speaking = false
        activeNodeIndex = -1
        return
      }
      activeNodeIndex = i
      const u = new SpeechSynthesisUtterance(nodes[i].text)
      u.rate = 1.15
      u.onend  = () => { i++; speakOne() }
      u.onerror = () => { speaking = false; activeNodeIndex = -1 }
      window.speechSynthesis.speak(u)
    }
    speakOne()
  }

  $: activeKey = activeNodeIndex >= 0
    ? buildNodes(toggles, altText, plainText, jargonText, currentCaption, selectedLang, activeMeta, TOGGLE_META, MAX_SCORE, score)[activeNodeIndex]?.key
    : null

  onDestroy(() => {
    clearInterval(captionInterval)
    window.speechSynthesis?.cancel()
  })
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
    <div style="display:flex; align-items:center; gap:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:13px;">🔊</span>
        <span style="font-size:12px; font-weight:600; color:#e2e8f0;">Screen Reader View</span>
        <span style="font-size:10px; color:#4a5a6e;">— what VoiceOver / NVDA reads</span>
      </div>
      <!-- Legend -->
      <div style="display:flex; align-items:center; gap:10px; font-size:9px; color:#4a5a6e; border-left:1px solid #1e2d42; padding-left:12px;">
        <span><span style="color:#94a3b8;">●</span> read</span>
        <span><span style="color:#f87171;">●</span> broken</span>
        <span><span style="color:#475569;">⊘</span> aria-hidden</span>
      </div>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button
        aria-label={speaking ? 'Stop reading' : 'Read page aloud'}
        aria-pressed={speaking}
        on:click={readAloud}
        style="
          display:flex; align-items:center; gap:5px;
          background:{speaking ? 'rgba(34,197,94,.12)' : 'rgba(59,130,246,.1)'};
          border:1px solid {speaking ? '#16a34a' : '#1e3a5f'};
          color:{speaking ? '#4ade80' : '#60a5fa'};
          padding:3px 10px; border-radius:4px; cursor:pointer;
          font-size:11px; font-family:inherit; font-weight:500;
          transition: all 0.2s;
        "
      >
        {#if speaking}
          <span aria-hidden="true" style="display:flex; align-items:flex-end; gap:1.5px; height:11px;">
            {#each [0,1,2] as i}
              <span style="width:2.5px; border-radius:1px; background:#4ade80; animation: srbar {0.5 + i * 0.15}s ease-in-out infinite alternate;"></span>
            {/each}
          </span>
          Stop
        {:else}
          <span aria-hidden="true">▶</span>
          Read aloud
        {/if}
      </button>
      <button
        aria-label="Close screen reader panel"
        on:click={onClose}
        style="background:none; border:1px solid #1e2d42; color:#94a3b8; padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-family:inherit;"
      >✕ close</button>
    </div>
  </div>

  <!-- Tree output -->
  <div
    role="log"
    aria-label="Accessibility tree output"
    aria-live="off"
    style="overflow-y:auto; padding:10px 14px 16px; flex:1; min-height:0; font-size:11px; line-height:1.8; color:#64748b;"
  >

    <!-- Last live announcement -->
    {#if announcement}
      <div style="margin-bottom:10px; padding:6px 10px; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25); border-radius:5px;">
        <span style="color:#60a5fa; font-weight:700;">▶ live region</span>
        <span style="color:#93c5fd; margin-left:8px;">"{announcement}"</span>
      </div>
    {/if}

    <!-- ── Banner ──────────────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'banner'} style="margin-bottom:4px; color:#334155;">
      ├── <span style="color:#475569;">[landmark: banner]</span>
    </div>
    <div class="sr-node" class:active={activeKey === 'h1'} style="margin-bottom:2px; padding-left:20px;">
      ├── <span style="color:#7dd3fc;">[heading 1]</span>
      <span style="color:#e2e8f0;"> "AI Accessibility Demo"</span>
    </div>
    <div class="sr-node" class:active={activeKey === 'subtitle'} style="margin-bottom:2px; padding-left:20px;">
      ├── <span style="color:#94a3b8;">[text]</span>
      <span style="color:#e2e8f0;"> "94.8% of top websites fail accessibility — watch AI fix it"</span>
    </div>
    <!-- ScoreRing: role="meter" with aria-label — is announced -->
    <div class="sr-node" class:active={activeKey === 'meter'} style="margin-bottom:2px; padding-left:20px;">
      ├── <span style="color:#a78bfa;">[meter]</span>
      <span style="color:#c4b5fd;"> "Accessibility score: {score} of {MAX_SCORE} points — {pct}%, rated {grade}"</span>
    </div>
    <!-- Score child text divs are aria-hidden (fixed) — not announced, duplicate of meter label -->
    <div class="sr-hidden" style="padding-left:40px; margin-bottom:8px;">
      └── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
      <span style="color:#253650;"> "{grade}" · "{score}/{MAX_SCORE} pts" — duplicates meter aria-label</span>
    </div>

    <!-- ── Navigation ─────────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'nav'} style="margin-bottom:4px; color:#334155;">
      ├── <span style="color:#475569;">[landmark: navigation]</span>
      <span style="color:#64748b;"> "Accessibility toggles"</span>
    </div>
    {#each Object.entries(toggles) as [key, val]}
      {#if TOGGLE_META[key]}
        {@const m = TOGGLE_META[key]}
        <div class="sr-node" class:active={activeKey === `sw-${key}`} style="padding-left:20px; margin-bottom:2px;">
          ├── <span style="color:#a78bfa;">[switch {val ? 'on' : 'off'}]</span>
          <span style="color:{val ? '#4ade80' : '#94a3b8'};"> "{m.label}: {val ? 'on' : 'off'} — {m.points} points"</span>
        </div>
        <!-- Visible label + +pts text inside button are overridden by aria-label — not announced -->
        <div class="sr-hidden" style="padding-left:40px; margin-bottom:2px;">
          │   └── <span>⊘</span> <span style="color:#1e3a5f;">[aria-label overrides]</span>
          <span style="color:#253650;"> {m.icon} "{m.label}" · "+{m.points}" — not read, aria-label takes precedence</span>
        </div>
      {/if}
    {/each}

    <!-- ── Main ───────────────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'main'} style="margin-top:6px; margin-bottom:4px; color:#334155;">
      └── <span style="color:#475569;">[landmark: main]</span>
    </div>

    <div class="sr-node" class:active={activeKey === 'h2'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#7dd3fc;">[heading 2]</span>
      <span style="color:#e2e8f0;"> "AI Is Giving 1.3 Billion People Access to the Web"</span>
    </div>
    <div class="sr-node" class:active={activeKey === 'contrast'} style="padding-left:20px; margin-bottom:8px;">
      ├── <span style="color:#a78bfa;">[status aria-live="polite"]</span>
      {#if toggles.contrast}
        <span style="color:#4ade80;"> "12.6:1 passes WCAG AAA"</span>
      {:else}
        <span style="color:#f87171;"> "2.8:1 fails WCAG"</span>
        <span style="color:#f87171; margin-left:4px;">⚠ contrast failure</span>
      {/if}
    </div>

    <!-- ── Image region ───────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'img-region'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Image accessibility"</span>
    </div>
    <div class="sr-node" class:active={activeKey === 'img-figure'} style="padding-left:40px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[figure]</span>
      {#if toggles.altText}
        <span style="color:#4ade80;"> "Image with AI-generated alt text"</span>
      {:else}
        <span style="color:#f87171;"> "Image missing alt text"</span>
      {/if}
    </div>
    <!-- Status badges ✕/✓ are aria-hidden — not announced -->
    <div class="sr-hidden" style="padding-left:60px; margin-bottom:2px;">
      ├── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
      {#if toggles.altText}
        <span style="color:#253650;"> "✓ alt text" — decorative badge</span>
      {:else}
        <span style="color:#253650;"> "✕ alt=""" — decorative badge</span>
      {/if}
    </div>
    {#if toggles.altText}
      <div class="sr-node" class:active={activeKey === 'img-alt'} style="padding-left:60px; margin-bottom:8px;">
        └── <span style="color:#475569;">[figcaption aria-live="polite"]</span>
        <span style="color:#4ade80;"> "{altText}"</span>
      </div>
    {:else}
      <!-- alt="" → screen reader skips <img> entirely -->
      <div class="sr-hidden" style="padding-left:60px; margin-bottom:2px;">
        ├── <span>⊘</span> <span style="color:#1e3a5f;">[img alt=""]</span>
        <span style="color:#253650;"> skipped entirely — empty alt means decorative</span>
      </div>
      <!-- sr-only warning IS announced -->
      <div class="sr-node" class:active={activeKey === 'img-warn'} style="padding-left:60px; margin-bottom:8px;">
        └── <span style="color:#fbbf24;">[sr-only]</span>
        <span style="color:#fde68a;"> "Warning: this image has no alt text."</span>
      </div>
    {/if}

    <!-- ── Text readability region ────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'text-region'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Text readability"</span>
    </div>
    <!-- ✕/✓ symbols inside status bar are aria-hidden; label text IS read -->
    <div class="sr-node" class:active={activeKey === 'text-status'} style="padding-left:40px; margin-bottom:2px;">
      {#if !toggles.plainLanguage}
        ├── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "Grade 16 — hard to read"</span>
      {:else}
        ├── <span style="color:#4ade80;">[status]</span>
        <span style="color:#4ade80;"> "Grade 6 — simplified"</span>
      {/if}
    </div>
    <div class="sr-node" class:active={activeKey === 'text-body'} style="padding-left:40px; margin-bottom:8px; max-width:680px;">
      └── <span style="color:#475569;">[paragraph]</span>
      <span style="color:#cbd5e1; white-space:pre-wrap; word-break:break-word;">
        "{(toggles.plainLanguage ? plainText : jargonText).slice(0, 110)}…"
      </span>
    </div>

    <!-- ── Captions region ────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'caption-region'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[region]</span>
      {#if toggles.captions}
        <span style="color:#4ade80;"> "Video player with captions"</span>
      {:else}
        <span style="color:#f87171;"> "Video player without captions"</span>
      {/if}
    </div>
    <!-- "1.3B People & AI" video title is aria-hidden (fixed) -->
    <div class="sr-hidden" style="padding-left:40px; margin-bottom:2px;">
      ├── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
      <span style="color:#253650;"> "1.3B People & AI" — decorative video title</span>
    </div>
    <!-- ✕ NO CC / ✓ CC badges are aria-hidden -->
    <div class="sr-hidden" style="padding-left:40px; margin-bottom:2px;">
      ├── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
      {#if toggles.captions}
        <span style="color:#253650;"> "✓ CC" — decorative badge</span>
      {:else}
        <span style="color:#253650;"> "✕ NO CC" — decorative badge</span>
      {/if}
    </div>
    <div class="sr-node" class:active={activeKey === 'caption-warn' || activeKey === 'caption-live'} style="padding-left:40px; margin-bottom:8px;">
      {#if !toggles.captions}
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> ⚠ no captions — audio content inaccessible</span>
      {:else if currentCaption}
        └── <span style="color:#4ade80;">[status aria-live="polite"]</span>
        <span style="color:#4ade80;">
          {#if currentCaption.tone}"[{currentCaption.tone}] {/if}"{currentCaption.text.replace(/\[.*?\]\s*/g, '')}"
        </span>
      {/if}
    </div>

    <!-- ── Audio region ───────────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'audio-region'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Audio alternative"</span>
    </div>
    {#if !toggles.audio}
      <div class="sr-node" class:active={activeKey === 'audio-status'} style="padding-left:40px; margin-bottom:8px;">
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "No audio alternative"</span>
      </div>
    {:else}
      <div class="sr-node" class:active={activeKey === 'audio-label'} style="padding-left:40px; margin-bottom:2px;">
        ├── <span style="color:#475569;">[text]</span>
        <span style="color:#e2e8f0;"> "Audio summary"</span>
      </div>
      <!-- Waveform bars are aria-hidden — not announced -->
      <div class="sr-hidden" style="padding-left:40px; margin-bottom:2px;">
        ├── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
        <span style="color:#253650;"> waveform animation bars — decorative</span>
      </div>
      <!-- "Speech API" label is now aria-hidden (fixed) -->
      <div class="sr-hidden" style="padding-left:40px; margin-bottom:2px;">
        ├── <span>⊘</span> <span style="color:#1e3a5f;">[aria-hidden]</span>
        <span style="color:#253650;"> "Speech API" — decorative tech label</span>
      </div>
      <div class="sr-node" class:active={activeKey === 'audio-button'} style="padding-left:40px; margin-bottom:8px;">
        └── <span style="color:#60a5fa;">[button]</span>
        <span style="color:#93c5fd;"> "Play audio summary"</span>
      </div>
    {/if}

    <!-- ── Translation region ─────────────────────────────────── -->
    <div class="sr-node" class:active={activeKey === 'lang-region'} style="padding-left:20px; margin-bottom:2px;">
      ├── <span style="color:#475569;">[region]</span>
      <span style="color:#64748b;"> "Language translation"</span>
    </div>
    {#if !toggles.translation}
      <div class="sr-node" class:active={activeKey === 'lang-status'} style="padding-left:40px; margin-bottom:8px;">
        └── <span style="color:#f87171;">[status]</span>
        <span style="color:#f87171;"> "English only — no translation available"</span>
      </div>
    {:else}
      <div class="sr-node" class:active={activeKey === 'lang-label'} style="padding-left:40px; margin-bottom:2px;">
        ├── <span style="color:#94a3b8;">[label for="lang-select"]</span>
        <span style="color:#e2e8f0;"> "Translate:"</span>
      </div>
      <div class="sr-node" class:active={activeKey === 'lang-select'} style="padding-left:40px; margin-bottom:2px;">
        ├── <span style="color:#60a5fa;">[combobox]</span>
        <span style="color:#93c5fd;"> "{langLabel[selectedLang] ?? 'Dutch'}, 3 options"</span>
      </div>
      <div class="sr-node" class:active={activeKey === 'lang-content'} style="padding-left:40px; margin-bottom:8px;">
        └── <span style="color:#4ade80;">[paragraph lang="{selectedLang}"]</span>
        <span style="color:#86efac;"> translated content</span>
      </div>
    {/if}

    <!-- ── ExplainerStrip (aria-live="assertive" aria-atomic="true") ── -->
    <div class="sr-node" class:active={activeKey === 'explainer'} style="padding-left:20px; margin-bottom:2px;">
      └── <span style="color:#60a5fa;">[live region: assertive, atomic]</span>
      {#if activeMeta}
        <span style="color:#4ade80;"> "{activeMeta.label} — {activeMeta.wcag}"</span>
      {:else}
        <span style="color:#64748b; font-style:italic;"> "Flip a toggle to see what changes and why."</span>
      {/if}
    </div>

  </div>
</section>

<style>
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  @keyframes srbar {
    from { height: 2px; }
    to   { height: 11px; }
  }

  /* Readable node — highlights blue when spoken */
  :global(.sr-node) {
    border-radius: 3px;
    padding: 0 4px;
    margin-left: -4px;
    transition: background 0.15s;
  }
  :global(.sr-node.active) {
    background: rgba(59, 130, 246, 0.15);
    outline: 1px solid rgba(59, 130, 246, 0.3);
  }

  /* aria-hidden node — visually muted, never highlighted */
  :global(.sr-hidden) {
    opacity: 0.45;
    font-style: italic;
    padding: 0 4px;
    margin-left: -4px;
  }
</style>
