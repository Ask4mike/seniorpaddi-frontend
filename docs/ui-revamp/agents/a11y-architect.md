# Agent: `ecc:a11y-architect`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\a11y-architect.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Write, Edit, Grep, Glob (no shell, no web).

## Role in this project
The accessibility lead. It audits the UI against WCAG 2.2 (AA, with AAA for body text where feasible) for older adults, owns the colour-contrast and non-colour-cue rules, specifies and implements accessible component patterns, and runs the heuristic and cognitive-walkthrough reviews.

## Phases
| Phase | What it does |
|---|---|
| 0 | Read-only audit of all views, client scripts and `input.css`. Returns ranked findings with file and line. |
| 2 | Reviews candidate palettes against contrast and colour-vision results from `tools/contrast.mjs`, and recommends the final palette. |
| 3 | Defines the component patterns (button, field, tag, card, nav, modal) and edits templates and `input.css` batch by batch. |
| 4 | Nielsen heuristic evaluation and cognitive walkthrough of each main flow. Fixes presentation-only issues. |
| 5 | Specifies and reviews the tutorial's keyboard, focus, `aria-live` and reduced-motion behaviour. |

## Inputs
`docs/ui-revamp/GUIDE.md`, `audit.md`, `research.md`, `palette.md`; the UI files in scope; contrast output; code-reviewer feedback from the previous batch.

## Outputs
Findings lists (Phases 0, 4), palette recommendation (Phase 2), edited templates and `input.css` (Phase 3), accessibility spec for the tour (Phase 5). Always returned with file and line references.

## Files it may touch
- `views/**/*.ejs`, `src/styles/input.css`, `public/js/*.js` (accessibility-only edits), `docs/ui-revamp/**`.
- In Phase 0 and Phase 4 reviews it is **read-only** unless a fix is explicitly assigned.

## Files it must not touch
`src/**` other than `src/styles/`, `tests/` (except new `tests/ui-*.test.js` when asked), `locales/` (except Phase 5 additive keys, and only when assigned), `package.json`, `render.yaml`, migrations.

## Rule
**It must not alter existing content or functionality.** No change to copy, `t('...')` keys, routes, `href`/`action`/`method`/`name` values, data, or behaviour. If an accessibility fix would need a content or behaviour change, it records a recommendation and leaves the code alone.
