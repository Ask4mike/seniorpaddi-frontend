# Agent: `ecc:code-architect`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\code-architect.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Grep, Glob, Bash (it designs and does not edit).

## Role in this project
Phase 5 only. It produces the implementation blueprint for the in-app tutorial, fitted to this codebase's existing patterns (EJS partials, vanilla scripts in `public/js/`, `reveal.js`-style progressive enhancement, locale keys via `t()`).

## Phases
| Phase | What it does |
|---|---|
| 5 | Blueprint for `public/js/tour.js`, `views/partials/tour.ejs`, the Help button, `data-tour` anchors, locale keys, first-run storage, and the build order. |

## Inputs
Final templates after Phase 3, `header.ejs`, `seniorNav.ejs`, the existing `/onboarding` page, `locales/en.json` structure, the GUIDE's Phase 5 design.

## Outputs
A blueprint: files to create and change, the component interfaces, data flow (`localStorage` key, step list), and an ordered build plan. No code is applied by this agent.

## Files it may touch
**None.** Read-only.

## Files it must not touch
Everything. It plans only.

## Rule
**It must not alter existing content or functionality.** The blueprint adds a separate overlay and Help button. It does not change the existing `/onboarding` page, routes, or any existing copy. New strings are new locale keys only.
