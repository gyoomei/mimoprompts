/**
 * MimoPrompts data file.
 * Each prompt is hand-tuned for Xiaomi MiMo V2.5 family.
 * Models: V2.5 Chat, V2.5 Reasoning, V2.5 Image, V2.5 Speech.
 *
 * Schema:
 *   id            unique slug
 *   title         short headline
 *   category      e.g. "Coding", "Web3", "Writing", "Analysis"
 *   model         exact MiMo model string
 *   useCase       one-line "when to use"
 *   tags          string array
 *   params        recommended sampling params
 *   system        optional system message
 *   user          prompt body, supports {{placeholder}}
 *   expectedOutput  what good output looks like
 */
const PROMPTS = [
  // === CODING ===
  {
    id: "solidity-audit-v2",
    title: "Solidity smart contract security audit",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Audit a Solidity contract for vulnerabilities before deployment.",
    tags: ["solidity", "security", "web3", "audit"],
    params: { temperature: 0.2, max_tokens: 4000 },
    system: "You are a senior Web3 security auditor. Be precise, cite line numbers, and rank findings by severity (Critical / High / Medium / Low / Informational).",
    user: "Audit this Solidity contract. List every security issue with: severity, line number, root cause, exploit scenario, fix recommendation, and a code snippet of the fix.\n\n```solidity\n{{contract_code}}\n```",
    expectedOutput: "Structured report with severity-ranked findings, each with line number, exploit walkthrough, and concrete fix code."
  },
  {
    id: "code-refactor-explain",
    title: "Refactor code with reasoning chain",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Refactor code while making the agent explain *why* each change matters.",
    tags: ["refactor", "code-review", "python", "javascript"],
    params: { temperature: 0.3, max_tokens: 3000 },
    system: "You refactor code with explicit reasoning. For each change: state the smell, the principle violated, the refactor applied, and the trade-off.",
    user: "Refactor this code. After the refactored version, list every change with: smell name, principle (SRP, DRY, etc.), refactor type (Extract Method, Rename, etc.), trade-off accepted.\n\n```{{language}}\n{{code}}\n```",
    expectedOutput: "Refactored code + change log table with smell/principle/refactor/trade-off columns."
  },
  {
    id: "bug-rca",
    title: "Bug root-cause analysis",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Diagnose why a bug happens — beyond the surface symptom.",
    tags: ["debugging", "rca", "production"],
    params: { temperature: 0.2, max_tokens: 2500 },
    system: "You diagnose bugs by hypothesis-driven reasoning. Propose 3-5 hypotheses, rank by likelihood, and recommend verification steps for each.",
    user: "Bug: {{description}}\n\nStack trace / error:\n```\n{{trace}}\n```\n\nRecent changes:\n{{recent_changes}}\n\nReproduce the bug if possible, then output: Hypotheses (ranked), Verification steps per hypothesis, Most likely root cause + fix.",
    expectedOutput: "Ranked hypothesis list, verification steps, and proposed fix with code."
  },
  {
    id: "test-generation",
    title: "Generate unit tests with edge cases",
    category: "Coding",
    model: "V2.5 Chat",
    useCase: "Generate complete unit test suite including edge cases.",
    tags: ["testing", "tdd", "edge-cases"],
    params: { temperature: 0.3, max_tokens: 3000 },
    system: "You write comprehensive unit tests. Always include: happy path, edge cases (null, empty, boundary), error cases, and concurrency cases when relevant.",
    user: "Write {{framework}} tests for this function. Cover happy path + at least 5 edge cases + 3 error cases.\n\n```{{language}}\n{{function_code}}\n```",
    expectedOutput: "Complete test file with 8-12+ test cases organized by scenario type."
  },
  {
    id: "regex-explained",
    title: "Build and explain a regex",
    category: "Coding",
    model: "V2.5 Chat",
    useCase: "Build a regex with a character-by-character explanation.",
    tags: ["regex", "string-parsing"],
    params: { temperature: 0.1, max_tokens: 1200 },
    user: "Build a regex that matches: {{description}}\n\nThen break it down character-by-character explaining what each piece does. Provide 3 matching strings and 3 non-matching strings as test cases.",
    expectedOutput: "Regex pattern + character-by-character explanation + 6 test cases (3 match, 3 fail)."
  },
  {
    id: "api-design-review",
    title: "REST/GraphQL API design review",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Review an API design before implementation.",
    tags: ["api", "rest", "graphql", "design"],
    params: { temperature: 0.3, max_tokens: 3000 },
    system: "You review API designs for consistency, REST/GraphQL best practices, error handling, versioning, and developer experience.",
    user: "Review this API design. Output: Strengths, Issues (severity-ranked), Specific endpoint suggestions, Versioning strategy, Error response shape recommendation.\n\n```\n{{api_spec}}\n```",
    expectedOutput: "Severity-ranked issues + concrete endpoint suggestions + error shape proposal."
  },
  {
    id: "sql-query-optimize",
    title: "Optimize a slow SQL query",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Speed up a slow query and explain the optimization.",
    tags: ["sql", "performance", "database"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Optimize this query. DB: {{db_engine}}. Table sizes: {{table_sizes}}.\n\n```sql\n{{query}}\n```\n\nOutput: optimized query, explanation of changes (index usage, join order, predicate pushdown), expected impact, indexes to add.",
    expectedOutput: "Optimized SQL + change explanation + recommended indexes."
  },

  // === WEB3 ===
  {
    id: "tx-decoder",
    title: "Decode a raw on-chain transaction",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Make sense of a raw transaction hash before signing or analyzing.",
    tags: ["web3", "evm", "transaction", "analysis"],
    params: { temperature: 0.2, max_tokens: 2000 },
    system: "You decode EVM transactions. Be precise about the contract being called, the function selector, the decoded args, and the side effects.",
    user: "Decode this transaction:\n\nChain: {{chain}}\nTx hash: {{tx_hash}}\nRaw input data: {{input_data}}\nValue: {{value}}\nFrom: {{from}}\nTo: {{to}}\n\nOutput: contract identity, function call (selector + name), decoded arguments, side effects, risk assessment, alternative actions if user is suspicious.",
    expectedOutput: "Decoded function call + argument breakdown + risk flags."
  },
  {
    id: "token-scam-check",
    title: "ERC-20 token scam check",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Decide if a token contract is safe to buy or hold.",
    tags: ["web3", "scam", "rugpull", "honeypot"],
    params: { temperature: 0.2, max_tokens: 2500 },
    system: "You analyze ERC-20 tokens for scam patterns: hidden mint, blacklist, transfer fee, ownership backdoor, honeypot logic. Be conservative — when in doubt, flag.",
    user: "Analyze this ERC-20 token contract for scam patterns. Output: Risk score (0-10), Red flags found, Honeypot probability, Owner privileges, Recommendation (avoid / caution / safe-ish).\n\n```solidity\n{{contract_code}}\n```",
    expectedOutput: "Risk score + red flags + honeypot analysis + actionable recommendation."
  },
  {
    id: "nft-metadata-gen",
    title: "Generate NFT collection metadata",
    category: "Web3",
    model: "V2.5 Chat",
    useCase: "Generate metadata.json for a complete NFT collection.",
    tags: ["nft", "metadata", "collection"],
    params: { temperature: 0.7, max_tokens: 4000 },
    user: "Generate metadata.json for {{count}} NFTs in collection '{{collection_name}}'. Theme: {{theme}}. Each token must have: name, description, image (use placeholder ipfs://CID/{n}.png), attributes array with traits ({{traits_to_use}}). Output as a JSON array.",
    expectedOutput: "Valid JSON array of NFT metadata objects with consistent trait distribution."
  },
  {
    id: "swap-route-analyze",
    title: "Analyze optimal DEX swap route",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Pick the best route for a swap across DEXes.",
    tags: ["dex", "swap", "defi"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Analyze swap: {{from_token}} → {{to_token}}, amount: {{amount}}, chain: {{chain}}.\n\nDEX liquidity snapshot:\n{{dex_data}}\n\nGas snapshot: {{gas_data}}\n\nOutput: best route (single or multi-hop), expected output amount, slippage estimate, gas cost, MEV risk, timing recommendation.",
    expectedOutput: "Recommended route + slippage + gas + MEV risk + timing advice."
  },
  {
    id: "wallet-approval-audit",
    title: "Wallet approval audit",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Review which contracts have spending approval on a wallet.",
    tags: ["web3", "approval", "security"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Audit wallet approvals. For each approval below, output: contract name + identity, approval amount (specific or unlimited), risk level, recommended action (revoke / reduce / keep).\n\n```\n{{approvals_list}}\n```\n\nPrioritize: unlimited approvals > unverified contracts > inactive protocols.",
    expectedOutput: "Risk-sorted approval list with revoke recommendations."
  },
  {
    id: "farcaster-cast-polish",
    title: "Polish a Farcaster cast",
    category: "Web3",
    model: "V2.5 Chat",
    useCase: "Turn rough thoughts into a high-engagement Farcaster cast.",
    tags: ["farcaster", "social", "writing"],
    params: { temperature: 0.7, max_tokens: 500 },
    system: "You write Farcaster casts. Voice: direct, technical, no hype. Max 320 chars. No marketing speak. One key idea per cast.",
    user: "Turn this rough thought into a polished cast. Constraint: max 320 chars, one key idea, no emoji unless adds meaning.\n\nThought: {{rough_thought}}",
    expectedOutput: "Single cast under 320 chars, focused on one idea."
  },

  // === ANALYSIS ===
  {
    id: "data-summary",
    title: "Summarize tabular data",
    category: "Analysis",
    model: "V2.5 Reasoning",
    useCase: "Extract insights from a CSV or table dump.",
    tags: ["data", "analysis", "csv"],
    params: { temperature: 0.3, max_tokens: 2500 },
    system: "You analyze tabular data. Surface the 5 most important findings, support each with a number, and call out any data quality issue.",
    user: "Analyze this data:\n\n```\n{{table_data}}\n```\n\nOutput: 5 key findings (each with supporting number), 2-3 unexpected patterns, data quality issues, recommended next analysis.",
    expectedOutput: "5 numbered findings, anomalies, data quality flags, follow-up questions."
  },
  {
    id: "log-anomaly",
    title: "Find anomalies in log file",
    category: "Analysis",
    model: "V2.5 Reasoning",
    useCase: "Spot the suspicious entries in a log dump.",
    tags: ["logs", "debugging", "ops"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Find anomalies in these logs. Output: timeline of suspicious events, root-cause hypothesis, severity assessment, immediate action.\n\n```\n{{log_dump}}\n```",
    expectedOutput: "Timeline + hypothesis + severity + action plan."
  },
  {
    id: "competitor-analysis",
    title: "Competitive landscape analysis",
    category: "Analysis",
    model: "V2.5 Reasoning",
    useCase: "Map competitors and find positioning gaps.",
    tags: ["business", "strategy", "research"],
    params: { temperature: 0.4, max_tokens: 3500 },
    user: "Analyze the competitive landscape for {{product_category}}. Players to compare: {{competitors}}. Output: feature matrix, pricing matrix, positioning gaps, my recommended angle for new entrant.",
    expectedOutput: "Feature matrix + pricing matrix + positioning gap analysis."
  },
  {
    id: "user-feedback-cluster",
    title: "Cluster user feedback into themes",
    category: "Analysis",
    model: "V2.5 Reasoning",
    useCase: "Turn raw user feedback into actionable themes.",
    tags: ["feedback", "ux", "product"],
    params: { temperature: 0.3, max_tokens: 3000 },
    user: "Cluster this user feedback into themes. For each theme: count, severity (P0-P3), example quote, recommended action.\n\n```\n{{feedback_dump}}\n```",
    expectedOutput: "Theme clusters with count, severity, example quote, action."
  },

  // === WRITING ===
  {
    id: "blog-from-bullets",
    title: "Bullet points → polished blog post",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Turn rough bullet points into a publishable post.",
    tags: ["blog", "writing", "content"],
    params: { temperature: 0.6, max_tokens: 3500 },
    system: "You write technical blogs. Voice: clear, direct, story-driven. Avoid corporate hype, exclamation marks, and bullet point dumps. Aim for 800-1200 words.",
    user: "Turn these bullets into a blog post. Title: {{title}}. Audience: {{audience}}. Tone: {{tone}}.\n\nBullets:\n{{bullets}}",
    expectedOutput: "800-1200 word post with strong intro, clear narrative, and concrete examples."
  },
  {
    id: "readme-generate",
    title: "Generate a great README from a repo",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Create a README that actually helps users adopt your project.",
    tags: ["readme", "docs", "open-source"],
    params: { temperature: 0.4, max_tokens: 3000 },
    user: "Write a README for project '{{project_name}}'.\n\nDescription: {{description}}\nKey features: {{features}}\nTech stack: {{stack}}\nInstall: {{install_cmd}}\nQuick start example: {{example}}\n\nStructure: badges, one-line description, features (concise), install, quick start, usage, contributing, license.",
    expectedOutput: "Complete README.md with all standard sections, no fluff."
  },
  {
    id: "email-cold-outreach",
    title: "Cold outreach email",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Write cold outreach that actually gets a reply.",
    tags: ["email", "outreach", "sales"],
    params: { temperature: 0.6, max_tokens: 800 },
    system: "You write cold outreach emails. Rules: under 120 words, one ask only, no corporate jargon, personalized opening tied to recipient's recent work.",
    user: "Recipient: {{name}}, {{role}} at {{company}}.\nWhat I noticed about them: {{observation}}\nMy ask: {{ask}}\nMy context: {{my_context}}\n\nWrite the email. 120 words max.",
    expectedOutput: "Personalized cold email under 120 words with one clear ask."
  },
  {
    id: "translate-zh-id",
    title: "Translate Chinese ↔ Indonesian (technical)",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Technical Chinese to Indonesian (or reverse) preserving terms.",
    tags: ["translation", "chinese", "indonesian"],
    params: { temperature: 0.3, max_tokens: 2000 },
    user: "Translate the following from {{source_lang}} to {{target_lang}}. Preserve technical terms (API names, library names, code) untranslated. Output the translation only.\n\n```\n{{source_text}}\n```",
    expectedOutput: "Faithful translation with technical terms preserved as in source."
  },
  {
    id: "submission-description",
    title: "Project submission description (1000-1200 chars)",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Write a concise project description for grant / accelerator submissions.",
    tags: ["submission", "grant", "description"],
    params: { temperature: 0.5, max_tokens: 1500 },
    system: "You write project submission descriptions. Style: natural paragraph flow, no bullet lists. Format: 'I built X. It does A, B, C. Deployed on Y, consuming Z.' Max 1200 chars. Action verbs. No marketing fluff.",
    user: "Project name: {{name}}\nWhat it does: {{what}}\nKey features: {{features}}\nTech stack: {{stack}}\nDeployment: {{deployment}}\nMetrics: {{metrics}}\n\nWrite the description. 1000-1200 chars.",
    expectedOutput: "Single paragraph 1000-1200 chars, action verbs, no bullets."
  },

  // === REASONING / MATH ===
  {
    id: "math-step-by-step",
    title: "Math problem with reasoning chain",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Solve a math problem with full reasoning trace.",
    tags: ["math", "reasoning", "stem"],
    params: { temperature: 0.1, max_tokens: 3000 },
    system: "You solve math problems by showing every step. Use LaTeX for equations. State assumptions explicitly. Verify the answer at the end.",
    user: "Solve: {{problem}}\n\nShow every step, state assumptions, verify the answer.",
    expectedOutput: "Step-by-step solution with LaTeX, assumptions stated, verification."
  },
  {
    id: "logic-puzzle",
    title: "Logic puzzle with deduction trace",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Solve a logic puzzle showing every deduction.",
    tags: ["logic", "puzzle", "reasoning"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Solve this puzzle. Show every deduction, the rule it derives from, and how you eliminated alternatives.\n\n{{puzzle}}",
    expectedOutput: "Deduction-by-deduction trace ending in unique solution."
  },
  {
    id: "decision-framework",
    title: "Decide between options with framework",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Make a structured decision between competing options.",
    tags: ["decision", "framework", "strategy"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Decide between these options: {{options}}\n\nContext: {{context}}\nConstraints: {{constraints}}\nGoal: {{goal}}\n\nUse a weighted scoring framework. Output: criteria + weights, scoring per option, winner, why, what would change the answer.",
    expectedOutput: "Weighted scoring matrix + recommendation + sensitivity note."
  },

  // === IMAGE ===
  {
    id: "image-product-shot",
    title: "Product shot (e-commerce)",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a clean e-commerce product image.",
    tags: ["image", "product", "ecommerce"],
    params: { size: "1024x1024", style: "photorealistic" },
    user: "Studio product photograph of {{product}}, on a clean white seamless background, soft three-point lighting, subtle drop shadow, eye-level angle, sharp focus, 50mm lens look, professional e-commerce photography.",
    expectedOutput: "1024x1024 clean product image suitable for e-commerce listing."
  },
  {
    id: "image-banner-promo",
    title: "Promo banner (Mini App / social)",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a clean promo banner with strong visual hierarchy.",
    tags: ["image", "banner", "promo", "social"],
    params: { size: "1500x1000", style: "modern" },
    user: "Modern promo banner for {{product_name}}. Tagline: '{{tagline}}'. Style: dark gradient background ({{accent_color}} accent), clean sans-serif typography, strong visual hierarchy with the product name as hero, subtle geometric accents, suitable for Farcaster Mini App splash screen, no stock-photo people, no clip art.",
    expectedOutput: "1500x1000 promo banner, dark theme, hero typography, strong hierarchy."
  },
  {
    id: "image-nft-card",
    title: "Premium NFT card / collectible",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a premium NFT collectible card.",
    tags: ["nft", "collectible", "image"],
    params: { size: "1024x1536", style: "premium" },
    user: "Premium collectible NFT card. Subject: {{subject}}. Style: dark luxe finish, gold or holographic foil accents, high-detail render, ornate border with subtle blockchain motif, central portrait composition, depth-of-field background blur. Composition: 2:3 vertical card, name banner top, attribute line bottom.",
    expectedOutput: "1024x1536 vertical NFT card with luxe finish and structured layout."
  },
  {
    id: "image-architecture-diagram",
    title: "Architecture diagram (clean isometric)",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a clean isometric architecture diagram.",
    tags: ["diagram", "architecture", "tech"],
    params: { size: "1536x1024", style: "isometric" },
    user: "Clean isometric architecture diagram showing: {{components}}. Connections labeled: {{connections}}. Style: flat colors, dark background, neon-accent edges, minimal labels in monospace font, no clip-art people, technical-publication grade.",
    expectedOutput: "Wide isometric diagram with labeled boxes and arrows."
  },
  {
    id: "image-pixel-icon",
    title: "Pixel-art app icon",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a pixel-art style app icon.",
    tags: ["pixel-art", "icon", "retro"],
    params: { size: "1024x1024", style: "pixel-art" },
    user: "Pixel-art app icon for {{app_concept}}. Constraints: 32x32 grid scaled up, NES-era 16-color palette, clean silhouette, readable at 64px, single subject centered, transparent or solid {{bg_color}} background. No anti-aliasing — true pixel edges.",
    expectedOutput: "1024x1024 pixel-art icon readable at small sizes, clean palette."
  },

  // === SPEECH ===
  {
    id: "speech-tts-narration",
    title: "TTS narration (calm, professional)",
    category: "Speech",
    model: "V2.5 Speech",
    useCase: "Convert a script into a calm, professional narration.",
    tags: ["tts", "narration", "podcast"],
    params: { voice: "professional-en", speed: 1.0, format: "mp3" },
    user: "Speak the following script in a calm, professional tone with natural pacing. Pause at paragraph breaks. Pronounce technical terms clearly.\n\nScript:\n{{script}}",
    expectedOutput: "MP3 narration with natural pacing and clear pronunciation."
  },
  {
    id: "speech-tts-energetic",
    title: "TTS energetic ad voice",
    category: "Speech",
    model: "V2.5 Speech",
    useCase: "Read a short ad script with high energy and emphasis.",
    tags: ["tts", "ad", "marketing"],
    params: { voice: "energetic-en", speed: 1.05, format: "mp3" },
    user: "Speak this ad script with energetic delivery. Emphasize the product name and the call-to-action. Keep it under 30 seconds.\n\nScript:\n{{script}}",
    expectedOutput: "MP3 ad voice with strong emphasis and CTA punch."
  },
  {
    id: "speech-stt-meeting",
    title: "Transcribe meeting + extract action items",
    category: "Speech",
    model: "V2.5 Speech",
    useCase: "Turn a meeting recording into transcript + action items.",
    tags: ["stt", "transcription", "meeting"],
    params: { language: "auto", diarize: true },
    user: "Transcribe this audio with speaker labels. After the transcript, extract: action items (each with owner and deadline if stated), decisions made, open questions.\n\n[audio file: {{audio_url}}]",
    expectedOutput: "Speaker-labeled transcript + action items table + decisions list."
  },

  // === AGENTIC / TOOLS ===
  {
    id: "tool-call-design",
    title: "Design tool calls for an agent task",
    category: "Agentic",
    model: "V2.5 Reasoning",
    useCase: "Plan tool calls for a complex agent task.",
    tags: ["agent", "tools", "planning"],
    params: { temperature: 0.3, max_tokens: 2500 },
    system: "You plan tool calls for autonomous agents. Output a precise sequence with: tool name, arguments, expected output, branching logic.",
    user: "Plan tool calls for goal: {{goal}}\n\nAvailable tools: {{tools_list}}\n\nOutput a numbered sequence: tool, args, expected output, on-failure branch.",
    expectedOutput: "Numbered tool-call plan with args, expected outputs, error branches."
  },
  {
    id: "claude-code-handoff",
    title: "Hand off context to Claude Code / Cursor",
    category: "Agentic",
    model: "V2.5 Chat",
    useCase: "Generate a precise handoff prompt for a coding agent.",
    tags: ["claude-code", "cursor", "handoff"],
    params: { temperature: 0.3, max_tokens: 1500 },
    user: "I'm handing off this task to Claude Code / Cursor. Generate a precise prompt that includes: goal, file paths, constraints, what NOT to change, success criteria, verification command.\n\nTask: {{task}}\nRepo: {{repo_path}}\nKnown constraints: {{constraints}}",
    expectedOutput: "Self-contained handoff prompt that another agent can execute without my context."
  },
  {
    id: "rag-rerank",
    title: "Rerank RAG search results",
    category: "Agentic",
    model: "V2.5 Reasoning",
    useCase: "Rerank semantic search results for relevance to a query.",
    tags: ["rag", "rerank", "search"],
    params: { temperature: 0.2, max_tokens: 1500 },
    user: "Query: {{query}}\n\nCandidates:\n{{candidates}}\n\nRerank by relevance. Output JSON: [{rank, id, score (0-1), reason}]",
    expectedOutput: "JSON array of reranked candidates with score and reason."
  },
  {
    id: "structured-output-json",
    title: "Force structured JSON output",
    category: "Agentic",
    model: "V2.5 Chat",
    useCase: "Extract structured data into a strict JSON schema.",
    tags: ["json", "extraction", "structured"],
    params: { temperature: 0.1, max_tokens: 1500, response_format: { type: "json_object" } },
    system: "You extract structured data. Output ONLY valid JSON matching the requested schema. No prose, no markdown.",
    user: "Extract from the text below into this schema:\n\n```json\n{{schema}}\n```\n\nText:\n```\n{{text}}\n```",
    expectedOutput: "Strict JSON object matching the requested schema, no markdown wrapper."
  },

  // === LEARNING / EDUCATION ===
  {
    id: "explain-like-engineer",
    title: "Explain a concept (engineer-friendly)",
    category: "Learning",
    model: "V2.5 Chat",
    useCase: "Explain a technical concept at engineer level.",
    tags: ["explain", "learning", "technical"],
    params: { temperature: 0.4, max_tokens: 2000 },
    user: "Explain {{concept}} for an engineer who knows {{prerequisite_knowledge}}. Cover: what it is, why it exists (problem solved), how it works (with example), trade-offs, common pitfalls, when to use vs avoid.",
    expectedOutput: "Engineer-level explanation with example, trade-offs, pitfalls."
  },
  {
    id: "concept-comparison",
    title: "Compare two concepts side-by-side",
    category: "Learning",
    model: "V2.5 Chat",
    useCase: "Compare two technical concepts for a decision.",
    tags: ["compare", "learning"],
    params: { temperature: 0.3, max_tokens: 2000 },
    user: "Compare {{concept_a}} vs {{concept_b}} side-by-side. Dimensions: definition, problem solved, trade-offs, when to pick each, common confusion. Output as a comparison table.",
    expectedOutput: "Side-by-side table covering 5 dimensions of comparison."
  },
  {
    id: "learn-new-tool",
    title: "Learning plan for a new tool",
    category: "Learning",
    model: "V2.5 Reasoning",
    useCase: "Generate a study plan for picking up a new tool fast.",
    tags: ["learning-plan", "study"],
    params: { temperature: 0.4, max_tokens: 2500 },
    user: "Create a learning plan for {{tool}}. My background: {{background}}. Time available: {{time_available}}. Output: prerequisites, day-by-day plan, hands-on exercises, milestone projects, common pitfalls to skip.",
    expectedOutput: "Day-by-day plan with exercises, projects, and pitfall warnings."
  },

  // === SYSTEM / OPS ===
  {
    id: "shell-from-intent",
    title: "Generate shell command from intent",
    category: "Ops",
    model: "V2.5 Chat",
    useCase: "Translate a plain-language intent to a precise shell command.",
    tags: ["shell", "bash", "ops"],
    params: { temperature: 0.1, max_tokens: 800 },
    system: "You translate intent to shell commands. Be precise about flags. Warn on destructive commands. Always show: command, what it does, gotchas.",
    user: "Intent: {{intent}}\nOS: {{os}}\nShell: {{shell}}",
    expectedOutput: "Command + explanation of flags + gotchas."
  },
  {
    id: "k8s-debug",
    title: "Debug a Kubernetes pod issue",
    category: "Ops",
    model: "V2.5 Reasoning",
    useCase: "Diagnose why a pod is failing.",
    tags: ["kubernetes", "ops", "debugging"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Pod symptom: {{symptom}}\n\nkubectl describe pod output:\n```\n{{describe_output}}\n```\n\nLogs:\n```\n{{pod_logs}}\n```\n\nDiagnose. Output: likely root cause(s), kubectl commands to verify, fix recommendation.",
    expectedOutput: "Root cause + verification kubectl + fix recommendation."
  },
  {
    id: "dockerfile-optimize",
    title: "Optimize a Dockerfile",
    category: "Ops",
    model: "V2.5 Reasoning",
    useCase: "Reduce image size and improve build speed.",
    tags: ["docker", "optimization"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Optimize this Dockerfile. Goals: smaller image, faster build, better layer caching, secure (non-root user).\n\n```dockerfile\n{{dockerfile}}\n```\n\nOutput: optimized Dockerfile, change list with reason, expected size before/after.",
    expectedOutput: "Optimized Dockerfile + change rationale + size estimate."
  }
];

// Expose to the page
if (typeof window !== "undefined") window.PROMPTS = PROMPTS;
if (typeof module !== "undefined") module.exports = PROMPTS;
