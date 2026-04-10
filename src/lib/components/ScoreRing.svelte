<script>
  export let score = 0
  export let maxScore = 100

  const r = 17
  const circumference = 2 * Math.PI * r

  $: pct = Math.round((score / maxScore) * 100)
  $: offset = circumference * (1 - score / maxScore)
  $: color = pct === 0 ? '#4a5a6e' : pct <= 33 ? '#f87171' : pct <= 66 ? '#fbbf24' : '#4ade80'
  $: grade = pct === 0 ? 'Failing' : pct <= 33 ? 'Poor' : pct <= 66 ? 'Fair' : pct < 100 ? 'Good' : 'Excellent'
  $: label = `Accessibility score: ${score} of ${maxScore} points — ${pct}%, rated ${grade}`
</script>

<div
  role="meter"
  aria-valuenow={score}
  aria-valuemin={0}
  aria-valuemax={maxScore}
  aria-label={label}
  style="display:flex; align-items:center; gap:8px; flex-shrink:0;"
>
  <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true" style="flex-shrink:0;">
    <circle cx="21" cy="21" r={r} fill="none" stroke="var(--border-2)" stroke-width="3.5"/>
    <circle
      cx="21" cy="21" r={r}
      fill="none"
      stroke={color}
      stroke-width="3.5"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform="rotate(-90 21 21)"
      style="transition: stroke-dashoffset 0.6s ease, stroke 0.4s ease;"
    />
    <text x="21" y="25" text-anchor="middle" font-size="10" font-weight="700" fill={color}>{pct}%</text>
  </svg>
  <div style="line-height:1.1;">
    <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:{color}; transition: color 0.4s ease;">{grade}</div>
    <div style="font-size:10px; color:var(--text-ui-dim);">{score}/{maxScore} pts</div>
  </div>
</div>
