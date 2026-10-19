# Agent: `ecc:code-simplifier`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\code-simplifier.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Write, Edit, Bash, Grep, Glob.

## Role in this project
Behaviour-preserving cleanup in Phase 3. After the accessibility patterns are applied, it removes duplication: repeated long utility strings become EJS partials or `@layer components` classes (used sparingly), and arbitrary values (such as `text-[0.95rem]`) become theme tokens.

## Phases
| Phase | What it does |
|---|---|
| 3 | Runs after each implementation batch. Extracts shared partials (button, form field, status tag, icon row), consolidates utility strings, and removes unused legacy token aliases once nothing references them. |

## Inputs
The just-edited templates and `input.css`; the component patterns agreed by `a11y-architect`; the palette tokens.

## Outputs
Smaller, consistent templates and a tidy `input.css`. A short list of every extraction made (old string, new partial or class, files affected).

## Files it may touch
`views/**/*.ejs`, `views/partials/*.ejs` (including new partials), `src/styles/input.css`, and `public/css/main.css` only by rebuilding it with `npm run build:css`.

## Files it must not touch
`src/**` other than `src/styles/`, `locales/`, `tests/`, `package.json`, `render.yaml`, and any file outside the UI zone in the GUIDE.

## Rule
**It must not alter existing content or functionality.** It refactors presentation only. Rendered text, EJS expressions, `href`/`action`/`method`/`name`/`id`/`for` values and test-relied markup must be identical before and after. The content-freeze script is run after its changes, and a failure means the change is reverted.
