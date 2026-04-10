<script>
  export let active = false
  export let altText = ''
  export let imageUrl = ''
  export let live = false
  export let latencyMs = 0
</script>

<figure
  role="group"
  aria-label={active ? 'Image with AI-generated alt text' : 'Image missing alt text'}
  style="
    margin:0;
    display:flex; flex-direction:column;
    height:100%;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid {active ? 'var(--green-border)' : 'var(--red-border)'};
    background: var(--surface);
    transition: border-color 0.3s;
  "
>
  <div style="position:relative; flex:1; min-height:0; overflow:hidden;">
    <img
      src={imageUrl}
      alt={active ? altText : ''}
      style="width:100%; height:100%; object-fit:cover; display:block;"
    />
    <!-- Status badge -->
    {#if !active}
      <div style="
        position:absolute; top:8px; left:8px;
        display:flex; align-items:center; gap:4px;
        background: rgba(239,68,68,0.9);
        color:white; font-size:10px; font-family:monospace;
        padding:2px 7px; border-radius:4px;
      " aria-hidden="true">✕ alt=""</div>
      <div class="sr-only">Warning: this image has no alt text.</div>
    {:else}
      <div style="
        position:absolute; top:8px; left:8px;
        display:flex; align-items:center; gap:4px;
        background: rgba(34,197,94,0.9);
        color:white; font-size:10px;
        padding:2px 7px; border-radius:4px;
      " aria-hidden="true">✓ alt text</div>
    {/if}
  </div>

  {#if active}
    <figcaption
      aria-live="polite"
      style="
        flex-shrink:0;
        padding: 6px 10px;
        background: var(--green-bg);
        border-top: 1px solid var(--green-border);
        font-size: 11px;
        line-height: 1.4;
        color: var(--green-text);
      "
    >
      <span style="font-weight:600;">Alt:</span> {altText}
      {#if live}
        <span style="margin-left:6px; font-size:10px; opacity:.7;">{latencyMs}ms</span>
      {:else}
        <span style="
          margin-left:6px; font-size:9px;
          background:var(--green-border); color:var(--green-text);
          padding:1px 5px; border-radius:3px;
        ">Claude</span>
      {/if}
    </figcaption>
  {/if}
</figure>
