<script>
  export let active = false
  export let captions = []

  let currentIndex = 0
  let interval

  $: if (active) {
    currentIndex = 0
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % captions.length
    }, 2200)
  } else {
    clearInterval(interval)
    currentIndex = 0
  }
</script>

<div
  role="region"
  aria-label={active ? 'Video player with captions' : 'Video player without captions'}
  style="
    position:relative;
    height:100%;
    border-radius:8px;
    overflow:hidden;
    background:#080c14;
    border: 1px solid var(--border);
    display:flex; align-items:center; justify-content:center;
  "
>
  <!-- Play icon + title -->
  <div style="text-align:center;">
    <div style="
      width:40px; height:40px; border-radius:50%;
      background:rgba(255,255,255,.12);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 8px;
    ">
      <svg width="14" height="14" fill="white" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 2l10 6-10 6V2z"/>
      </svg>
    </div>
    <span aria-hidden="true" style="color:rgba(255,255,255,.35); font-size:10px;">1.3B People & AI</span>
  </div>

  <!-- Active captions -->
  {#if active && captions.length}
    {@const caption = captions[currentIndex]}
    <div
      role="status"
      aria-live="polite"
      style="
        position:absolute; bottom:0; left:0; right:0;
        background:rgba(0,0,0,.85);
        padding:7px 12px;
        text-align:center;
        transition: opacity 0.3s;
      "
    >
      <span style="color:white; font-size:11px; line-height:1.4;">
        {#if caption.tone}
          <span style="color:#fbbf24; font-weight:600;">[{caption.tone}]</span>{' '}
        {/if}
        {caption.text.replace(/\[.*?\]\s*/g, '')}
      </span>
      <span style="margin-left:8px; color:rgba(255,255,255,.35); font-size:9px;">{caption.time}</span>
    </div>
  {/if}

  <!-- Status badge -->
  {#if !active}
    <div style="
      position:absolute; bottom:8px; right:8px;
      display:flex; align-items:center; gap:4px;
      background:rgba(239,68,68,.85); color:white;
      font-size:10px; font-weight:600;
      padding:2px 7px; border-radius:4px;
    " aria-hidden="true">✕ NO CC</div>
  {:else}
    <div style="
      position:absolute; top:8px; right:8px;
      display:flex; align-items:center; gap:4px;
      background:rgba(34,197,94,.85); color:white;
      font-size:10px; font-weight:600;
      padding:2px 7px; border-radius:4px;
    " aria-hidden="true">✓ CC</div>
  {/if}
</div>
