# AI Accessibility Demo

**94.8% of the top one million websites fail basic accessibility standards.**
That is not a rounding error — it is an average of 51 errors per page, locking out 1.3 billion people who live with a disability.

This project demonstrates how multimodal AI changes that equation: not by retrofitting faster, but by treating format as a parameter rather than a design decision.

---

## What it does

An interactive before/after demo built in Svelte. Six accessibility features can be toggled on and off in real time, each powered by AI or the browser's native APIs:

| Toggle             | What it fixes                                                                   | WCAG criterion                |
| ------------------ | ------------------------------------------------------------------------------- | ----------------------------- |
| **Alt text**       | Images with `alt=""` get AI-generated contextual descriptions via Claude Vision | 1.1.1 Non-text Content (A)    |
| **Plain language** | Grade 16 jargon is rewritten to Grade 6 reading level by Claude                 | 3.1.5 Reading Level (AAA)     |
| **Audio**          | A spoken article summary is generated via the Web Speech API                    | 1.1.1 Non-text Content (A)    |
| **Captions**       | Flat transcript becomes expressive captions with tone and emotion markers       | 1.2.2 Captions (A)            |
| **Translation**    | Content is translated to Dutch, Spanish, or French on demand                    | 3.1.1 Language of Page (A)    |
| **Contrast**       | Text contrast ratio raised from 2.8:1 (failing) to 12.6:1 (WCAG AAA)            | 1.4.6 Contrast Enhanced (AAA) |

Each toggle updates a live accessibility score and explains the before/after impact.

---

## Screen reader simulation

The **Screen Reader View** panel shows the accessibility tree as VoiceOver or NVDA would traverse it:

- **Readable nodes** — landmarks, headings, interactive controls (via `aria-label`), content, live regions, `sr-only` warnings
- **`⊘` aria-hidden nodes** — decorative elements that screen readers skip: status badges, icons, waveform bars, the video title, "Speech API" label, score ring child text
- **No duplicates** — `aria-label` on buttons and `role="meter"` on the score ring override their visible child text; only the accessible name is shown

The **Read aloud** button chains `SpeechSynthesisUtterance` calls node by node through the tree, highlighting each row as it is spoken — the same order a screen reader user would encounter in linear navigation.

---

## The core argument

Traditional software has one output channel. A website is pixels. If you cannot access that channel — because you are blind, have low literacy, use a slow connection, or are in a loud environment — the content is not for you.

Multimodal AI models like Anthropic's Claude accept any input and produce any output. Format becomes a response parameter, not a design phase. When accessibility is an architectural property rather than a feature, it is free at inference time.

The 94.8% failure rate is a failure of intent, not technology. The tools already exist.

---

## Tech stack

- [Svelte](https://svelte.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Anthropic Claude API](https://docs.anthropic.com) — alt text generation, plain language rewriting, translation
- Web Speech API — audio summary playback and screen reader simulation

---

## Running locally

```bash
npm install
npm run dev
```

---

## Further reading

- [The Web Was Never Built for Everyone — AI Is Fixing That](https://medium.com/@odere.pub) — Medium article on the architecture behind this demo
- [AI Is Giving 1.3 Billion People Access to the Web](https://www.linkedin.com/in/oleksander-derechei/) — LinkedIn article with production metrics

---

Built by [Oleksander Derechei](https://www.linkedin.com/in/oleksander-derechei/)
