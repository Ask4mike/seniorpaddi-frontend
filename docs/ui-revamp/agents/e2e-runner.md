# Agent: `ecc:e2e-runner`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\e2e-runner.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Write, Edit, Bash, Grep, Glob. Prefers Vercel Agent Browser, falls back to Playwright.

## Role in this project
Machine checks against the running app: axe-core accessibility scans, keyboard-only walkthroughs, screenshots at 320 / 768 / 1280px in English and Yorùbá, and responsive and reflow checks. Lighthouse accessibility scores come from the Chrome DevTools MCP in the lead session.

## Phases
| Phase | What it does |
|---|---|
| 4 | Runs axe and keyboard flows over every page and main user flow, and captures screenshots for the usability report. |
| 6 | Re-runs the same suite for the "after" numbers and compares them to the Phase 4 and Phase 0 baselines. |

## Inputs
A running app and database (needs decision D2 in the GUIDE), seeded demo data (`npm run seed:local`, documented in the README, local database only), the page and flow list.

## Outputs
Per-page axe results, screenshots, keyboard-trap and focus-order notes, and a pass/fail table. Saved under `docs/ui-revamp/evidence/` (screenshots) and summarised in the reports.

## Files it may touch
`docs/ui-revamp/evidence/**` and, if tests are requested, new `tests/ui-*.test.js` files. Any tooling is run with `npx` and **not** added to `package.json`.

## Files it must not touch
Application code (`views/`, `public/`, `src/`), `package.json`, `.env`, and any database other than the local or throwaway test database. It never seeds or wipes a Neon or production database.

## Rule
**It must not alter existing content or functionality.** It observes and reports. It does not fix. Fixes go back to the implementing agent.
