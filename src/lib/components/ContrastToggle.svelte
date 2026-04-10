<script>
  export let active = false
</script>

<!-- This component just exports a class; ContentCard uses the prop directly -->
<!-- But we expose a slot so it can wrap text content -->
<span
  class="transition-colors duration-500"
  style="color: {active ? '#1a1a1a' : '#9ca3af'}"
>
  <slot />
</span>
