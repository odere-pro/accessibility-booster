<script>
  export let active = false
  export let jargonText = ''
  export let plainText = ''
  export let live = false
  export let latencyMs = 0
</script>

<div
  aria-live="polite"
  style="
    display:flex; flex-direction:column;
    height:100%;
    border-radius:8px;
    border: 1px solid {active ? 'var(--green-border)' : 'var(--red-border)'};
    background: var(--surface);
    overflow:hidden;
    transition: border-color 0.3s;
  "
>
  <!-- Status bar -->
  <div style="
    flex-shrink:0;
    display:flex; align-items:center; gap:6px;
    padding: 5px 10px;
    background: {active ? 'var(--green-bg)' : 'var(--red-bg)'};
    border-bottom: 1px solid {active ? 'var(--green-border)' : 'var(--red-border)'};
  ">
    {#if !active}
      <span style="color:var(--red-text); font-size:10px; font-weight:700;" aria-hidden="true">✕</span>
      <span style="color:var(--red-text); font-size:10px; font-weight:500;">Grade 16 — hard to read</span>
    {:else}
      <span style="color:var(--green-text); font-size:10px; font-weight:700;" aria-hidden="true">✓</span>
      <span style="color:var(--green-text); font-size:10px; font-weight:500;">Grade 6 — simplified</span>
      {#if live}
        <span style="margin-left:auto; font-size:10px; color:var(--green-text); opacity:.7;">{latencyMs}ms</span>
      {:else}
        <span style="
          margin-left:auto; font-size:9px;
          background:var(--green-border); color:var(--green-text);
          padding:1px 5px; border-radius:3px;
        ">Claude</span>
      {/if}
    {/if}
  </div>

  <!-- Text -->
  <p style="
    flex:1;
    margin:0;
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-content);
    transition: color 0.5s ease;
    overflow-y: auto;
  ">{active ? plainText : jargonText}</p>
</div>
