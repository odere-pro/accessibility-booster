<script>
  export let active = false
  export let translations = {}

  const languages = [
    { code: 'nl', label: 'Dutch',   flag: '🇳🇱' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', label: 'French',  flag: '🇫🇷' }
  ]

  export let selected = 'nl'
  export let onLangChange = (_code) => {}
</script>

<div
  aria-live="polite"
  style="display:flex; flex-direction:column; height:100%; min-height:0;"
>
  {#if !active}
    <div style="
      display:flex; align-items:center; gap:8px;
      padding:8px 10px; border-radius:8px;
      background:var(--red-bg); border:1px solid var(--red-border);
    ">
      <span style="color:var(--red-text); font-size:10px; font-weight:700;" aria-hidden="true">✕</span>
      <span style="color:var(--red-text); font-size:11px;">English only</span>
    </div>
  {:else}
    <div style="
      display:flex; flex-direction:column;
      flex:1; min-height:0;
      padding:8px 10px; border-radius:8px;
      background:var(--purple-bg); border:1px solid var(--purple-border);
      transition: background 0.3s;
    ">
      <div style="
        display:flex; align-items:center; gap:8px;
        flex-shrink:0; margin-bottom:6px;
      ">
        <span style="color:var(--green-text); font-size:10px; font-weight:700;" aria-hidden="true">✓</span>
        <label for="lang-select" style="font-size:11px; font-weight:500; color:var(--purple-text);">Translate:</label>
        <select
          id="lang-select"
          bind:value={selected}
          on:change={() => onLangChange(selected)}
          style="
            font-size:11px;
            padding:2px 6px; border-radius:4px;
            background:var(--surface-2);
            border:1px solid var(--purple-border);
            color:var(--purple-text);
            cursor:pointer;
          "
        >
          {#each languages as { code, label, flag }}
            <option value={code}>{flag} {label}</option>
          {/each}
        </select>
      </div>
      <p style="
        margin:0; flex:1; min-height:0;
        font-size:11px; line-height:1.55;
        color:var(--purple-text);
        overflow-y:auto;
      " lang={selected}>
        {translations[selected] ?? ''}
      </p>
    </div>
  {/if}
</div>
