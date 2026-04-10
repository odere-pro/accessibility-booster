<script>
  export let active = false
  export let text = ''

  let speaking = false
  let utterance

  function speak() {
    if (speaking) {
      window.speechSynthesis.cancel()
      speaking = false
      return
    }
    utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => { speaking = false }
    window.speechSynthesis.speak(utterance)
    speaking = true
  }
</script>

<div aria-live="polite">
  {#if !active}
    <div style="
      display:flex; align-items:center; gap:8px;
      padding:8px 10px;
      border-radius:8px;
      background:var(--red-bg);
      border:1px solid var(--red-border);
    ">
      <span style="color:var(--red-text); font-size:10px; font-weight:700;" aria-hidden="true">✕</span>
      <span style="color:var(--red-text); font-size:11px;">No audio alternative</span>
    </div>
  {:else}
    <div style="
      display:flex; align-items:center; gap:10px;
      padding:8px 10px;
      border-radius:8px;
      background:var(--blue-bg);
      border:1px solid var(--blue-border);
      transition: background 0.3s;
    ">
      <button
        style="
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px; border-radius:50%;
          background: #2563eb;
          border:none; cursor:pointer; color:white;
          flex-shrink:0;
          transition: background 0.15s;
        "
        aria-label={speaking ? 'Stop audio summary' : 'Play audio summary'}
        on:click={speak}
        on:mouseenter={e => e.currentTarget.style.background='#1d4ed8'}
        on:mouseleave={e => e.currentTarget.style.background='#2563eb'}
      >
        {#if speaking}
          <svg width="11" height="11" viewBox="0 0 16 16" fill="white" aria-hidden="true">
            <rect x="3" y="2" width="4" height="12" rx="1"/>
            <rect x="9" y="2" width="4" height="12" rx="1"/>
          </svg>
        {:else}
          <svg width="11" height="11" viewBox="0 0 16 16" fill="white" aria-hidden="true">
            <path d="M4 2l10 6-10 6V2z"/>
          </svg>
        {/if}
      </button>

      <div style="flex:1; min-width:0;">
        <div style="font-size:11px; font-weight:500; color:var(--blue-text);">Audio summary</div>
        <!-- Waveform -->
        <div style="display:flex; align-items:flex-end; gap:2px; margin-top:3px; height:14px;" aria-hidden="true">
          {#each Array(12) as _, i}
            <div style="
              width:2px; border-radius:1px;
              background:{speaking ? 'var(--blue-text)' : 'var(--border-2)'};
              height:{speaking ? Math.random() * 10 + 3 : 3}px;
              animation:{speaking ? `wave ${0.4 + i * 0.06}s ease-in-out infinite alternate` : 'none'};
            "></div>
          {/each}
        </div>
      </div>

      <span style="font-size:9px; color:var(--text-ui-dim); flex-shrink:0;">Speech API</span>
    </div>
  {/if}
</div>

<style>
  @keyframes wave {
    from { height: 2px; }
    to   { height: 13px; }
  }
</style>
