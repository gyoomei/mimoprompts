# MimoPrompts

> **Curated prompt library optimized for Xiaomi MiMo V2.5.**
> Hand-tuned prompts for Chat, Reasoning, Image, and Speech models.
> Free, no signup, copy-paste ready.

🌐 **Live site:** https://gyoomei.github.io/mimoprompts
📦 **Source:** https://github.com/gyoomei/mimoprompts

---

## What this is

MimoPrompts is a static, client-side prompt library for the [Xiaomi MiMo V2.5 family](https://platform.xiaomimimo.com/). Every prompt has been:

- **Tuned for a specific MiMo model** — Chat, Reasoning, Image, or Speech
- **Tagged with use case** — when it's the right tool
- **Paired with recommended params** — temperature, max_tokens, voice, etc.
- **Tested for output quality** — and labeled with what good output looks like

Designed for developers building with MiMo via [Claude Code](https://www.anthropic.com/claude-code), [Cursor](https://cursor.sh), [OpenClaw](https://github.com/NousResearch/openclaw), or direct API calls.

---

## Why

The official MiMo docs cover the API surface. They don't cover **how to prompt MiMo well**.

Each model in the V2.5 family responds best to different prompt patterns:

| Model | Optimized for | Reward |
|---|---|---|
| **V2.5 Chat** | Direct instruction, structure-first | Speed, low cost |
| **V2.5 Reasoning** | Multi-step problem decomposition | Complex logic, RCA, deep analysis |
| **V2.5 Image** | Composition + lighting + lens vocabulary | Production-grade visuals |
| **V2.5 Speech** | Tone, pacing, emphasis cues | Natural-sounding TTS / accurate STT |

This library encodes those patterns so you don't have to discover them by trial and error.

---

## How to use

1. Open the [live site](https://gyoomei.github.io/mimoprompts)
2. Filter by model or category, or search by keyword
3. Click a prompt → expand to see system + user + params
4. Click **Copy** → paste into your API call, IDE, or chat client
5. Replace `{{placeholders}}` with your input

### Example: in code

```python
from openai import OpenAI

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

### Example: in Claude Code / Cursor

```
@mimoprompts solidity-audit-v2
```

(Coming soon — file an issue if you want this integration shipped.)

---

## Categories

| Category | Count | Best models |
|---|---|---|
| Coding | 7 | Reasoning, Chat |
| Web3 | 6 | Reasoning, Chat |
| Analysis | 4 | Reasoning |
| Writing | 5 | Chat |
| Reasoning | 3 | Reasoning |
| Image | 5 | Image |
| Speech | 3 | Speech |
| Agentic | 4 | Reasoning, Chat |
| Learning | 3 | Chat, Reasoning |
| Ops | 3 | Reasoning, Chat |

**Total: 43 prompts** (and growing).

---

## Contribute

Pull requests welcome. To add a prompt:

1. Fork this repo
2. Add an entry to `prompts.js` following the schema:

```js
{
  id: "my-prompt-slug",         // unique kebab-case
  title: "My prompt title",      // shown on the card
  category: "Coding",            // pick from existing or propose new
  model: "V2.5 Reasoning",       // exact model string
  useCase: "When to use this prompt — one line.",
  tags: ["python", "refactor"],
  params: { temperature: 0.3, max_tokens: 2000 },
  system: "Optional system message.",
  user: "Prompt body. Use {{placeholder}} for variables.",
  expectedOutput: "Brief description of what good output looks like."
}
```

3. Open a PR — we review and merge weekly

### Quality bar

- The prompt must be tested at least once with MiMo V2.5
- `useCase` must be a real, specific scenario — not "do X with AI"
- `params` must reflect what worked, not defaults
- Avoid duplication — search existing prompts first

---

## Roadmap

- [ ] Lunr.js full-text search index for offline use
- [ ] Tag cloud filter
- [ ] Per-prompt "share link" with deep-link to a specific prompt
- [ ] PR template and contribution checklist
- [ ] Translation: Indonesian, Chinese variants
- [ ] CLI: `npx mimoprompts <id>` to copy directly to clipboard
- [ ] VSCode extension: insert prompt at cursor

---

## Tech stack

- **Pure static** — HTML, CSS, vanilla JavaScript
- **Zero dependencies at runtime** — no npm install, no build step
- **Hosted on GitHub Pages** — free, fast, HTTPS by default
- **No telemetry, no cookies, no signup**

---

## License

MIT © [gyoomei](https://github.com/gyoomei)

Not affiliated with Xiaomi. **MiMo** is a trademark of Xiaomi Inc.

---

Built for the [Xiaomi MiMo Orbit 100T Token Creator Incentive Program](https://100t.xiaomimimo.com/).
