# Pantry AI Planner

Tell us what's in your pantry, and get instant recipe ideas — powered by Claude AI.

**Live App:** [pantry-ai-planner.vercel.app](https://pantry-ai-planner.vercel.app)

---

## Project Brief

Pantry AI Planner solves a small but common problem: staring at a fridge full of random ingredients with no idea what to cook. It's built for home cooks who want quick, realistic recipe suggestions based on what they already have, instead of searching recipe sites for exact ingredient matches. I chose this idea because it combines a genuinely useful everyday problem with a natural fit for LLM reasoning — turning loose, unstructured pantry items into structured, actionable recipes is exactly the kind of task a language model handles better than a rule-based lookup.

---

## Setup & Run Locally

```bash
git clone https://github.com/FatimaCreates/pantry-ai-planner.git
cd pantry-ai-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_key_here
USE_MOCK_DATA=true
```

- Get a free API key at [console.anthropic.com](https://console.anthropic.com)
- Set `USE_MOCK_DATA=true` to run the app without any API key or credits (returns sample recipes)
- Set `USE_MOCK_DATA=false` to use real Claude API responses

---

## Architecture Overview

```
app/
├── page.tsx            # Main UI — ingredient input form, recipe results display
├── api/
│   └── recipes/
│       └── route.ts    # POST endpoint — validates input, calls Claude API (or returns mock data)
├── layout.tsx           # Root layout
└── globals.css          # Global styles
```

**Flow:**
1. User types ingredients into a textarea on the frontend (`page.tsx`)
2. Frontend sends a POST request to `/api/recipes` with `{ ingredients: string }`
3. The API route (`route.ts`) either:
   - Returns mock recipe data instantly (if `USE_MOCK_DATA=true`), or
   - Calls the Claude API with a structured prompt and returns parsed JSON
4. Frontend renders the returned recipes (name, ingredients used, missing ingredients, steps)

The API key is **never exposed to the browser** — all Claude API calls happen server-side inside the Next.js API route.

---

## AI Integration

**Model:** `claude-sonnet-4-6` via the Anthropic Messages API

**Why an LLM here:** Ingredient lists are messy, informal, and open-ended ("chicken, some rice, half an onion"). Rather than matching against a fixed recipe database, Claude interprets the input and generates realistic recipes on the fly — including which ingredients are missing, which is genuinely hard to do with static rules.

**Prompt used:**

```
You are a helpful cooking assistant. Based on these pantry ingredients: "{ingredients}", 
suggest 3 realistic recipes.

Respond ONLY with valid JSON, no preamble, no markdown fences, in this exact shape:
{
  "recipes": [
    {
      "name": "string",
      "usesIngredients": ["string"],
      "missingIngredients": ["string"],
      "steps": ["string"]
    }
  ]
}
```

The prompt forces structured JSON output so the frontend can render results reliably without parsing free-form text.

**Current status:** Due to limited API credits during development, the app currently runs with `USE_MOCK_DATA=true` by default, returning realistic sample data so the full flow can be demonstrated end-to-end. The real API integration code is complete and tested — switching `USE_MOCK_DATA=false` with a funded key activates it immediately, no code changes needed.

---

## Known Limitations & Future Improvements

- **Mock mode default:** Live demo currently uses mock data (see above) — real API calls not yet demonstrated in production due to credit limits
- No persistence — recipes aren't saved between sessions
- No dietary preference filtering (vegetarian, allergies, etc.)
- No loading skeleton — only a basic loading state
- Future: add recipe saving/favorites, ingredient quantity awareness, dietary filters

---

## Testing

_(To be added — unit tests in progress)_

---

## Performance & Accessibility

_(To be added — Lighthouse and WAVE audit pending)_

---

## Deployment

**Platform:** Vercel (connected to GitHub `main` branch — auto-deploys on push)

**Rollback plan:** If a deployment breaks production, roll back via Vercel Dashboard → Deployments → select last known-good deployment → "Promote to Production". Alternatively, revert the bad commit on `main` and push — Vercel redeploys automatically.

**Error handling:** The API route returns clear error states for:
- Missing/empty ingredient input (`400`)
- Claude API failure (`502`)
- Malformed AI response (`502`)
- Unexpected server errors (`500`)

---

## Reflection

_(To be added)_
