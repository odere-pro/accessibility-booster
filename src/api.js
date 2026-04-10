import pregenerated from './lib/data/pregenerated.json'

/**
 * Call /api/transform if the dev server has the API middleware active,
 * otherwise fall back to pre-generated content.
 * @param {'alt_text'|'plain_language'} type
 * @param {string} content
 * @returns {Promise<{result: string, latency_ms: number, live: boolean}>}
 */
export async function transform(type, content) {
  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content })
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return { ...data, live: true }
  } catch {
    const fallback = pregenerated[type]
    return { ...fallback, live: false }
  }
}
