export const IMAGE_URL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
export const IMAGE_CONTEXT = 'A person using a screen reader on a laptop while an AI interface displays live image descriptions and simplified text alongside the original webpage'

export const JARGON_TEXT = `94.8% of the top one million websites fail basic accessibility standards. WebAIM's 2025 analysis found that pages using ARIA average 57 errors per page, compared to 27 for pages that don't use it — accessibility attributes applied incorrectly create more barriers than they remove. The standard response has been to layer retrofitted fixes on a broken foundation: bolting on screen reader compatibility post-launch, sprinkling ARIA attributes on codebases never designed to support them, and deferring structural remediation because it is more expensive than the original build. Multimodal AI changes the cost structure of this problem — not by making retrofitting cheaper, but by making the single fixed interface that needs to be retrofitted unnecessary. Models like Claude and Gemini accept any input and produce any output; the intelligence is constant, the format is a parameter. When accessibility is an architectural property rather than a feature, it is free at inference time.`

export const CAPTIONS = [
  { time: '0:00', text: 'Nearly 95% of top websites fail accessibility standards.', tone: '' },
  { time: '0:05', text: '[concerned] That means 1.3 billion people are shut out of the web.', tone: 'concerned' },
  { time: '0:11', text: 'Retrofitting has never worked at scale.', tone: '' },
  { time: '0:16', text: '[excited] But multimodal AI changes the cost structure entirely.', tone: 'excited' },
  { time: '0:22', text: 'The format becomes a parameter, not a design phase.', tone: '' },
  { time: '0:28', text: '[applause] 1.3 billion people deserve access. AI makes it possible today.', tone: 'applause' }
]

export const AUDIO_SUMMARY = `Most websites fail accessibility standards, shutting out 1.3 billion people with disabilities. Retrofitting does not work — pages using ARIA actually have more errors than those without it. Multimodal AI changes this by treating format as a parameter. The same content becomes alt text, plain language, audio, captions, or translations — all on demand. The technology exists today. The only thing left is the decision to use it.`

/** Per-toggle metadata: weighted score, WCAG criteria, who benefits, before/after labels */
export const TOGGLE_META = {
  altText: {
    key: 'altText',
    label: 'Alt text',
    icon: '🖼',
    points: 25,
    wcag: 'WCAG 1.1.1 — Non-text Content (Level A)',
    benefits: 'Blind & low-vision users, search engines',
    before: 'Image has no alt text — invisible to screen readers',
    after: 'AI-generated description conveys image meaning',
    explainer: `Claude analysed the image and wrote: "A person using a screen reader on a laptop while an AI panel shows live image descriptions and simplified text." — generated in 0.4s.`
  },
  plainLanguage: {
    key: 'plainLanguage',
    label: 'Plain language',
    icon: '📖',
    points: 20,
    wcag: 'WCAG 3.1.5 — Reading Level (Level AAA)',
    benefits: 'Cognitive disabilities, non-native speakers, low literacy',
    before: 'Grade 16 reading level — dense jargon, passive voice',
    after: 'Grade 6 reading level — same meaning, 40% fewer words',
    explainer: `Reading level dropped from Grade 16 to Grade 6. Same meaning, 40% fewer words.`
  },
  audio: {
    key: 'audio',
    label: 'Audio',
    icon: '🔊',
    points: 15,
    wcag: 'WCAG 1.1.1 — Non-text Content (Level A)',
    benefits: 'Blind users, low literacy, multitaskers',
    before: 'No audio alternative — text-only content',
    after: 'Spoken summary via Web Speech API',
    explainer: `60-second spoken summary generated from the article using Web Speech API.`
  },
  captions: {
    key: 'captions',
    label: 'Captions',
    icon: '💬',
    points: 20,
    wcag: 'WCAG 1.2.2 — Captions (Level A)',
    benefits: '466 million people with hearing loss',
    before: 'Video has no captions — audio content inaccessible',
    after: 'Expressive captions with tone and emotion markers',
    explainer: `Flat transcript → expressive captions with [concerned], [excited], [applause] markers.`
  },
  translation: {
    key: 'translation',
    label: 'Translation',
    icon: '🌐',
    points: 10,
    wcag: 'WCAG 3.1.1 — Language of Page (Level A)',
    benefits: '50M+ Europeans in non-native-language countries',
    before: 'English only — excludes non-English speakers',
    after: 'Translated to Dutch, Spanish, or French on demand',
    explainer: `Translated to Dutch. Claude supports 200+ languages — serving the 50 million Europeans whose primary language differs from their country's majority language.`
  },
  contrast: {
    key: 'contrast',
    label: 'Contrast',
    icon: '🔆',
    points: 10,
    wcag: 'WCAG 1.4.6 — Contrast Enhanced (Level AAA)',
    benefits: 'Low vision, aging eyes, bright environments',
    before: 'Contrast ratio 2.8:1 — fails WCAG AA',
    after: 'Contrast ratio 12.6:1 — passes WCAG AAA',
    explainer: `Contrast ratio improved from 2.8:1 to 12.6:1. Passes WCAG AAA.`
  }
}

export const MAX_SCORE = Object.values(TOGGLE_META).reduce((sum, t) => sum + t.points, 0)
