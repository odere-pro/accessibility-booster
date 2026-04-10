<script>
  export let activeMeta = null
</script>

<div
  aria-label="What changed"
  aria-live="assertive"
  aria-atomic="true"
  style="
    flex-shrink:0;
    border-radius:8px;
    border:1px solid {activeMeta ? 'var(--green-border)' : 'var(--border)'};
    background:{activeMeta ? 'var(--green-bg)' : 'var(--surface)'};
    padding: 8px 12px;
    transition: background 0.3s, border-color 0.3s;
    min-height: 36px;
    display:flex; align-items:center;
  "
>
  {#if activeMeta}
    <div style="display:flex; align-items:flex-start; gap:12px; width:100%; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
        <span style="color:var(--green-text); font-size:11px; font-weight:700;">✓ {activeMeta.label}</span>
        <span style="
          font-size:9px; font-family:monospace; font-weight:600;
          background:var(--green-border); color:var(--green-text);
          padding:1px 6px; border-radius:3px;
        ">{activeMeta.wcag}</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-size:11px; flex:1; min-width:0; flex-wrap:wrap; gap:4px;">
        <span style="color:var(--red-text);">✕ {activeMeta.before}</span>
        <span style="color:var(--text-ui-dim);">→</span>
        <span style="color:var(--green-text);">✓ {activeMeta.after}</span>
      </div>
    </div>
  {:else}
    <span style="color:var(--text-ui-dim); font-size:11px; font-style:italic;">
      Flip a toggle to see what changes and why.
    </span>
  {/if}
</div>
