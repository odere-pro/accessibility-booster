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

{#if active}
  <div class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-300">
    <button
      class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
      aria-label={speaking ? 'Stop audio summary' : 'Play audio summary'}
      on:click={speak}
    >
      {#if speaking}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="3" y="2" width="4" height="12" rx="1"/>
          <rect x="9" y="2" width="4" height="12" rx="1"/>
        </svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M4 2l10 6-10 6V2z"/>
        </svg>
      {/if}
    </button>

    <div class="flex-1">
      <div class="text-sm font-medium text-blue-900">Audio summary</div>
      <div class="flex items-end gap-0.5 mt-1" aria-hidden="true">
        {#each Array(12) as _, i}
          <div
            class="w-1 rounded-full transition-all"
            class:bg-blue-500={speaking}
            class:bg-blue-200={!speaking}
            style="height: {speaking ? Math.random() * 16 + 4 : 4}px; animation: {speaking ? `wave ${0.5 + i * 0.07}s ease-in-out infinite alternate` : 'none'}"
          ></div>
        {/each}
      </div>
    </div>

    <span class="text-xs text-blue-600">Web Speech API</span>
  </div>
{/if}

<style>
  @keyframes wave {
    from { height: 4px; }
    to { height: 20px; }
  }
</style>
