<div align="center">

# MimoPrompts

**Production-ready prompt library for Xiaomi MiMo V2.5**

120+ hand-tuned prompts across Chat, Reasoning, Image, and Speech models.
Battle-tested for coding, Web3, security audits, content creation, and data analysis.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square&logo=github)](https://gyoomei.github.io/mimoprompts/)
[![Prompts](https://img.shields.io/badge/prompts-120%2B-orange?style=flat-square)](https://gyoomei.github.io/mimoprompts/)
[![Categories](https://img.shields.io/badge/categories-20-blue?style=flat-square)](#-categories)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![No Signup](https://img.shields.io/badge/signup-not%20required-purple?style=flat-square)](https://gyoomei.github.io/mimoprompts/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#-contributing)

[**Live Demo**](https://gyoomei.github.io/mimoprompts/) ·
[**Browse Prompts**](https://gyoomei.github.io/mimoprompts/) ·
[**Contribute**](#-contributing) ·
[**MiMo API**](https://platform.xiaomimimo.com/)

</div>

---

## ✨ What is MimoPrompts?

A static, client-side prompt library purpose-built for the [Xiaomi MiMo V2.5 model family](https://platform.xiaomimimo.com/). Every prompt is hand-tuned, model-aware, and copy-paste ready for production use.

**Built for developers** integrating MiMo into apps, agents, and workflows via [Claude Code](https://www.anthropic.com/claude-code), [Cursor](https://cursor.sh), [Hermes Agent](https://github.com/NousResearch/hermes-agent), or direct API calls.

---

## 🎯 Why MimoPrompts?

The official MiMo docs cover the API surface. They don't cover **how to prompt MiMo well** — and each model in the V2.5 family responds best to fundamentally different patterns.

| Model | Optimized for | Reward |
|---|---|---|
| **V2.5 Chat** | Direct instruction, structure-first | Speed, low cost, high throughput |
| **V2.5 Reasoning** | Multi-step decomposition, chain-of-thought | Complex logic, RCA, deep analysis |
| **V2.5 Image** | Composition, lighting, lens vocabulary | Production-grade visuals |
| **V2.5 Speech** | Tone, pacing, emphasis cues | Natural TTS, accurate STT |

This library encodes those patterns so you ship faster instead of iterating from scratch.

---

## 🚀 Quick Start

### Browse and copy

1. Open [the live site](https://gyoomei.github.io/mimoprompts/)
2. Search by keyword (`Ctrl+K`) or filter by model/category
3. Click a card to expand → see system + user + recommended params
4. Click **Copy** → paste into your API call
5. Replace `{{placeholders}}` with your data

### Use programmatically

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["MIMO_API_KEY"],
    base_url="https://platform.xiaomimimo.com/v1",
)

response = client.chat.completions.create(
    model="mimo-v2.5-reasoning",
    messages=[
        {"role": "system", "content": "You are a senior Web3 security auditor..."},
        {"role": "user", "content": "Audit this Solidity contract: ..."},
    ],
    temperature=0.2,
    max_tokens=4000,
)
```

### TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: 'https://platform.xiaomimimo.com/v1',
});

const completion = await client.chat.completions.create({
  model: 'mimo-v2.5-chat',
  messages: [
    { role: 'system', content: '...' },
    { role: 'user', content: '...' },
  ],
});
```

---

## 📚 Categories

**120 prompts across 20 categories**, organized by use case:

<table>
<tr>
<td>

**🛠️ Engineering**
- Coding (12)
- Web3 (11)
- Security (5)
- DevOps (4)
- Migration (5)
- Data (5)

</td>
<td>

**📊 Analysis & Reasoning**
- Reasoning (7)
- Analysis (6)
- Learning (7)
- Agentic (7)

</td>
<td>

**✍️ Content & Creative**
- Writing (9)
- Image (10)
- Speech (5)
- Creative (4)
- Marketing (5)

</td>
<td>

**💼 Productivity**
- Productivity (5)
- Email (4)
- Farcaster (4)
- Ops (3)
- Legal (2)

</td>
</tr>
</table>

### Distribution by model

```
V2.5 Reasoning  ████████████████████████████  63 prompts
V2.5 Chat       ███████████████████           42 prompts
V2.5 Image      ████                          10 prompts
V2.5 Speech     ██                             5 prompts
```

---

## 🔍 Featured prompts

| Prompt | Category | Model |
|---|---|---|
| Solidity smart contract security audit | Coding | Reasoning |
| Bug root-cause analysis | Coding | Reasoning |
| Wallet approval audit | Web3 | Reasoning |
| ERC-20 token scam check | Web3 | Reasoning |
| Generate unit tests with edge cases | Coding | Reasoning |
| Twitter/X thread from a topic | Writing | Chat |
| Cluster user feedback into themes | Analysis | Reasoning |
| Optimize a slow SQL query | Coding | Reasoning |
| Polish a Farcaster cast | Farcaster | Chat |
| Cold outreach email | Email | Chat |

[See all 120 →](https://gyoomei.github.io/mimoprompts/)

---

## 🎨 Features

- 🔍 **Smart search** — multi-word AND matching across title, tags, and prompt body
- ⌨️ **Keyboard shortcuts** — `Ctrl+K` to focus, `Esc` to clear
- 🏷️ **Faceted filters** — combine model + category + search
- ✨ **Live highlight** — search terms highlighted in real-time
- 📋 **One-click copy** — clipboard with visual confirmation
- 🌑 **Dark, glassmorphic UI** — optimized for desktop and mobile
- ⚡ **Zero dependencies** — pure HTML/CSS/JS, no build step
- 🔒 **No signup, no telemetry, no cookies** — just open and use

---

## 🤝 Contributing

Pull requests welcome. Add your battle-tested prompts to help the community.

### How to add a prompt

1. Fork this repository
2. Add an entry to [`prompts.js`](prompts.js) following the schema:

```js
{
  id: "my-prompt-slug",            // unique kebab-case
  title: "My Prompt Title",         // shown on the card
  category: "Coding",               // pick from existing or propose new
  model: "V2.5 Reasoning",          // V2.5 Chat | Reasoning | Image | Speech
  useCase: "When to use this — one specific scenario.",
  tags: ["python", "refactor"],
  params: { temperature: 0.3, max_tokens: 2000 },
  system: "Optional system message.",
  user: "Prompt body. Use {{placeholder}} for variables.",
  expectedOutput: "Brief description of what good output looks like."
}
```

3. Open a PR — we review and merge weekly

### Quality bar

- ✅ Prompt **tested at least once** with MiMo V2.5 (include a screenshot/output sample in PR)
- ✅ `useCase` is a **specific real scenario** — not generic ("do X with AI")
- ✅ `params` reflect **what worked**, not defaults
- ✅ Use `{{placeholders}}` for user-injectable variables
- ✅ Search existing prompts to avoid duplication
- ❌ No marketing fluff, no emoji-heavy outputs unless purposeful

---

## 🗺️ Roadmap

- [x] Multi-word smart search with highlight
- [x] Mobile UI overhaul (2x2 stats, scroll chips, safe-area aware)
- [x] Keyboard shortcuts (`Ctrl+K`, `Esc`)
- [ ] Per-prompt deep-link share URL (`?p=prompt-id`)
- [ ] Lunr.js full-text search index
- [ ] PR template + automated schema validation
- [ ] Indonesian / Chinese translations
- [ ] CLI: `npx mimoprompts <id>` to copy directly to clipboard
- [ ] VS Code extension: insert prompt at cursor
- [ ] Prompt versioning + changelog per prompt

---

## 🛠️ Tech Stack

- **Pure static** — HTML, CSS, vanilla JavaScript (no framework)
- **Zero runtime dependencies** — no npm install, no build step
- **Hosted on GitHub Pages** — free, fast, HTTPS, global CDN
- **No telemetry, no cookies, no analytics** — privacy by default
- **WCAG-aware** — semantic HTML, ARIA labels, keyboard navigation

### File structure

```
mimoprompts/
├── index.html         Entry point
├── styles.css         Dark glassmorphic theme + responsive
├── app.js             Search, filter, render, copy logic
├── prompts.js         All 120 prompt entries
└── README.md          You are here
```

---

## 📖 Related Resources

- [Xiaomi MiMo Platform](https://platform.xiaomimimo.com/) — official API docs and console
- [MiMo 100T Token Creator Program](https://100t.xiaomimimo.com/) — incentive program
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) — local AI agent framework
- [Claude Code](https://www.anthropic.com/claude-code) — Anthropic's CLI coding agent
- [Cursor](https://cursor.sh) — AI code editor

---

## 📄 License

[MIT](LICENSE) © [gyoomei](https://github.com/gyoomei)

> Not affiliated with Xiaomi. **MiMo** is a trademark of Xiaomi Inc.

---

<div align="center">

Built for the [Xiaomi MiMo Orbit 100T Token Creator Incentive Program](https://100t.xiaomimimo.com/) ·
Made by [@gyoomei](https://github.com/gyoomei)

⭐ **Star this repo** if MimoPrompts saved you prompt-engineering time.

</div>
