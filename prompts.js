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
  },

  // === EXPANSION: more Coding ===
  {
    id: "rust-borrow-fix",
    title: "Fix Rust borrow checker errors",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Resolve borrow checker / lifetime errors with explanation.",
    tags: ["rust", "borrow-checker", "lifetime"],
    params: { temperature: 0.2, max_tokens: 2500 },
    system: "You teach Rust ownership and lifetimes through concrete fixes. Always explain why the borrow checker complained, then apply the minimal fix.",
    user: "Fix the borrow checker error in this Rust code. Output: error explanation, minimal fix, alternative fixes (Rc/RefCell, clone, restructure), trade-off of each.\n\n```rust\n{{code}}\n```\n\nError:\n```\n{{error}}\n```",
    expectedOutput: "Error explanation + minimal fix + alternatives with trade-offs."
  },
  {
    id: "go-concurrency-review",
    title: "Review Go concurrency code",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Audit Go code for race conditions, deadlocks, goroutine leaks.",
    tags: ["go", "concurrency", "goroutine"],
    params: { temperature: 0.2, max_tokens: 2500 },
    system: "You audit Go concurrency. Look for: race conditions, deadlocks, goroutine leaks, channel misuse, missing context cancellation, unbounded goroutine spawn.",
    user: "Audit this Go code for concurrency issues. Output: each issue with severity, line number, root cause, fix code.\n\n```go\n{{code}}\n```",
    expectedOutput: "Severity-ranked concurrency issues with fixes."
  },
  {
    id: "typescript-types-tighten",
    title: "Tighten TypeScript types (no any)",
    category: "Coding",
    model: "V2.5 Chat",
    useCase: "Remove `any`, add precise generics, narrow union types.",
    tags: ["typescript", "types", "refactor"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Tighten the TypeScript types in this code. Goals: zero `any`, precise generics, exhaustive union narrowing, strict null checks. Output: refactored code + diff explanation.\n\n```typescript\n{{code}}\n```",
    expectedOutput: "Strictly typed version + line-by-line diff explanation."
  },
  {
    id: "code-translate-langs",
    title: "Translate code between languages",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Port code from one language to another with idiomatic equivalents.",
    tags: ["porting", "translation", "polyglot"],
    params: { temperature: 0.3, max_tokens: 3000 },
    user: "Translate this {{source_lang}} code to idiomatic {{target_lang}}. Preserve behavior. Use {{target_lang}} idioms (not literal translation). Output: target code + idiom-mapping table (source pattern → target pattern).\n\n```{{source_lang}}\n{{code}}\n```",
    expectedOutput: "Idiomatic target-language code + idiom-mapping table."
  },
  {
    id: "ci-pipeline-design",
    title: "Design a CI/CD pipeline",
    category: "Coding",
    model: "V2.5 Reasoning",
    useCase: "Design GitHub Actions / GitLab CI pipeline for a project.",
    tags: ["ci", "github-actions", "devops"],
    params: { temperature: 0.3, max_tokens: 3000 },
    user: "Design a {{platform}} CI/CD pipeline for: {{project_type}}. Stages I want: {{stages}}. Constraints: {{constraints}}.\n\nOutput: complete YAML, stage-by-stage explanation, secret management notes, expected duration.",
    expectedOutput: "Complete pipeline YAML + stage explanation + secrets guidance."
  },

  // === EXPANSION: more Web3 / DeFi ===
  {
    id: "mev-bundle-analysis",
    title: "MEV bundle analysis",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Analyze a Flashbots-style MEV bundle for profitability and risk.",
    tags: ["mev", "flashbots", "defi"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Analyze this MEV bundle. Output: strategy classification (sandwich/arb/liquidation), profit estimate, gas burn, failure risk, frontrun risk, alternative bundle ordering.\n\nBundle:\n{{bundle_data}}\n\nMempool snapshot: {{mempool}}",
    expectedOutput: "Strategy classification + P&L estimate + risk breakdown."
  },
  {
    id: "defi-strategy-yield",
    title: "Yield strategy comparator",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Compare yield strategies on a given asset across protocols.",
    tags: ["defi", "yield", "strategy"],
    params: { temperature: 0.3, max_tokens: 3000 },
    user: "Compare yield strategies for {{asset}} on {{chain}}. Protocols: {{protocols}}. Capital: {{capital}}.\n\nOutput: APY breakdown (real vs nominal), impermanent loss exposure, smart contract risk score, exit liquidity, recommended split.",
    expectedOutput: "APY comparison table + risk-adjusted recommendation."
  },
  {
    id: "ens-name-research",
    title: "ENS / wallet history research",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Research a wallet or ENS — activity patterns, associations.",
    tags: ["ens", "wallet", "research"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Research wallet {{address_or_ens}} on {{chain}}. Snapshot data: {{onchain_data}}.\n\nOutput: activity profile (DEX trader / NFT collector / yield farmer / dev / other), notable interactions, risk flags, suspected role in ecosystem.",
    expectedOutput: "Wallet profile with activity classification and risk flags."
  },
  {
    id: "solana-program-review",
    title: "Solana program (Rust/Anchor) review",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Audit a Solana program for security and best practices.",
    tags: ["solana", "anchor", "rust", "audit"],
    params: { temperature: 0.2, max_tokens: 4000 },
    system: "You audit Solana programs. Look for: account validation gaps, signer checks, PDA derivation correctness, lamport handling, CPI re-entrancy, owner validation.",
    user: "Audit this Solana program. Output severity-ranked findings with line number, root cause, exploit, fix.\n\n```rust\n{{program_code}}\n```",
    expectedOutput: "Severity-ranked findings specific to Solana attack surface."
  },
  {
    id: "airdrop-eligibility-check",
    title: "Airdrop eligibility check",
    category: "Web3",
    model: "V2.5 Reasoning",
    useCase: "Check a wallet against published airdrop criteria.",
    tags: ["airdrop", "eligibility"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Check if wallet {{wallet}} qualifies for {{airdrop_name}}. Criteria:\n{{criteria}}\n\nWallet on-chain data:\n{{onchain_data}}\n\nOutput: per-criterion check (pass/fail/partial), final eligibility score, what to do if not eligible (e.g. last-minute qualifying actions).",
    expectedOutput: "Per-criterion checklist + eligibility verdict + remediation steps."
  },

  // === EXPANSION: Marketing / Product ===
  {
    id: "tweet-thread",
    title: "Twitter / X thread from a topic",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Turn a single insight into a coherent X thread (5-10 posts).",
    tags: ["twitter", "x", "thread", "social"],
    params: { temperature: 0.6, max_tokens: 2000 },
    system: "You write X threads. Voice: punchy, no hype, no emoji unless it adds meaning. Each post stands alone but builds on the last. First post is a hook. Last post is a clear takeaway or CTA.",
    user: "Topic: {{topic}}\nKey insight: {{insight}}\nAudience: {{audience}}\nLength: {{post_count}} posts.\n\nWrite the thread. Number each post. Each under 280 chars.",
    expectedOutput: "Numbered thread with strong hook, building narrative, clear close."
  },
  {
    id: "product-launch-copy",
    title: "Product launch copy",
    category: "Writing",
    model: "V2.5 Chat",
    useCase: "Write launch copy: headline, subhead, 3 features, CTA.",
    tags: ["launch", "copywriting", "marketing"],
    params: { temperature: 0.6, max_tokens: 1500 },
    user: "Product: {{product_name}}\nWhat it does: {{description}}\nKey value: {{value_prop}}\nAudience: {{audience}}\nTone: {{tone}}\n\nWrite: hero headline (max 8 words), subhead (max 18 words), 3 feature cards (title + 1-line benefit), CTA button text. No corporate fluff.",
    expectedOutput: "Hero headline + subhead + 3 feature cards + CTA."
  },
  {
    id: "user-persona-build",
    title: "Build a user persona",
    category: "Writing",
    model: "V2.5 Reasoning",
    useCase: "Create a detailed user persona from raw research notes.",
    tags: ["product", "ux", "persona"],
    params: { temperature: 0.4, max_tokens: 2500 },
    user: "Build a user persona from this research:\n{{research_notes}}\n\nOutput: name (fictitious), role, demographics, goals, pain points, behaviors, tools they use, quote that captures their voice, jobs-to-be-done.",
    expectedOutput: "Structured persona document ready for product team."
  },
  {
    id: "feature-prd",
    title: "Write a feature PRD",
    category: "Writing",
    model: "V2.5 Reasoning",
    useCase: "Convert an idea into a 1-pager PRD.",
    tags: ["prd", "product", "spec"],
    params: { temperature: 0.4, max_tokens: 3500 },
    user: "Feature: {{feature_name}}\nProblem: {{problem}}\nProposed solution: {{solution}}\nConstraints: {{constraints}}\n\nWrite a 1-page PRD. Sections: Problem, Goals, Non-goals, User stories, Acceptance criteria, Open questions, Risks, Success metrics.",
    expectedOutput: "1-page PRD with all sections populated."
  },

  // === EXPANSION: more Image ===
  {
    id: "image-character-portrait",
    title: "Character portrait (concept art)",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a character concept art portrait.",
    tags: ["character", "concept-art", "portrait"],
    params: { size: "1024x1536", style: "concept-art" },
    user: "Concept-art portrait. Character: {{character_description}}. Style: {{art_style}} (e.g. studio Ghibli, cyberpunk noir, painterly). Lighting: {{lighting}} (e.g. cinematic rim light, soft volumetric, dramatic chiaroscuro). Background: subtle blur, complementary palette. Composition: 3/4 angle, expressive face, detailed costume.",
    expectedOutput: "1024x1536 portrait with strong character presence and chosen art style."
  },
  {
    id: "image-logo-mark",
    title: "Minimal logo mark",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a clean minimal logo mark.",
    tags: ["logo", "branding", "minimal"],
    params: { size: "1024x1024", style: "vector-clean" },
    user: "Minimal logo mark for '{{brand_name}}'. Concept: {{concept}}. Style: clean geometric vector, single weight, scalable from 16px to billboard, monochrome on transparent / solid background, no gradient, no drop shadow, no text. Inspired by best-in-class logos (Stripe, Linear, Vercel).",
    expectedOutput: "1024x1024 minimal vector logo mark, scalable, monochrome."
  },
  {
    id: "image-3d-render",
    title: "3D product render",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a polished 3D product render.",
    tags: ["3d", "render", "product"],
    params: { size: "1536x1024", style: "3d-cinema4d" },
    user: "Cinema4D-style 3D product render of {{product}}. Material: {{material}}. Lighting: studio HDR with soft shadows. Background: gradient {{bg_color}}. Camera: 35mm equivalent, slight low angle, shallow depth of field. Polished e-commerce hero look.",
    expectedOutput: "1536x1024 polished 3D render suitable for hero section."
  },
  {
    id: "image-storybook-scene",
    title: "Children's storybook scene",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Generate a children's book illustration.",
    tags: ["illustration", "storybook", "children"],
    params: { size: "1536x1024", style: "watercolor" },
    user: "Children's storybook illustration. Scene: {{scene_description}}. Style: warm watercolor with soft edges, friendly characters with expressive eyes, pastel palette, hand-drawn feel, no harsh outlines, age 4-8 audience. Composition: rule of thirds, clear focal character.",
    expectedOutput: "Wide watercolor illustration with warm storybook charm."
  },

  // === EXPANSION: more Speech / Multimodal ===
  {
    id: "speech-podcast-edit",
    title: "Podcast transcript clean-up",
    category: "Speech",
    model: "V2.5 Speech",
    useCase: "Clean a raw podcast transcript: remove filler, structure topics.",
    tags: ["podcast", "transcript", "cleanup"],
    params: { language: "auto", diarize: true, cleanup: true },
    user: "Clean this raw transcript: remove filler words (um, uh, you know), fix obvious mistranscriptions, group into topical sections with timestamps, generate chapter titles, extract pull-quotes.\n\n[audio: {{audio_url}}]",
    expectedOutput: "Cleaned transcript with chapters, timestamps, and pull-quotes."
  },
  {
    id: "speech-voice-clone-script",
    title: "TTS voice clone script formatting",
    category: "Speech",
    model: "V2.5 Speech",
    useCase: "Format a script for high-fidelity voice cloning TTS.",
    tags: ["voice-clone", "tts", "ssml"],
    params: { voice: "cloned", format: "wav" },
    user: "Format this script for high-fidelity voice clone TTS. Add SSML pacing: <break> tags at natural pauses, <emphasis> on key words, <prosody> for tone shifts. Mark proper noun pronunciation if non-obvious.\n\nScript:\n{{script}}",
    expectedOutput: "SSML-formatted script with natural pacing and emphasis."
  },

  // === EXPANSION: Agentic / Advanced ===
  {
    id: "agent-replan-on-failure",
    title: "Replan when an agent step fails",
    category: "Agentic",
    model: "V2.5 Reasoning",
    useCase: "Generate a replan when a tool call returns an error.",
    tags: ["agent", "replan", "error-recovery"],
    params: { temperature: 0.3, max_tokens: 2000 },
    user: "Original goal: {{goal}}\nPlan so far: {{steps_done}}\nFailed step: {{failed_step}}\nError: {{error}}\n\nGenerate a replan. Output: root cause hypothesis, alternative path (3 options ranked), chosen path with first 2 steps, fallback if alternative also fails.",
    expectedOutput: "Root cause + ranked alternatives + chosen path + fallback."
  },
  {
    id: "agent-self-critique",
    title: "Self-critique an agent output",
    category: "Agentic",
    model: "V2.5 Reasoning",
    useCase: "Have the agent critique its own answer before returning.",
    tags: ["self-critique", "quality", "agent"],
    params: { temperature: 0.3, max_tokens: 2000 },
    system: "You critique outputs harshly but constructively. List specific weaknesses, not generalities. Then propose a stronger version.",
    user: "Original prompt:\n{{prompt}}\n\nMy answer:\n{{answer}}\n\nCritique it. Output: 3-5 specific weaknesses (each with evidence quote), revised stronger answer, what changed and why.",
    expectedOutput: "Specific critique + revised answer + change rationale."
  },
  {
    id: "memory-summarize-context",
    title: "Summarize context for next turn",
    category: "Agentic",
    model: "V2.5 Chat",
    useCase: "Compress long conversation history into a context block.",
    tags: ["memory", "compression", "context"],
    params: { temperature: 0.3, max_tokens: 1500 },
    user: "Summarize this conversation history into a tight context block for the next turn. Preserve: user goals, decisions made, open questions, important facts, current state. Cut: acknowledgments, repeated info.\n\nHistory:\n{{history}}",
    expectedOutput: "Tight context block with goals, decisions, open questions, state."
  },

  // === EXPANSION: Reasoning ===
  {
    id: "first-principles-breakdown",
    title: "Break a problem to first principles",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Strip a problem to its irreducible components.",
    tags: ["first-principles", "reasoning"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Problem: {{problem}}\n\nBreak this down to first principles. Steps: (1) state assumptions challenged, (2) decompose into atomic truths, (3) rebuild a solution from those truths, (4) compare vs conventional solution, (5) what changes if you remove any single truth.",
    expectedOutput: "First-principles decomposition + reconstructed solution + sensitivity."
  },
  {
    id: "second-order-effects",
    title: "Second-order effects analysis",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Predict downstream consequences of a decision.",
    tags: ["second-order", "consequences", "strategy"],
    params: { temperature: 0.4, max_tokens: 2500 },
    user: "Decision: {{decision}}\nContext: {{context}}\n\nAnalyze second-order effects. Output: immediate effect, second-order effects (3-5), third-order effects (most impactful), unintended consequences, mitigation if any go wrong.",
    expectedOutput: "Cascading effects analysis with mitigation."
  },

  // === EXPANSION: Learning ===
  {
    id: "feynman-explain",
    title: "Explain it like I'm 12 (Feynman)",
    category: "Learning",
    model: "V2.5 Chat",
    useCase: "Explain a complex topic in plain language without losing accuracy.",
    tags: ["feynman", "explain", "simple"],
    params: { temperature: 0.4, max_tokens: 2000 },
    user: "Explain {{concept}} like I'm a smart 12-year-old. Use everyday analogies. No jargon. After the explanation, list the technical terms I should learn next and what each means in one sentence.",
    expectedOutput: "Plain-language explanation + glossary of next-level terms."
  },
  {
    id: "anki-cards",
    title: "Generate Anki flashcards from notes",
    category: "Learning",
    model: "V2.5 Chat",
    useCase: "Convert study notes into Anki flashcards.",
    tags: ["anki", "flashcards", "study"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Convert these notes into Anki flashcards. Format: question | answer (one per line). Use cloze deletion for definitions. Aim for atomic cards (one fact each). 15-30 cards.\n\nNotes:\n{{notes}}",
    expectedOutput: "Pipe-separated Anki flashcards, atomic and clear."
  },
  // === MARKETING / GROWTH ===
  {
    id: "landing-page-copy",
    title: "Landing page hero copy",
    category: "Marketing",
    model: "V2.5 Chat",
    useCase: "Generate hero section copy for a landing page.",
    tags: ["landing-page", "copywriting", "saas"],
    params: { temperature: 0.6, max_tokens: 1200 },
    system: "You write landing page copy. Rules: hero headline under 10 words, subheadline under 25 words, no jargon, lead with the customer outcome not the feature, one primary CTA.",
    user: "Product: {{product_name}}\nWhat it does: {{description}}\nTarget user: {{audience}}\nBiggest pain it solves: {{pain_point}}\nDifferentiator: {{differentiator}}\n\nGenerate 3 hero variations: headline, subheadline, primary CTA, secondary CTA, 3 benefit bullets.",
    expectedOutput: "3 hero variations with headline + sub + CTAs + benefit bullets."
  },
  {
    id: "tweet-thread-marketing",
    title: "Twitter/X thread from a topic",
    category: "Marketing",
    model: "V2.5 Chat",
    useCase: "Turn a single idea into an 8-tweet thread.",
    tags: ["twitter", "thread", "social"],
    params: { temperature: 0.7, max_tokens: 1500 },
    system: "You write Twitter threads. Rules: hook in first tweet, one idea per tweet, no emoji unless adds meaning, max 280 chars per tweet, end with a CTA or memorable line.",
    user: "Topic: {{topic}}\nAngle: {{angle}}\nTone: {{tone}}\n\nWrite an 8-tweet thread.",
    expectedOutput: "8 tweets numbered 1-8, each under 280 chars, strong hook, clear CTA."
  },
  {
    id: "value-prop-canvas",
    title: "Value proposition canvas",
    category: "Marketing",
    model: "V2.5 Reasoning",
    useCase: "Map customer jobs/pains/gains to product features/relievers/creators.",
    tags: ["positioning", "value-prop", "strategy"],
    params: { temperature: 0.4, max_tokens: 2500 },
    user: "Product: {{product}}\nTarget segment: {{segment}}\n\nFill a value proposition canvas:\n- Customer jobs (functional, social, emotional)\n- Customer pains (severity ranked)\n- Customer gains (importance ranked)\n- Pain relievers (per pain)\n- Gain creators (per gain)\n- Products & services (per job)\n\nThen output a one-sentence value prop in the format: 'For [segment] who [need], our [product] is a [category] that [unique benefit] unlike [alternative].'",
    expectedOutput: "Filled VP canvas + one-sentence value prop."
  },
  {
    id: "growth-experiment-list",
    title: "Growth experiment backlog",
    category: "Marketing",
    model: "V2.5 Reasoning",
    useCase: "Generate a prioritized list of growth experiments.",
    tags: ["growth", "experiment", "ICE"],
    params: { temperature: 0.5, max_tokens: 2500 },
    user: "Product: {{product}}\nCurrent funnel: {{funnel_data}}\nMetric to improve: {{north_star}}\nResources: {{resources}}\n\nGenerate 10 growth experiments. For each: hypothesis, variant, success metric, ICE score (Impact 1-10, Confidence 1-10, Ease 1-10), estimated effort.",
    expectedOutput: "10 ranked experiments with ICE scores and clear hypotheses."
  },
  {
    id: "press-release",
    title: "Product launch press release",
    category: "Marketing",
    model: "V2.5 Chat",
    useCase: "Draft a press release for a product launch.",
    tags: ["pr", "press-release", "launch"],
    params: { temperature: 0.5, max_tokens: 1800 },
    user: "Product: {{product}}\nLaunch date: {{date}}\nKey features: {{features}}\nTraction or proof points: {{proof}}\nFounder quote angle: {{quote_angle}}\nContact: {{contact}}\n\nWrite a press release. Format: headline, dateline, lead paragraph (5W1H), body (2-3 paragraphs with quote), boilerplate, contact.",
    expectedOutput: "Standard press release format with strong lead and quote."
  },

  // === EMAIL / OUTREACH ===
  {
    id: "investor-update",
    title: "Monthly investor update",
    category: "Email",
    model: "V2.5 Chat",
    useCase: "Write a monthly update to investors.",
    tags: ["investor", "update", "founders"],
    params: { temperature: 0.4, max_tokens: 1800 },
    system: "You write investor updates. Format: TLDR top, sections (Wins, Lowlights, Asks, Metrics, Roadmap). Be honest about lowlights. Specific asks beat vague ones.",
    user: "Company: {{company}}\nMonth: {{month}}\nWins: {{wins}}\nLowlights: {{lowlights}}\nMetrics changes: {{metrics}}\nNext month plan: {{plan}}\nAsks: {{asks}}\n\nWrite the update.",
    expectedOutput: "Structured update with TLDR, sections, honest lowlights, specific asks."
  },
  {
    id: "follow-up-no-reply",
    title: "Follow-up after silence",
    category: "Email",
    model: "V2.5 Chat",
    useCase: "Write a follow-up email when the prospect went silent.",
    tags: ["email", "follow-up", "sales"],
    params: { temperature: 0.6, max_tokens: 600 },
    system: "You write follow-up emails after silence. Tone: respectful, not pushy. Add new value (insight, question, resource). Keep it under 80 words. Make it easy to say no.",
    user: "Original ask: {{original_ask}}\nLast contact date: {{date}}\nWhat I know about them since: {{new_context}}\n\nWrite the follow-up.",
    expectedOutput: "Respectful follow-up under 80 words with new value and easy-out."
  },
  {
    id: "interview-outreach",
    title: "User research interview request",
    category: "Email",
    model: "V2.5 Chat",
    useCase: "Cold email asking for a 20-min user interview.",
    tags: ["user-research", "interview", "email"],
    params: { temperature: 0.5, max_tokens: 600 },
    user: "Recipient: {{name}}, {{role}} at {{company}}\nMy product: {{product}}\nWhy them: {{reason}}\nIncentive (if any): {{incentive}}\n\nWrite a 90-word cold email asking for a 20-minute call. Include 1 specific insight question they'd recognize.",
    expectedOutput: "90-word email with specific recognition and clear small ask."
  },
  {
    id: "feedback-decline",
    title: "Decline a feature request politely",
    category: "Email",
    model: "V2.5 Chat",
    useCase: "Politely decline a feature request without burning the relationship.",
    tags: ["customer", "support", "decline"],
    params: { temperature: 0.4, max_tokens: 600 },
    system: "You decline feature requests politely. Acknowledge the underlying need, explain the trade-off, offer a workaround if possible. Never sound dismissive.",
    user: "Feature requested: {{feature}}\nUser context: {{user_context}}\nReason we won't build: {{reason}}\nAvailable workaround (if any): {{workaround}}\n\nWrite the response.",
    expectedOutput: "Empathetic decline with trade-off explanation and workaround."
  },

  // === PRODUCTIVITY / PERSONAL ===
  {
    id: "meeting-prep",
    title: "Meeting prep brief",
    category: "Productivity",
    model: "V2.5 Reasoning",
    useCase: "Generate a one-page brief before an important meeting.",
    tags: ["meeting", "prep", "executive"],
    params: { temperature: 0.4, max_tokens: 1500 },
    user: "Meeting: {{meeting_topic}}\nWith: {{attendees}}\nMy goal: {{my_goal}}\nTheir likely goal: {{their_goal}}\nContext I have: {{context}}\nBackground I'm missing: {{gaps}}\n\nGenerate a one-page brief: objectives, key questions to ask, anticipated objections + responses, decision points, next steps if it goes well, next steps if it goes poorly.",
    expectedOutput: "One-page brief with objectives, questions, objections, contingencies."
  },
  {
    id: "weekly-review",
    title: "Weekly review template",
    category: "Productivity",
    model: "V2.5 Chat",
    useCase: "Run a structured weekly review.",
    tags: ["weekly", "review", "GTD"],
    params: { temperature: 0.4, max_tokens: 1500 },
    user: "Week of {{week_dates}}\n\nMy raw notes:\n{{raw_notes}}\n\nGenerate a weekly review: completed wins, dropped items + why, energy/focus assessment, top 3 priorities for next week, lessons captured, questions to revisit.",
    expectedOutput: "Structured weekly review with wins, drops, priorities, lessons."
  },
  {
    id: "decision-journal",
    title: "Decision journal entry",
    category: "Productivity",
    model: "V2.5 Reasoning",
    useCase: "Capture a decision so you can learn from it later.",
    tags: ["decision", "journal", "learning"],
    params: { temperature: 0.3, max_tokens: 1500 },
    user: "Decision: {{decision}}\nContext: {{context}}\nOptions considered: {{options}}\nWhat I chose: {{choice}}\nWhy: {{rationale}}\nWhat I expect to happen: {{expected_outcome}}\nWhen to revisit: {{review_date}}\n\nFormat as a decision journal entry suitable for a 3-month review.",
    expectedOutput: "Structured decision journal entry with all reasoning captured."
  },
  {
    id: "calendar-block",
    title: "Calendar blocking from todo list",
    category: "Productivity",
    model: "V2.5 Reasoning",
    useCase: "Convert a todo list into a realistic calendar plan.",
    tags: ["calendar", "time-blocking", "planning"],
    params: { temperature: 0.3, max_tokens: 1500 },
    user: "Date: {{date}}\nMy calendar (existing meetings): {{existing}}\nMy todo list: {{todos}}\nMy energy pattern: {{energy_pattern}}\nDeep-work needs: {{deep_work_items}}\n\nGenerate a calendar plan: time-blocked schedule, batch similar tasks, protect deep work, account for transitions and energy. Output as a timetable.",
    expectedOutput: "Realistic time-blocked schedule respecting energy patterns."
  },
  {
    id: "habit-tracker",
    title: "Habit-stack design",
    category: "Productivity",
    model: "V2.5 Chat",
    useCase: "Design a habit-stacking routine.",
    tags: ["habits", "behavior", "routine"],
    params: { temperature: 0.5, max_tokens: 1200 },
    user: "Goal: {{goal}}\nCurrent routine I want to build on: {{anchor_routine}}\nTime available: {{time_per_day}} per day\nFailure modes for me: {{known_obstacles}}\n\nDesign a habit-stack: anchor → new habit, friction reducers, identity statement, failure recovery rule.",
    expectedOutput: "Concrete habit stack with anchors, frictions, identity, recovery."
  },

  // === SECURITY (GENERAL) ===
  {
    id: "owasp-checklist",
    title: "OWASP Top 10 audit for a web app",
    category: "Security",
    model: "V2.5 Reasoning",
    useCase: "Audit a web app against OWASP Top 10 vulnerabilities.",
    tags: ["owasp", "security", "audit", "web"],
    params: { temperature: 0.2, max_tokens: 3500 },
    system: "You audit web apps against OWASP Top 10 (2021). For each finding: category, severity, exploit scenario, fix recommendation, test command.",
    user: "App description: {{app_description}}\nTech stack: {{stack}}\nCode samples / config:\n```\n{{code_samples}}\n```\n\nAudit against OWASP Top 10 2021. Output findings ranked by severity.",
    expectedOutput: "OWASP-categorized findings with severity, exploit, fix, test."
  },
  {
    id: "auth-flow-review",
    title: "Auth flow security review",
    category: "Security",
    model: "V2.5 Reasoning",
    useCase: "Review an authentication flow for security holes.",
    tags: ["auth", "security", "oauth"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Auth flow:\n{{flow_description}}\n\nReview for: token handling, session fixation, CSRF, replay, brute force, account enumeration, password reset weaknesses, OAuth misconfig, JWT pitfalls. Output: issues ranked by severity, fix per issue, test commands.",
    expectedOutput: "Severity-ranked auth findings with fixes and tests."
  },
  {
    id: "secrets-scan",
    title: "Scan code for leaked secrets",
    category: "Security",
    model: "V2.5 Reasoning",
    useCase: "Find secrets accidentally committed in code.",
    tags: ["secrets", "leaks", "security"],
    params: { temperature: 0.1, max_tokens: 2000 },
    user: "Scan this code/config for leaked secrets (API keys, tokens, passwords, private keys, connection strings):\n\n```\n{{code}}\n```\n\nFor each finding: type, line number, redacted match, risk, rotation procedure. Suggest .gitignore + secrets-manager pattern for future.",
    expectedOutput: "Secrets list + risk + rotation steps + prevention pattern."
  },
  {
    id: "incident-response",
    title: "Security incident response plan",
    category: "Security",
    model: "V2.5 Reasoning",
    useCase: "Generate an incident response plan for a specific scenario.",
    tags: ["incident", "response", "security"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Incident scenario: {{scenario}}\nOur infra: {{infra}}\nTeam available: {{team}}\n\nGenerate an incident response plan: detection signals, immediate containment (first 30 min), eradication, recovery, post-mortem template, communication plan (internal + external + regulator if needed).",
    expectedOutput: "Phased IR plan with timelines and communication templates."
  },
  {
    id: "permission-model-review",
    title: "Permission/RBAC model review",
    category: "Security",
    model: "V2.5 Reasoning",
    useCase: "Review a role-based access control model for gaps.",
    tags: ["rbac", "permissions", "iam"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Roles & permissions:\n{{rbac_table}}\n\nResources & actions:\n{{resources}}\n\nReview for: privilege escalation paths, separation of duties violations, over-privileged roles, missing least privilege, audit gaps. Output findings + recommended changes + RBAC matrix proposal.",
    expectedOutput: "Privilege issues + remediation + revised RBAC matrix."
  },

  // === DATA / SQL ===
  {
    id: "schema-design",
    title: "Database schema design",
    category: "Data",
    model: "V2.5 Reasoning",
    useCase: "Design a normalized database schema for a domain.",
    tags: ["database", "schema", "design"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Domain: {{domain}}\nKey entities: {{entities}}\nKey queries we need to support: {{queries}}\nScale: {{scale}}\n\nDesign the schema (3NF). Output: ERD as text, table DDL, indexes, partitioning plan, denormalization trade-offs flagged.",
    expectedOutput: "ERD + DDL + indexes + denorm trade-off discussion."
  },
  {
    id: "data-migration-plan",
    title: "Data migration plan",
    category: "Data",
    model: "V2.5 Reasoning",
    useCase: "Plan a database/data migration with rollback safety.",
    tags: ["migration", "database", "ops"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Migration: {{from_system}} → {{to_system}}\nData volume: {{volume}}\nDowntime budget: {{downtime}}\nKnown constraints: {{constraints}}\n\nPlan it: phases, validation queries per phase, rollback per phase, dual-write strategy if relevant, cutover criteria, post-migration verification.",
    expectedOutput: "Phased migration plan with rollback per phase."
  },
  {
    id: "etl-pipeline-design",
    title: "ETL pipeline design",
    category: "Data",
    model: "V2.5 Reasoning",
    useCase: "Design an ETL/ELT pipeline.",
    tags: ["etl", "data-engineering", "pipeline"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Source: {{source}}\nDestination: {{destination}}\nTransformations needed: {{transforms}}\nFreshness SLA: {{sla}}\nVolume: {{volume}}\n\nDesign the pipeline: tools, scheduling, idempotency strategy, error handling, observability, cost estimate.",
    expectedOutput: "Pipeline design with tools, idempotency, observability."
  },
  {
    id: "kpi-definition",
    title: "KPI definition + SQL",
    category: "Data",
    model: "V2.5 Reasoning",
    useCase: "Define a business KPI rigorously and write the SQL.",
    tags: ["kpi", "metrics", "sql"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Business question: {{question}}\nAvailable tables: {{tables}}\nKnown caveats: {{caveats}}\n\nDefine the KPI: precise definition, edge cases (returns/refunds/churn/etc.), denominator boundaries, time grain. Then write the SQL with comments. Then list the data quality checks to run before trusting it.",
    expectedOutput: "Rigorous KPI definition + commented SQL + DQ checks."
  },
  {
    id: "ab-test-analysis",
    title: "A/B test result analysis",
    category: "Data",
    model: "V2.5 Reasoning",
    useCase: "Analyze A/B test results with statistical rigor.",
    tags: ["ab-test", "stats", "experiment"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Experiment: {{experiment_name}}\nVariants: {{variants}}\nSample sizes: {{samples}}\nMetrics: {{metrics_with_values}}\nDuration: {{duration}}\n\nAnalyze: significance test (which test is appropriate and why), effect size, confidence interval, practical significance, segment breakdowns to check, ship/no-ship recommendation, follow-up experiments.",
    expectedOutput: "Significance test + effect size + recommendation + follow-ups."
  },

  // === CODE MIGRATION / TRANSLATION ===
  {
    id: "py-to-ts",
    title: "Translate Python to TypeScript",
    category: "Migration",
    model: "V2.5 Reasoning",
    useCase: "Port Python code to idiomatic TypeScript.",
    tags: ["python", "typescript", "migration"],
    params: { temperature: 0.2, max_tokens: 3000 },
    system: "You translate Python to idiomatic TypeScript. Use TS standard library equivalents, preserve behavior exactly, flag any non-trivial differences.",
    user: "Translate to TypeScript:\n\n```python\n{{python_code}}\n```\n\nRequirements: idiomatic TS, type-safe (no `any`), preserve semantics, equivalent test cases.",
    expectedOutput: "TypeScript code + behavioral differences flagged + tests."
  },
  {
    id: "rest-to-graphql",
    title: "Convert REST API to GraphQL schema",
    category: "Migration",
    model: "V2.5 Reasoning",
    useCase: "Port REST endpoints to a GraphQL schema.",
    tags: ["rest", "graphql", "migration"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "REST endpoints:\n{{endpoints}}\n\nConvert to GraphQL: types, queries, mutations, subscriptions where relevant, N+1 risks flagged, dataloader strategy, deprecation plan for old REST.",
    expectedOutput: "GraphQL SDL + N+1 mitigation + deprecation plan."
  },
  {
    id: "monolith-to-microservices",
    title: "Monolith → microservices boundary analysis",
    category: "Migration",
    model: "V2.5 Reasoning",
    useCase: "Identify service boundaries from a monolith.",
    tags: ["microservices", "architecture", "migration"],
    params: { temperature: 0.3, max_tokens: 3000 },
    user: "Monolith summary: {{summary}}\nKey domains: {{domains}}\nPain points: {{pain_points}}\nTeam structure: {{team}}\n\nAnalyze service boundaries using DDD. Output: bounded contexts, recommended services, ownership map, splitting order (strangler fig), shared infra plan, anti-patterns to avoid.",
    expectedOutput: "Bounded contexts + service map + strangler-fig migration order."
  },
  {
    id: "cjs-to-esm",
    title: "Migrate CommonJS to ESM",
    category: "Migration",
    model: "V2.5 Chat",
    useCase: "Migrate a Node project from CommonJS to ESM.",
    tags: ["esm", "commonjs", "node", "migration"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Project structure: {{structure}}\nBuild tool: {{build}}\nPackage.json:\n```\n{{package_json}}\n```\n\nGenerate the migration plan: package.json changes, file extension strategy, dynamic require → import handling, dual-package gotchas, test config updates, expected breakage.",
    expectedOutput: "Migration plan + config diffs + breakage list."
  },
  {
    id: "css-to-tailwind",
    title: "Convert plain CSS to Tailwind",
    category: "Migration",
    model: "V2.5 Chat",
    useCase: "Convert plain CSS to Tailwind utility classes.",
    tags: ["tailwind", "css", "migration"],
    params: { temperature: 0.2, max_tokens: 2500 },
    user: "Convert this to Tailwind utility classes. Preserve responsive breakpoints, hover/focus states, animations.\n\n```html\n{{html}}\n```\n\n```css\n{{css}}\n```\n\nOutput: HTML with Tailwind classes, custom @apply rules for genuinely complex parts, tailwind.config.js extensions if needed.",
    expectedOutput: "Tailwind-converted HTML + config extensions."
  },

  // === LEGAL / CONTRACT ===
  {
    id: "tos-summary",
    title: "Plain-English Terms of Service summary",
    category: "Legal",
    model: "V2.5 Reasoning",
    useCase: "Summarize a Terms of Service in plain English.",
    tags: ["legal", "tos", "plain-english"],
    params: { temperature: 0.2, max_tokens: 2500 },
    system: "You summarize legal documents for non-lawyers. Surface the user-impactful clauses (data, liability, arbitration, termination, IP). Avoid hyperbole. Mark genuine red flags clearly.",
    user: "Summarize this Terms of Service in plain English. Sections to highlight: data collection & use, license to user content, liability limits, arbitration / class-action waiver, termination rights, governing law, changes to terms.\n\n```\n{{tos_text}}\n```",
    expectedOutput: "Plain-English summary + flagged user-impactful clauses."
  },
  {
    id: "privacy-policy-draft",
    title: "Draft a privacy policy",
    category: "Legal",
    model: "V2.5 Chat",
    useCase: "Draft a starter privacy policy for an app.",
    tags: ["privacy", "policy", "gdpr"],
    params: { temperature: 0.3, max_tokens: 3000 },
    system: "You draft privacy policies. Cover GDPR + CCPA fundamentals. Be specific to the app's actual data flows. Add a clear note that the user must have a lawyer review before publishing.",
    user: "App: {{app_name}}\nWhat data we collect: {{data_collected}}\nWhy we collect it: {{purposes}}\nThird parties: {{third_parties}}\nUser controls offered: {{controls}}\nJurisdiction: {{jurisdiction}}\n\nDraft a privacy policy with sections: data collected, purpose, legal basis (GDPR), retention, third parties, user rights (access/delete/export), cookies, contact, changes.",
    expectedOutput: "Starter privacy policy + lawyer-review disclaimer."
  },

  // === LEARNING (extra) ===
  {
    id: "feynman-technique",
    title: "Feynman-technique explanation",
    category: "Learning",
    model: "V2.5 Reasoning",
    useCase: "Explain a topic as if teaching a smart 12-year-old.",
    tags: ["explain", "feynman", "teaching"],
    params: { temperature: 0.5, max_tokens: 2000 },
    user: "Topic: {{topic}}\n\nExplain it using the Feynman technique: simple-language explanation, analogy, where the analogy breaks down, what gaps remain in your understanding, what to read next to fill the gaps.",
    expectedOutput: "Plain explanation + analogy + analogy limits + gaps + next reading."
  },
  {
    id: "interview-question-bank",
    title: "Generate technical interview questions",
    category: "Learning",
    model: "V2.5 Reasoning",
    useCase: "Build a technical interview question bank.",
    tags: ["interview", "questions", "hiring"],
    params: { temperature: 0.5, max_tokens: 2500 },
    user: "Role: {{role}}\nLevel: {{level}}\nFocus areas: {{focus_areas}}\n\nGenerate 10 interview questions across: easy / medium / hard difficulty. For each: question, what good answers cover, common red flags, follow-up to test depth.",
    expectedOutput: "10 ranked questions with rubric and follow-ups."
  },

  // === CREATIVE / BRAINSTORM ===
  {
    id: "brainstorm-alternatives",
    title: "Brainstorm 10 alternative approaches",
    category: "Creative",
    model: "V2.5 Chat",
    useCase: "Generate diverse alternative approaches to a problem.",
    tags: ["brainstorm", "ideation", "creative"],
    params: { temperature: 0.8, max_tokens: 2500 },
    system: "You brainstorm divergent alternatives. Push past the obvious first 3 ideas. Mix practical and unconventional. Label each by feasibility (now / soon / stretch).",
    user: "Problem: {{problem}}\nConstraints: {{constraints}}\nWhat I've already considered: {{already_tried}}\n\nGenerate 10 alternative approaches. For each: one-line description, why it might work, biggest risk, feasibility (now / soon / stretch).",
    expectedOutput: "10 diverse alternatives with feasibility labels and risk notes."
  },
  {
    id: "analogy-finder",
    title: "Find the perfect analogy",
    category: "Creative",
    model: "V2.5 Chat",
    useCase: "Explain a complex idea through a precise analogy.",
    tags: ["analogy", "explain", "creative"],
    params: { temperature: 0.7, max_tokens: 1500 },
    user: "Concept: {{concept}}\nAudience: {{audience}}\n\nGenerate 3 analogies from different domains (everyday life, nature, history/sports/business). For each: the analogy, where it holds, where it breaks down, and which is best for this audience.",
    expectedOutput: "3 domain-diverse analogies with hold/breakdown analysis."
  },
  {
    id: "naming-generator",
    title: "Generate project/product names",
    category: "Creative",
    model: "V2.5 Chat",
    useCase: "Generate catchy, available-sounding names for a project or product.",
    tags: ["naming", "branding", "creative"],
    params: { temperature: 0.9, max_tokens: 1500 },
    system: "You generate names. Rules: short (1-2 words), easy to spell, easy to say aloud, no hyphens, hint at the product's value without being generic.",
    user: "Product: {{description}}\nVibe: {{vibe}} (e.g. technical, playful, premium, minimal)\nAvoid: {{avoid}}\n\nGenerate 20 names grouped: 5 safe/obvious, 5 clever/metaphorical, 5 bold/unconventional, 5 compound words. For each, one-line rationale.",
    expectedOutput: "20 names in 4 groups with rationale per name."
  },
  {
    id: "counter-argument",
    title: "Steel-man the opposing view",
    category: "Creative",
    model: "V2.5 Reasoning",
    useCase: "Strengthen your argument by stress-testing it against the best counter.",
    tags: ["debate", "critical-thinking", "reasoning"],
    params: { temperature: 0.4, max_tokens: 2000 },
    user: "My position: {{position}}\n\nSteel-man the strongest possible counter-argument. Then: what evidence would change my mind, what evidence would strengthen my position, what's the honest confidence level (0-100%) in my position.",
    expectedOutput: "Steel-manned counter + evidence gaps + honest confidence score."
  },

  // === FARCASTER / MINI APP ===
  {
    id: "mini-app-ux-review",
    title: "Farcaster Mini App UX review",
    category: "Farcaster",
    model: "V2.5 Reasoning",
    useCase: "Review a Mini App's UX for Farcaster-native user expectations.",
    tags: ["farcaster", "mini-app", "ux"],
    params: { temperature: 0.3, max_tokens: 2500 },
    system: "You review Farcaster Mini Apps. Focus: first-frame load speed, thumb-friendly tap targets, social-native flows (cast-to-action, share-to-earn), minimal friction, no dead ends.",
    user: "Mini App: {{app_name}}\nDescription: {{description}}\nScreenshots / flow: {{screenshots}}\n\nReview for: first impression (3-second test), navigation clarity, social integration, error states, loading states, share-ability. Output: 5 strengths, 5 issues (severity-ranked), quick wins.",
    expectedOutput: "UX review with strengths, severity-ranked issues, and quick wins."
  },
  {
    id: "farcaster-frame-design",
    title: "Design a Farcaster Frame flow",
    category: "Farcaster",
    model: "V2.5 Chat",
    useCase: "Design a Frame v2 interaction flow for a specific goal.",
    tags: ["farcaster", "frames", "social"],
    params: { temperature: 0.5, max_tokens: 2000 },
    user: "Goal: {{goal}}\nProduct: {{product}}\nTarget action: {{action}}\n\nDesign a Frame flow. Output: frame count, per-frame layout (image + buttons + text), state transitions, error handling, success state, share prompt. Include the image prompt for each frame.",
    expectedOutput: "Complete frame flow with layouts, transitions, and image prompts."
  },
  {
    id: "cast-engagement-optimizer",
    title: "Optimize a cast for engagement",
    category: "Farcaster",
    model: "V2.5 Chat",
    useCase: "Rewrite a cast to maximize replies and recasts.",
    tags: ["farcaster", "engagement", "social"],
    params: { temperature: 0.7, max_tokens: 800 },
    system: "You optimize Farcaster casts for engagement. Techniques: open loops, specific numbers, controversial-but-defensible takes, questions that invite expertise, 'what am I missing?' closers.",
    user: "Original cast: {{cast}}\nGoal: {{goal}} (replies / recasts / follows)\n\nRewrite 3 variations: (1) question hook, (2) hot take, (3) story opener. Each under 320 chars. Explain which works best for the goal and why.",
    expectedOutput: "3 cast variations with engagement strategy explanation."
  },
  {
    id: "mini-app-onboarding",
    title: "Design Mini App onboarding flow",
    category: "Farcaster",
    model: "V2.5 Chat",
    useCase: "Design a frictionless onboarding for a Farcaster Mini App.",
    tags: ["farcaster", "mini-app", "onboarding"],
    params: { temperature: 0.4, max_tokens: 2000 },
    user: "App: {{app_name}}\nCore value: {{value_prop}}\nUser's first action: {{first_action}}\n\nDesign onboarding: max 3 screens, progressive disclosure, skip option, social proof element, first-value moment within 30 seconds. Output: screen-by-screen layout, copy, transition logic.",
    expectedOutput: "3-screen onboarding flow with copy and transition logic."
  },

  // === DEVOPS / INFRA ===
  {
    id: "terraform-review",
    title: "Review Terraform / IaC code",
    category: "DevOps",
    model: "V2.5 Reasoning",
    useCase: "Review Infrastructure-as-Code for security, cost, and best practices.",
    tags: ["terraform", "iac", "cloud", "security"],
    params: { temperature: 0.2, max_tokens: 3000 },
    system: "You review IaC. Check: security (open ports, IAM over-permission, unencrypted storage), cost (oversized instances, unused resources), reliability (no multi-AZ, no backups), naming conventions, tagging.",
    user: "Review this Terraform code. Output: findings by category (Security / Cost / Reliability / Convention), each with severity, line number, fix code.\n\n```hcl\n{{terraform_code}}\n```",
    expectedOutput: "Categorized findings with severity and fix code."
  },
  {
    id: "nginx-config-secure",
    title: "Generate secure Nginx config",
    category: "DevOps",
    model: "V2.5 Chat",
    useCase: "Generate a production-ready Nginx config with security headers.",
    tags: ["nginx", "security", "web-server"],
    params: { temperature: 0.2, max_tokens: 2000 },
    user: "Domain: {{domain}}\nBackend: {{backend}} (e.g. localhost:3000)\nSSL: {{ssl_provider}} (Let's Encrypt / Cloudflare)\nFeatures needed: {{features}} (e.g. gzip, rate-limit, websocket)\n\nGenerate a complete nginx.conf with: SSL hardening, security headers (CSP, HSTS, X-Frame), rate limiting, gzip, proxy config, logging.",
    expectedOutput: "Production nginx.conf with security headers and comments."
  },
  {
    id: "github-actions-deploy",
    title: "GitHub Actions deploy workflow",
    category: "DevOps",
    model: "V2.5 Chat",
    useCase: "Generate a CI/CD workflow for deploying to a specific platform.",
    tags: ["github-actions", "ci-cd", "deploy"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Platform: {{platform}} (Vercel / Cloudflare Pages / AWS / VPS)\nFramework: {{framework}}\nBuild command: {{build_cmd}}\nEnvironment vars needed: {{env_vars}}\n\nGenerate a complete .github/workflows/deploy.yml with: build, test, deploy stages, caching, environment secrets, rollback on failure.",
    expectedOutput: "Complete deploy workflow YAML with caching and rollback."
  },
  {
    id: "monitoring-alert-setup",
    title: "Set up monitoring + alerts",
    category: "DevOps",
    model: "V2.5 Reasoning",
    useCase: "Design a monitoring and alerting strategy for a service.",
    tags: ["monitoring", "alerting", "observability"],
    params: { temperature: 0.3, max_tokens: 2500 },
    user: "Service: {{service_name}}\nStack: {{stack}}\nSLA: {{sla}}\nCurrent monitoring: {{current}}\n\nDesign monitoring: golden signals (latency, traffic, errors, saturation), alert thresholds, escalation policy, dashboard layout, log queries, runbook links.",
    expectedOutput: "Alert rules + dashboard spec + escalation policy."
  },

  // === MIMO-SPECIFIC ===
  {
    id: "mimo-reasoning-chain",
    title: "MiMo reasoning chain with self-verification",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Leverage MiMo's reasoning mode with built-in self-check.",
    tags: ["mimo", "reasoning", "verification"],
    params: { temperature: 0.2, max_tokens: 4000 },
    system: "You reason step-by-step. After each major step, pause to verify: 'Does this step follow logically? Any assumptions I'm making?' At the end, do a final self-audit: check each conclusion against the original problem.",
    user: "Problem: {{problem}}\n\nReason through this step-by-step. After each major deduction, verify it. At the end, self-audit your answer: does it fully solve the original problem? Any gaps?",
    expectedOutput: "Step-by-step reasoning with inline verification and final self-audit."
  },
  {
    id: "mimo-multi-perspective",
    title: "Multi-perspective analysis",
    category: "Reasoning",
    model: "V2.5 Reasoning",
    useCase: "Analyze a decision from 3+ stakeholder perspectives.",
    tags: ["perspective", "analysis", "stakeholder"],
    params: { temperature: 0.4, max_tokens: 3000 },
    user: "Decision: {{decision}}\nStakeholders: {{stakeholders}}\n\nAnalyze from each stakeholder's perspective: their interests, how the decision affects them, their likely objection, what would make them support it. Then synthesize: the decision that maximizes collective value.",
    expectedOutput: "Per-stakeholder analysis + synthesized recommendation."
  },
  {
    id: "mimo-image-prompt-optimizer",
    title: "Optimize a prompt for MiMo Image",
    category: "Image",
    model: "V2.5 Image",
    useCase: "Transform a vague image idea into a precise MiMo Image prompt.",
    tags: ["image", "prompt-engineering", "mimo"],
    params: { temperature: 0.5, max_tokens: 1500 },
    system: "You optimize image prompts for MiMo V2.5 Image. Good prompts specify: subject, composition, lighting, style, color palette, camera angle, mood, and negative constraints.",
    user: "Vague idea: {{idea}}\n\nTransform into 3 optimized MiMo Image prompts: (1) photorealistic, (2) illustrated/stylized, (3) abstract/artistic. Each should be 2-3 sentences with specific composition, lighting, and style details.",
    expectedOutput: "3 optimized image prompts with distinct styles."
  },

  // === DATA VIZ ===
  {
    id: "chart-recommendation",
    title: "Recommend the right chart type",
    category: "Analysis",
    model: "V2.5 Chat",
    useCase: "Pick the best visualization for a dataset and story.",
    tags: ["visualization", "charts", "data"],
    params: { temperature: 0.3, max_tokens: 1500 },
    user: "Data: {{data_description}}\nStory I want to tell: {{story}}\nAudience: {{audience}}\n\nRecommend: chart type (with rationale), key encodings (x, y, color, size), annotations to add, what to remove/simplify. If the data doesn't fit a single chart, suggest a small multiples approach.",
    expectedOutput: "Chart recommendation with encodings and annotation strategy."
  },
  {
    id: "data-story-narrative",
    title: "Turn data findings into a narrative",
    category: "Analysis",
    model: "V2.5 Chat",
    useCase: "Transform dry data findings into a compelling story.",
    tags: ["storytelling", "data", "presentation"],
    params: { temperature: 0.6, max_tokens: 2500 },
    system: "You turn data into stories. Structure: hook (surprising finding), context (why it matters), tension (what's at stake), resolution (recommendation), proof (key numbers).",
    user: "Findings: {{findings}}\nAudience: {{audience}}\nGoal: {{goal}}\n\nWrite a 3-minute narrative. Open with the most surprising number. Build tension. Close with a clear recommendation backed by data.",
    expectedOutput: "3-minute data narrative with hook, tension, and recommendation."
  }

];

// Expose to the page
if (typeof window !== "undefined") window.PROMPTS = PROMPTS;
if (typeof module !== "undefined") module.exports = PROMPTS;
