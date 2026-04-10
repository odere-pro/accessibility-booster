<script>
  export let message = ''
</script>

<div
  aria-live="polite"
  aria-atomic="true"
  class="min-h-[3rem] flex items-center px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700"
>
  {#if message}
    <span class="mr-2 text-green-500" aria-hidden="true">✓</span>
    {message}
  {:else}
    <span class="text-gray-400 italic">Flip a toggle above to see what changes.</span>
  {/if}
</div>
