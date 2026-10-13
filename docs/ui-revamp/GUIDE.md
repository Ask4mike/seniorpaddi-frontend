# SeniorPadi UI Revamp: Guide and Plan

Accessibility-first redesign of the SeniorPadi web app for adults aged 65 and over.
Priority order: **readability, simplicity, low cognitive load, then aesthetics.**

Branch: `ui-revamp`. Status: **Phase 0 (plan) awaiting approval.**

---

## 1. Hard constraints (apply to every phase and every agent)

1. **UI files only.** Touch only views, partials, client scripts, styles, static assets, UI tests and docs (list in section 5). Never edit `src/` (except `src/styles/`), migrations, models, routes, services, `render.yaml`, or `package.json` without asking first.
2. **No content, feature, route or behaviour changes.** Existing copy (`t('...')` keys and literal text), data, form `action`/`method`/`name` attributes, hrefs, route paths and tested markup hooks stay identical. Only presentation, accessibility structure and usability aids change.
3. **Tailwind for all styling**, driven by one central theme. This is Tailwind v4 (CSS-first), so the "tailwind.config" is the `@theme` block in `src/styles/input.css`. No `tailwind.config.js` is added. No scattered arbitrary values such as `text-[0.95rem]` once tokens exist.
4. **Phased with commits.** Finish a phase, summarise, commit on `ui-revamp`, stop for review.
5. **New content only where the brief asks for it** (Phase 5 tutorial and Help button copy), added as new keys and never by editing existing ones.

## 2. Assumptions (flag if wrong)

| # | Assumption | Why |
|---|---|---|
| A1 | The stack stays **Express + EJS + Tailwind v4 + vanilla JS**. No React or build-pipeline changes. | Already in place, and a rewrite would violate "no behaviour change". |
| A2 | Central config = `@theme` in `src/styles/input.css`. | Tailwind v4 has no `tailwind.config` by default. |
| A3 | "Reusable components" = **EJS partials** in `views/partials/` plus a small set of `@layer components` classes. | EJS has no component model. Partials are the idiomatic equivalent. |
| A4 | **`public/css/main.css` is rebuilt and committed every phase.** | `render.yaml` runs only `npm install`, so the committed CSS is what ships. (Recommendation only: add `npm run build` to the Render build command. Not changed here.) |
| A5 | Audience is 65+ (README says 60+). Design for 65+. | Stricter wins. |
| A6 | Staff/admin screens get the same type, contrast, target and focus standards as senior screens. Dense admin tables stay tables. | The brief says "entire UI", but seniors are the priority, so admin is built last. |
| A7 | `views/emails/layout.ejs` uses inline styles, because email clients ignore Tailwind. It gets palette/size updates only, as inline styles. | Tailwind can't be applied to HTML email. |
| A8 | Phase 5 tutorial strings are added to **both** `locales/en.json` and `locales/yo.json`. Yorùbá drafts need review by a native speaker before launch. | The app is bilingual. I can't certify Yorùbá copy. |
| A9 | Phase 5 uses **no new dependency** (about 150 lines of vanilla JS). | See Phase 5. |

## 3. Decisions needed from you at this gate

| # | Decision | Default if you don't say otherwise |
|---|---|---|
| D1 | **Baseline commit.** The repo has **zero commits**, so everything is untracked. To branch and diff-review at all I need a baseline. | Commit the current project as-is on `main` ("baseline before UI revamp"), then branch `ui-revamp`. Local only, no push. |
| D2 | **A database for live checks and tests.** There is no PostgreSQL, Docker or `.env` on this machine, so the app can't start and the existing Jest suite can't run. | Phases 0 to 3 proceed without it, using a DB-free content-freeze script and static checks. For Phase 4 and 6 (live axe/Lighthouse/screenshots and `npm test`) I need one of: (a) you install PostgreSQL locally, (b) you give me a throwaway Neon `TEST_DATABASE_URL`, (c) I add a dev-only embedded Postgres. (c) changes `package.json`, so I'd ask first. |
| D3 | Admin screens in scope at full standard (A6). | Yes. |
| D4 | **Small accessibility-only JS fixes** that touch keyboard or focus handling but add no feature: an `e.target` guard in `swipe.js` (today ArrowLeft/Right on a focused Register button also fires skip or register), Esc to close and focus return in dialogs, and `aria-hidden` on swipe badges. | I do them and list them in the Phase 3 summary. Say "recommend only" if you want them held back. Confirmation prompts, show-password toggles and other new behaviour stay recommendation-only either way. |

