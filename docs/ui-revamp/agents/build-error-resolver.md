# Agent: `ecc:build-error-resolver`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\build-error-resolver.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Write, Edit, Bash, Grep, Glob.

## Role in this project
**On demand only.** Used if `npm run build` (Tailwind CSS compile) or `npm test` fails during Phase 3 or Phase 6, and the cause is a UI-side error: an unknown utility, an `@apply` of a missing class, a malformed `@theme` token, or a broken EJS include.

## Phases
| Phase | What it does |
|---|---|
| 3, 6 | Makes the smallest fix that turns the build green, then hands back to the reviewer. Not invoked if everything is green. |

## Inputs
The failing command's full output and the batch diff.

## Outputs
A minimal diff and a one-line explanation of the root cause.

## Files it may touch
`src/styles/input.css` and `views/**/*.ejs` only, and only the lines the error points to.

## Files it must not touch
`src/**` other than `src/styles/`, `package.json` (it must not "fix" a build by adding or upgrading dependencies), `render.yaml`, `locales/`, tests, and `public/css/main.css` by hand (always rebuilt, never edited).

## Rule
**It must not alter existing content or functionality.** A fix that would require removing or rewording content, changing a route, or editing backend code is not made. It is reported to the lead session instead.
