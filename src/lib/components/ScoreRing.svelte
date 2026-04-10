<script>
  export let score = 0
  export let total = 6

  const r = 20
  const circumference = 2 * Math.PI * r

  $: dashoffset = circumference * (1 - score / total)
  $: color = score <= 2 ? '#ef4444' : score <= 4 ? '#f59e0b' : '#22c55e'
  $: label = `${score} of ${total} accessibility fixes applied`
</script>

<div class="flex items-center gap-3" aria-label={label} role="status">
  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
    <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" stroke-width="6" />
    <circle
      cx="28" cy="28" r={r}
      fill="none"
      stroke={color}
      stroke-width="6"
      stroke-dasharray={circumference}
      stroke-dashoffset={dashoffset}
      stroke-linecap="round"
      transform="rotate(-90 28 28)"
      style="transition: stroke-dashoffset 0.4s ease, stroke 0.4s ease"
    />
    <text x="28" y="33" text-anchor="middle" font-size="13" font-weight="600" fill={color}>
      {score}/{total}
    </text>
  </svg>
  <span class="text-sm font-medium" style="color: {color}">
    {score === 0 ? 'No fixes' : score === total ? 'All fixed!' : `${score} fixed`}
  </span>
</div>