## 4. ECC agents and skills: what exists and where each fits

Source: ECC plugin v2.2.2, `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\` and `...\skills\`. Names below are the agents actually installed. Nothing was assumed.

**Gap:** ECC has no EJS/Tailwind implementer and no dedicated design-research agent. The `react-*`, `vue-*`, `typescript-reviewer` and language-specific agents don't fit this stack and are not used. Where a role has no ECC agent, a built-in agent is used and flagged.

| Phase | Agent(s) used | Skills consulted | Why this agent |
|---|---|---|---|
| 0 Audit and plan | `ecc:a11y-architect` (audit); lead session (inventory, plan) | `ecc:frontend-a11y`, `ecc:accessibility` | Purpose-built for WCAG 2.2 audits of web UI. Read-only here. |
| 1 Design research | `general-purpose` (built-in, **not ECC**) with WebSearch/WebFetch. Lead session reads the project's Figma file. | `ecc:deep-research`, `ecc:frontend-design-direction`, `ecc:design-system` | No ECC research agent exists. `a11y-architect` has no web tools. |
| 2 Palette | `ecc:a11y-architect` plus a contrast and colour-vision script | `ecc:accessibility`, `ecc:design-system` | Owns WCAG contrast and non-colour-cue rules. |
| 3 Tailwind revamp | `ecc:a11y-architect` (component spec and implementation), `ecc:code-simplifier` (dedupe utilities into partials/classes, behaviour-preserving), `ecc:code-reviewer` (gate each batch) | `ecc:frontend-a11y`, `ecc:design-system`, `ecc:frontend-patterns` | `a11y-architect` has Edit/Write, and `code-simplifier` is built to refactor without changing behaviour. |
| 4 Usability review | `ecc:a11y-architect` (heuristics and cognitive walkthrough), `ecc:e2e-runner` (axe, Lighthouse, viewport runs), `ecc:code-reviewer` | `ecc:accessibility`, `ecc:browser-qa`, `ecc:e2e-testing` | Separates judgement (walkthrough) from machine checks (axe/Lighthouse). |
| 5 Tutorial | `ecc:code-architect` (blueprint fitted to this codebase), `ecc:a11y-architect` (accessibility spec and review), `ecc:tdd-guide` (tests for markup hooks) | `ecc:frontend-a11y`, `ecc:tdd-workflow` | Blueprint first, accessibility second, tests lock the behaviour. |
| 6 Final verification | `ecc:e2e-runner`, `ecc:code-reviewer`, `ecc:build-error-resolver` (**only if** build/tests fail) | `ecc:verification-loop`, `ecc:browser-qa` | Independent re-check, plus a minimal-diff fixer if needed. |

Per-agent READMEs: [agents/](agents/).

## 5. Files in scope

| Zone | Paths | May change | Notes |
|---|---|---|---|
| Theme and styles | `src/styles/input.css`, generated `public/css/main.css` | Yes | `main.css` is output only. Rebuild with `npm run build:css`. |
| Templates | `views/**/*.ejs` (54 files: 12 partials, 6 auth, 4 events, 5 account, 6 social, 15 admin, 1 email, 5 top-level pages) | Yes | Markup, classes, ARIA only. `<%= t() %>` calls unchanged. |
| Client scripts | `public/js/*.js` (chat, dashboard, phone-input, reveal, swipe, upload) | Accessibility-only edits | Behaviour identical. |
| Static assets | `public/images/**` | Only if an asset is unused or broken | No new content. |
| Locales | `locales/en.json`, `locales/yo.json` | **Additive only**, Phase 5 | Existing keys byte-for-byte unchanged. |
| UI tests | `tests/newui.test.js` plus new `tests/ui-*.test.js` | Add only | Existing assertions must still pass unmodified. |
| Docs and tools | `docs/ui-revamp/**` | Yes | Includes `tools/` verification scripts. |
| **Out of scope** | `src/**` (except `src/styles/`), `tests/*` backend tests, migrations, models, `render.yaml`, `package.json`, `.sequelizerc`, `*.bat` | **No** | If a UI file needs a backend change, record it as a recommendation. |

Markup the existing tests depend on (must survive): `name="_csrf" value="…"`, `name="lang" value="yo"`, the `/events/:id/skip` form action, and the "Log in to register", "volunteer at this event" and "Log in to find seniors" strings.

## 6. Phased plan

Each phase ends with: summary to you, `npm run build:css`, a content-freeze check, a commit on `ui-revamp`, then a stop.

### Phase 0: Audit and planning (this document)

- **Agent:** `ecc:a11y-architect` (audit). **Skills:** `ecc:frontend-a11y`.
- **Files:** read-only on all UI files. Writes only `docs/ui-revamp/**`.
- **Outputs:** `GUIDE.md`, `audit.md` (inventory, current state, accessibility findings), `agents/*.md` (one per agent).
- **Acceptance:** every UI file inventoried. Audit findings cite file and line. Each agent README states role, inputs, outputs, files it may touch and the no-content-change rule. You approve the plan, D1 and D2.
- **Commit:** `docs: UI revamp plan and audit` (after D1 baseline).

### Phase 1: Design research

- **Agent:** `general-purpose` (web), lead session (Figma). **Skills:** `ecc:deep-research`, `ecc:frontend-design-direction`.
- **Files:** writes `docs/ui-revamp/research.md` only.
- **Content:** design patterns for senior-friendly web apps. Palette sources (Coolors, Adobe Color, Material colour tools, public Figma community palettes). Accessibility guidance: WCAG 2.2 AA (AAA for body text where feasible), NN/g on seniors, Apple HIG and Google Material accessibility. A look at the project's own Figma redesign (link in README) as a brand-continuity reference, read-only. Font candidates (the current Plus Jakarta Sans at 800 weight is stylish rather than maximally legible, so Atkinson Hyperlegible, Lexend and Inter are candidates).
- **Acceptance:** 2 to 3 candidate palettes and 2 to 3 layout directions, each with source URLs and a rationale tied to SeniorPadi's purpose (events, registration, chat, phone-first users in Ibadan on mobile data). Every claim sourced, and unreachable sources noted.
- **Constraint:** I paraphrase sources and do not copy their text.

### Phase 2: Palette selection and validation

- **Agent:** `ecc:a11y-architect` plus `docs/ui-revamp/tools/contrast.mjs` (WCAG contrast and protan/deutan/tritan simulation). **Skills:** `ecc:accessibility`, `ecc:design-system`.
- **Files:** `docs/ui-revamp/palette.md`, `docs/ui-revamp/tools/contrast.mjs`, `src/styles/input.css` (`@theme` tokens only), rebuilt `public/css/main.css`.
- **Method:** test every foreground/background pair actually used in the app, not only hand-picked pairs. Choose ONE palette: primary, secondary, accent, success, warning, error, background, surface, text. Define semantic tokens. Keep the legacy token names (`indigo`, `coral`, `mist`, and so on) as **aliases** so nothing breaks mid-migration. Phase 3 removes the aliases when unused.
- **Acceptance:** body text 7:1 or better (AAA). Normal text 4.5:1 or better. Large text and UI components 3:1 or better. Visible focus ring 3:1 or better against adjacent colours. Colour-vision table for all three types. Meaning never carried by colour alone. Results table in `palette.md`.
- **Known problem to fix:** white text on coral (about 2.7:1), on sun (about 1.8:1) and on mint (about 2.5:1) fails today, as do field borders (about 1.5:1) and the coral focus ring (about 2.7:1). The script will confirm exact figures. See [audit.md](audit.md) section 4.

### Phase 3: Tailwind revamp of the full UI

- **Agents:** `ecc:a11y-architect` (spec and implement), `ecc:code-simplifier` (dedupe), `ecc:code-reviewer` (gate each batch). **Skills:** `ecc:frontend-a11y`, `ecc:design-system`.
- **Batches (each reviewed, built and committed separately):**
  - **3a Foundation:** `src/styles/input.css` (type scale, line height, focus, motion, buttons, forms, tags, tables, cards), shared partials `header`, `nav`, `seniorNav`, `footer`, `flash`, `loginModal`, `phoneInput`, `authAside`, plus new shared partials (button, form field, status tag) where repetition is found.
  - **3b Public and auth:** `home`, `about`, `call`, `error`, `auth/*`, `events/*`, `partials/event*`, `partials/qr`.
  - **3c Account and social:** `account/*`, `social/*`, `onboarding`, and `public/js/{swipe,chat,phone-input,reveal}.js` (accessibility-only edits).
  - **3d Admin:** `admin/*`, `partials/nav`, `public/js/{dashboard,upload}.js`.
  - **3e Email:** `emails/layout.ejs` (inline styles only).
- **Standards (acceptance):**
  - Base text 18px or more (target 18 to 20px). **No rendered text under 16px** (today there is a lot at about 12 to 16px, because the root is 17px). Clear sans-serif, line height 1.5 or more, no light or thin weights.
  - Touch and click targets at least 48x48px with at least 8px gaps. Every control has a text label (icons support, never replace).
  - Strong, always-visible focus ring. Visible hover and active states. No hover-only interactions.
  - One primary action per screen where possible. Clear hierarchy, generous whitespace.
  - `prefers-reduced-motion` honoured: animations only inside `no-preference`, no infinite decorative loops (9 `.float` elements today), and the latent `.dots-drift` re-enable removed.
  - **Content is never hidden by script timing:** `data-reveal` removed from above-the-fold content, forms and auth cards (44 uses in 13 files today), and hidden-until-revealed only applies when motion is allowed.
  - Semantic HTML, one `h1` per page, labelled landmarks and forms, hints and errors linked with `aria-describedby`/`aria-invalid`, and an error summary with `role="alert"`.
  - **All three dialogs** (`loginModal`, `registered`, `thread` incoming request) share one dialog shell: capped height with scroll, focus moves in, background inert, 48px close control.
  - Responsive and usable at 320px width and 200% zoom. Sticky header and bottom nav must not hide content.
  - Repeated utility strings extracted into partials or `@layer components` classes. `@apply` used sparingly.
- **Content-freeze gate:** `docs/ui-revamp/tools/content-freeze.mjs` compares, for every template against the baseline commit, the visible text, EJS expressions, `href`, `action`, `method`, `name`, `id`, `for` and `value` attributes. Any difference fails the batch.

### Phase 4: Usability review and simplification

- **Agents:** `ecc:a11y-architect` (Nielsen's 10 heuristics, cognitive walkthrough), `ecc:e2e-runner` (axe-core, Lighthouse, 320/768/1280 viewports, keyboard-only runs), `ecc:code-reviewer`. **Skills:** `ecc:accessibility`, `ecc:browser-qa`.
- **Flows walked:** (1) visitor → home → Find events → sign up → register → volunteer offer; (2) log in / forgot password / reset; (3) Find seniors → open thread → message → report/block; (4) account → settings → ID upload → history; (5) Call us; (6) Yorùbá language switch; (7) staff: create event, ID check, attendance, reports.
- **Checks:** navigation clarity, plain-language errors, form simplicity, confirmation before destructive actions (account delete, cancel registration, remove), success feedback, forgiving inputs (phone format). Also `eslint-plugin-jsx-a11y` is **not applicable** (EJS, not JSX). Substitute: axe-core via `npx`, plus a markup lint script.
- **Output:** `docs/ui-revamp/usability-report.md` (issue, severity, fix applied or recommended). Anything needing a copy or behaviour change is a **recommendation only**.
- **Needs D2** for live runs.

### Phase 5: Built-in tutorial and onboarding

- **Agents:** `ecc:code-architect`, `ecc:a11y-architect`, `ecc:tdd-guide`. **Skills:** `ecc:frontend-a11y`, `ecc:tdd-workflow`.
- **Design:** a first-run walkthrough with large plain-language steps (short sentences, one idea per step), Next / Back / Skip buttons, highlighting the real element each step refers to, and a persistent labelled "Help" / "Show me how" button. Completion remembered in `localStorage` with a `try/catch` fallback. Keyboard and screen-reader accessible, focus managed, `aria-live` step announcements, Escape to close, **no time limits**, respects reduced motion.
- **Dependency decision:** **no new package.** A custom ~150-line module (`public/js/tour.js` plus a partial) gives full control over focus, ARIA, large type and bilingual copy. Driver.js and Shepherd are good libraries, but each adds a dependency and a stylesheet to fight against, and neither fits the "tiny, fully-controlled, bilingual" need. This keeps `package.json` untouched.
- **Existing onboarding** (`/onboarding` video page) is not modified. The tour is a separate overlay and adds no routes.
- **Files:** `public/js/tour.js` (new), `views/partials/tour.ejs` (new), `header.ejs` (Help button), `data-tour` attributes on existing elements (no behaviour change), `locales/*.json` (additive keys), `tests/ui-tour.test.js` (new).
- **Acceptance:** works with keyboard only and with a screen reader, survives reload, can be reopened from Help, and doesn't appear again after completion or skip. No existing test changes.

### Phase 6: Final verification

- **Agents:** `ecc:e2e-runner`, `ecc:code-reviewer`, `ecc:build-error-resolver` (only on failure). **Skills:** `ecc:verification-loop`.
- **Checks:** contrast, accessibility and responsive re-run over all pages. Full diff review against baseline (content, routes, forms unchanged). `npm run build` and `npm test` green. Before and after Lighthouse and axe numbers.
- **Output:** `docs/ui-revamp/FINAL-REPORT.md` (what changed, agents per phase, final palette, before/after scores, remaining recommendations).
- **Needs D2** for `npm test` and live audits.

## 7. Tooling plan

| Tool | Used for | Install |
|---|---|---|
| `@tailwindcss/cli` (already a dependency) | Rebuild `main.css` | none |
| `docs/ui-revamp/tools/content-freeze.mjs` | Prove no content/behaviour drift, DB-free | none (Node only) |
| `docs/ui-revamp/tools/contrast.mjs` | WCAG ratios and colour-vision simulation | none (Node only) |
| axe-core via `npx @axe-core/cli` | Automated accessibility checks | `npx`, not saved to `package.json` |
| Lighthouse (Chrome DevTools MCP, already connected) | Accessibility score before and after | none |
| Playwright via `ecc:e2e-runner` | Screenshots at 3 widths, keyboard runs | `npx`, not saved |

## 8. Risks

| Risk | Mitigation |
|---|---|
| No database, so no live app or tests (D2) | Static checks until it's solved. Clear flag in every summary. |
| Larger type breaks layouts, such as the 5-item mobile bottom nav at 320px | Check at 320px and 200% zoom in each batch. Shorter nav labels already exist (`item.short`). |
| Yorùbá strings are longer, so bigger text wraps more | Test every template in both languages. |
| CDN fonts and icons (Google Fonts, Font Awesome) may load slowly or fail on mobile data | Icons are decorative with text labels, so failure is graceful. Self-hosting is a recommendation, not done here. |
| Committed `main.css` drifts from `input.css` | Rebuild at the end of every batch. Phase 6 verifies. |
