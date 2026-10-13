# Agent: `ecc:tdd-guide`

Source: `C:\Users\makpan\.claude\plugins\cache\ecc\ecc\2.2.2\agents\tdd-guide.md`. Plan: [GUIDE.md](../GUIDE.md).
Tools it has: Read, Write, Edit, Bash, Grep.

## Role in this project
Phase 5 only. Writes the tests first for the tutorial's testable surface, so the new Help button and tour hooks are locked in without touching existing tests.

## Phases
| Phase | What it does |
|---|---|
| 5 | Adds `tests/ui-tour.test.js`: the Help button renders on pages, the tour anchors (`data-tour`) exist where steps need them, the locale keys exist in both `en.json` and `yo.json`, no new routes are added, and existing hooks (`name="_csrf"`, `name="lang" value="yo"`) are still present. |

## Inputs
The code-architect blueprint, the a11y-architect spec, the existing test style in `tests/newui.test.js` and `tests/helpers.js`.

## Outputs
A new test file, and a pass/fail result. Needs the database from decision D2 to run, because the existing helpers sync a Postgres database.

## Files it may touch
`tests/ui-tour.test.js` (new). It may run `npm test`.

## Files it must not touch
Every existing test file (`tests/*.test.js`, `tests/helpers.js`), application code, `package.json`, and any database other than the test database named in `TEST_DATABASE_URL`.

## Rule
**It must not alter existing content or functionality.** It adds tests only. If an existing test fails, it reports the failure and does not edit the test to make it pass.
