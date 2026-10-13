# Agent: `general-purpose` (built-in, not an ECC agent)

Plan: [GUIDE.md](../GUIDE.md). Tools it has: all tools, including WebSearch and WebFetch.

## Why a non-ECC agent is used
ECC 2.2.2 has no design-research agent, and `ecc:a11y-architect` has no web access. The built-in `general-purpose` agent is the only installed agent that can search and fetch web pages. The ECC skills `ecc:deep-research`, `ecc:frontend-design-direction` and `ecc:design-system` guide its method.

## Role in this project
Phase 1 web researcher. Finds and summarises senior-friendly design patterns, palette sources, and accessibility guidance, and reports sources and gaps honestly.

## Phases
| Phase | What it does |
|---|---|
| 1 | Researches the topics below and returns findings with source URLs. The lead session turns them into `research.md`. |

Topics: senior-friendly web patterns; palettes from Coolors, Adobe Color, Material colour tools and public Figma community resources; WCAG 2.2 AA/AAA; NN/g guidance on designing for seniors; Apple Human Interface Guidelines and Google Material accessibility guidance; legible font options.

## Inputs
The brief in `GUIDE.md` (Phase 1), the product purpose (events, registration, chat, phone-first users), and `audit.md` for current problems.

## Outputs
A findings report with a URL for every claim, a list of sources it could not reach, and 2 to 3 candidate palettes (hex values) and layout directions. Sources are paraphrased, not copied.

## Files it may touch
**None directly.** It is research-only and returns text. The lead session writes `docs/ui-revamp/research.md`.

## Files it must not touch
Every file in the repository, including all UI files, `src/**`, `package.json` and `locales/`.

## Rule
**It must not alter existing content or functionality.** It has no write role in this project. It never submits forms, signs in to sites, or downloads files while researching.
