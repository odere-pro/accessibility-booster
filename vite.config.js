import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// API middleware plugin — active only in dev when ANTHROPIC_API_KEY is set
function apiMiddlewarePlugin() {
  return {
    name: 'api-middleware',
    configureServer(server) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) return

      server.middlewares.use('/api/transform', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405)
          res.end()
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const { type, content } = JSON.parse(body)
            const { default: Anthropic } = await import('@anthropic-ai/sdk')
            const client = new Anthropic({ apiKey })

            const prompts = {
              alt_text: `Write a concise, descriptive alt text for this image context: "${content}". Return only the alt text, nothing else.`,
              plain_language: `Rewrite the following text at a Grade 6 reading level. Use short sentences, plain words, and active voice. Return only the rewritten text:\n\n${content}`
            }

            const start = Date.now()
            const response = await client.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 512,
              messages: [{ role: 'user', content: prompts[type] }]
            })
            const latency_ms = Date.now() - start

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ result: response.content[0].text, latency_ms }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [tailwindcss(), svelte(), apiMiddlewarePlugin()]
})
