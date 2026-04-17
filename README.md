# accessibility-booster

> AI-powered accessibility layer for any webpage — six toggles, zero redesign required.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://odere-pro.github.io/accessibility-booster/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude API](https://img.shields.io/badge/Powered%20by-Claude%20API-orange)](https://docs.anthropic.com)
[![WCAG AAA](https://img.shields.io/badge/WCAG-AAA-green)](https://www.w3.org/WAI/WCAG22/quickref/)

**[Live demo →](https://odere-pro.github.io/accessibility-booster/)**

---

## The problem

**94.8% of the top one million websites fail basic accessibility standards** — an average of 51 errors per page, locking out 1.3 billion people who live with a disability.

Retrofitting is expensive. Redesigns take quarters. Most teams ship inaccessible experiences not from indifference but because the tooling makes accessibility a design-phase concern, not a runtime one.

---

## The approach

Multimodal AI models treat format as a parameter, not a constraint. accessibility-booster injects six AI-powered transforms at inference time — no redesign, no CMS changes, no new build pipeline.

---

## Six features

| Toggle | What it fixes | WCAG criterion | Tech |
|--------|--------------|----------------|------|
| **Alt text** | Images with `alt=""` get AI-generated contextual descriptions | 1.1.1 Non-text Content (A) | Claude Vision |
| **Plain language** | Grade 16 jargon rewritten to Grade 6 reading level | 3.1.5 Reading Level (AAA) | Claude |
| **Audio** | Spoken article summary generated on demand | 1.1.1 Non-text Content (A) | Web Speech API |
| **Captions** | Flat transcript → expressive captions with tone markers | 1.2.2 Captions (A) | Claude |
| **Translation** | Dutch, Spanish, or French on demand | 3.1.1 Language of Page (A) | Claude |
| **Contrast** | Text contrast raised from 2.8:1 (failing) to 12.6:1 (WCAG AAA) | 1.4.6 Contrast Enhanced (AAA) | CSS transform |

Each toggle updates a live accessibility score and shows the before/after impact.

---

## Screen reader simulation

The **Screen Reader View** panel shows the accessibility tree as VoiceOver or NVDA would traverse it:

- **Readable nodes** — landmarks, headings, interactive controls (via `aria-label`), content, live regions, `sr-only` warnings
- **`⊘` aria-hidden nodes** — decorative elements that screen readers skip
- **Read aloud** — chains `SpeechSynthesisUtterance` calls node by node, highlighting each row as it is spoken

---

## Quick start

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Without the API key, the demo runs on pre-generated responses so the toggles still work.

---

## Tech stack

- [Svelte](https://svelte.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Anthropic Claude API](https://docs.anthropic.com) — alt text, plain language, captions, translation
- Web Speech API — audio summary and screen reader simulation

---

## Why architecture, not retrofit

Traditional software has one output channel. A website is pixels. If you cannot access that channel — because you are blind, have low literacy, use a slow connection, or are in a loud environment — the content is not for you.

Multimodal AI models accept any input and produce any output. Format becomes a response parameter, not a design phase. When accessibility is an architectural property rather than a feature, it is free at inference time.

The 94.8% failure rate is a failure of intent, not technology. The tools already exist.

---

## Related

- [The Web Was Never Built for Everyone — AI Is Fixing That](https://medium.com/@odere.pub) — Medium article on the architecture behind this demo
- [AI Is Giving 1.3 Billion People Access to the Web](https://www.linkedin.com/in/oleksander-derechei/) — LinkedIn article with production metrics

---

## License

MIT — see [LICENSE](LICENSE)

Built by [Oleksander Derechei](https://www.linkedin.com/in/oleksander-derechei/)
