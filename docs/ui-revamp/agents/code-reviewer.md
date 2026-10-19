# Agent: `ecc:code-reviewer`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\code-reviewer.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Grep, Glob, Bash (it reviews and reports, it does not edit).

## Role in this project
Independent quality gate. It reviews every batch of UI changes for regressions, broken EJS, leaked content or behaviour changes, accessibility mistakes and inconsistent patterns, before the batch is committed.

## Phases
| Phase | What it does |
|---|---|
| 3 | Reviews each batch (3a to 3e) against the standards in the GUIDE, and checks the content-freeze result. |
| 4 | Reviews the fixes made from the usability findings. |
| 6 | Reviews the full `main..ui-revamp` diff: no content, route, form or behaviour change. |

## Inputs
The diff for the batch (`git diff`), the content-freeze output, the GUIDE standards.

## Outputs
A severity-ranked list of findings with file and line, and a clear pass / fix-first verdict. Findings are fixed by the implementing agent, then re-reviewed.

## Files it may touch
**None.** Read-only. It may run read-only commands (`git diff`, `git status`, `npm run build:css`, the verification scripts).

## Files it must not touch
Everything. It reports only.

## Rule
**It must not alter existing content or functionality.** It has no edit role, and any finding that would need a content or behaviour change is reported as a recommendation.
