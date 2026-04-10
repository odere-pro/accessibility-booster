<script>
  export let toggles = {}
  export let onToggle = () => {}

  const items = [
    { key: 'altText',       label: 'Alt text',      icon: '🖼' },
    { key: 'plainLanguage', label: 'Plain language', icon: '📖' },
    { key: 'audio',         label: 'Audio',          icon: '🔊' },
    { key: 'captions',      label: 'Captions',       icon: '💬' },
    { key: 'translation',   label: 'Translation',    icon: '🌐' },
    { key: 'contrast',      label: 'Contrast',       icon: '🔆' }
  ]
</script>

<section aria-label="Accessibility toggles" class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
  <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Accessibility fixes</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {#each items as { key, label, icon }}
      {@const active = toggles[key]}
      <button
        role="switch"
        aria-checked={active}
        aria-label="{label} fix {active ? 'on' : 'off'}"
        class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        class:border-green-500={active}
        class:bg-green-50={active}
        class:text-green-800={active}
        class:border-gray-200={!active}
        class:bg-gray-50={!active}
        class:text-gray-600={!active}
        on:click={() => onToggle(key)}
      >
        <span class="text-lg" aria-hidden="true">{icon}</span>
        <span class="text-sm font-medium">{label}</span>
        <span class="ml-auto">
          <span class="inline-block w-9 h-5 rounded-full relative transition-colors duration-200"
            class:bg-green-500={active}
            class:bg-gray-300={!active}
          >
            <span class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
              class:translate-x-4={active}
            ></span>
          </span>
        </span>
      </button>
    {/each}
  </div>
</section>
