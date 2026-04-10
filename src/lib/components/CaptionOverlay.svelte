<script>
  export let active = false
  export let captions = []

  let currentIndex = 0
  let interval

  $: if (active) {
    currentIndex = 0
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % captions.length
    }, 2000)
  } else {
    clearInterval(interval)
    currentIndex = 0
  }
</script>

<!-- Fake video player -->
<div class="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
  <!-- Thumbnail / static frame -->
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
        <svg width="24" height="24" fill="white" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 2l10 6-10 6V2z"/>
        </svg>
      </div>
      <span class="text-white/60 text-sm">Community Update Video</span>
    </div>
  </div>

  <!-- Caption bar -->
  {#if active && captions.length}
    {@const caption = captions[currentIndex]}
    <div
      class="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-2 text-center transition-all duration-300"
      aria-live="polite"
    >
      <span class="text-white text-sm">
        {#if caption.tone}
          <span class="text-yellow-300 font-medium">[{caption.tone}]</span>
        {/if}
        {caption.text.replace(/\[.*?\]\s*/g, '')}
      </span>
      <span class="ml-2 text-white/40 text-xs">{caption.time}</span>
    </div>
  {/if}

  {#if !active}
    <div class="absolute bottom-2 right-2 bg-red-500/90 text-white text-xs px-2 py-0.5 rounded" aria-hidden="true">
      NO CC
    </div>
  {/if}
</div>
