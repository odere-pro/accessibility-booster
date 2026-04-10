<script>
  export let active = false
  export let translations = {}

  const languages = [
    { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', label: 'French', flag: '🇫🇷' }
  ]

  let selected = 'nl'
</script>

{#if active}
  <div class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg transition-all duration-300">
    <div class="flex items-center gap-2 mb-2">
      <label for="lang-select" class="text-sm font-medium text-purple-900">Language:</label>
      <select
        id="lang-select"
        bind:value={selected}
        class="text-sm border border-purple-300 rounded px-2 py-1 bg-white focus-visible:outline-2 focus-visible:outline-purple-500"
      >
        {#each languages as { code, label, flag }}
          <option value={code}>{flag} {label}</option>
        {/each}
      </select>
    </div>
    <p class="text-sm text-purple-900 leading-relaxed">
      {translations[selected] ?? ''}
    </p>
  </div>
{/if}
