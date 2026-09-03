# Deployment Checklist — Pantry AI Planner

**Project:** Pantry AI Planner
**Deployed by:** Fatima Javaid
**Deployment date:** August 31, 2026
**Platform:** Vercel
**Production URL:** https://pantry-ai-planner.vercel.app

---

## Pre-Deployment

- [x] Code committed to Git with clear commit messages
- [x] Repository pushed to GitHub (`FatimaCreates/pantry-ai-planner`, `main` branch)
- [x] `.env.local` confirmed excluded from Git (`.gitignore` contains `.env*`) — no secrets exposed in the public repo
- [x] App runs locally without errors (`npm run dev`)
- [x] All unit tests passing locally (`npm run test` → 3/3 passed)

## Deployment

- [x] Project imported into Vercel from GitHub repository
- [x] Framework auto-detected correctly (Next.js)
- [x] Root directory confirmed correct (`./`)
- [x] Deployed successfully — status: **Ready**
- [x] Live URL verified working (loads, form renders, "Get Recipes" functions)
- [x] Auto-deploy on push to `main` confirmed active (Vercel redeploys automatically on every push)

## Environment & Secrets

- [x] `USE_MOCK_DATA=true` used in current deployment (no live API credits available at deploy time)
- [ ] `ANTHROPIC_API_KEY` added to Vercel's Environment Variables (pending — will be added when switching off mock mode)
- [x] No API keys or secrets committed to the repository

## Post-Deployment Verification

- [x] Manually tested core user flow: enter ingredients → submit → recipes render
- [x] Manually tested error state: empty submission → validation message displays
- [x] Lighthouse audit run on production URL (Performance 98, Accessibility 100, Best Practices 100, SEO 100)

## Failure Handling

**How the app fails safely:**
- Empty/invalid input → client-side validation blocks submission, shows inline error (`role="alert"`)
- Claude API failure or bad response → API route returns a structured error (`502`) with a user-facing message ("Failed to get recipe suggestions. Please try again.")
- Network failure on the client → caught and shown as "Network error. Please check your connection and try again."
- No unhandled crashes: all API route logic wrapped in `try/catch`, returning a `500` with a generic message as a last resort

## Rollback Plan

If a deployment introduces a regression:
1. Go to Vercel Dashboard → Project → **Deployments**
2. Find the last known-good deployment
3. Click **"Promote to Production"** to instantly roll back — no rebuild needed
4. In parallel, revert the problematic commit on `main` locally (`git revert <commit>`) and push, so the next deploy is also clean

**Monitoring:** No dedicated monitoring/alerting service is set up for this project (out of scope for current stage). Vercel's built-in deployment status (Ready/Error) and function logs are checked manually after each deploy. Future improvement: enable Vercel Speed Insights for ongoing performance tracking.

---

**Signed off by:** Fatima Javaid
**Date:** August 31, 2026
