<script>
  import { TOGGLE_META } from '../data/content.js'

  export let toggles = {}
  export let onToggle = () => {}

  const items = Object.values(TOGGLE_META)
</script>

<!-- CSS in app.css controls layout: vertical on desktop, 3-col grid on tablet, 2-col on mobile -->
<nav aria-label="Accessibility toggles" class="toggle-nav">
  {#each items as { key, label, icon, points }}
    {@const active = toggles[key]}
    <button
      role="switch"
      aria-checked={active}
      aria-label="{label}: {active ? 'on' : 'off'} — {points} points"
      on:click={() => onToggle(key)}
      style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid {active ? 'var(--green-border)' : 'var(--border)'};
        background: {active ? 'var(--green-bg)' : 'var(--surface-2)'};
        cursor: pointer;
        text-align: left;
        transition: background 0.25s, border-color 0.25s, transform 0.12s;
        min-width: 0;
      "
    >
      <span style="font-size:15px; line-height:1; flex-shrink:0;" aria-hidden="true">{icon}</span>
      <span style="
        flex:1;
        font-size: 12px;
        font-weight: 500;
        color: {active ? 'var(--green-text)' : 'var(--text-ui)'};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
      ">{label}</span>
      <span style="font-size:10px; font-weight:700; color:{active ? 'var(--green-text)' : 'var(--text-ui-dim)'}; flex-shrink:0; transition: color 0.2s;">+{points}</span>
      <!-- Toggle pill -->
      <span aria-hidden="true" style="
        display:inline-flex; align-items:center;
        width: 28px; height: 16px;
        border-radius: 8px;
        background: {active ? '#22c55e' : 'var(--surface-3)'};
        border: 1px solid {active ? '#16a34a' : 'var(--border-2)'};
        position: relative;
        flex-shrink:0;
        transition: background 0.2s, border-color 0.2s;
      ">
        <span style="
          position: absolute;
          width: 12px; height: 12px;
          background: white;
          border-radius: 50%;
          top: 1px;
          left: {active ? '13px' : '1px'};
          box-shadow: 0 1px 3px rgba(0,0,0,.4);
          transition: left 0.2s;
        "></span>
      </span>
    </button>
  {/each}
</nav>

<style>
  /* layout (flex/grid) is controlled in app.css; only interaction styles here */
  :global(.toggle-nav) button:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }

  :global(.toggle-nav) button:active {
    transform: translateY(0) scale(0.98);
  }
</style>
