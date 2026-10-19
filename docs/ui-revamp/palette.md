# Phase 2: Palette selection and validation

Part of the [UI revamp plan](GUIDE.md). Built on [research.md](research.md). Raw tool output: [evidence/palette-results.md](evidence/palette-results.md). Re-run any time with `node docs/ui-revamp/tools/contrast.mjs` from the project root.

## 1. Decision

**One palette: research candidate A "Evolution", with the stricter field border and focus ring from candidate C.** It keeps the indigo that users and the Figma file already know, replaces every colour that failed contrast, and adds the missing pieces (focus colours, a real field border, status tints).

What changes for users, in plain terms:

| Today | After | Why |
|---|---|---|
| Coral `#f2795b` buttons and kickers (white text 2.74:1) | Terracotta `#9c4c16` (white text 6.07:1) | Readable, still warm |
| Mint `#3bb89f` (white text 2.46:1) | Deeper teal `#2a8371`, decorative only | No text depends on it |
| Lilac `#8e7cc3` (white text 3.61:1) | Deep violet `#5b4aa0` (7.16:1) | Passes AAA |
| Leaf green `#1f7a5c` (5.25:1) | Forest green `#175a3a` (8.20:1), the same green the Figma file uses for volunteer buttons | Passes AAA |
| Grey helper text 4.31:1 on tinted panels | Slate `#465072` (7.06 to 7.92:1) | Passes AAA on every surface |
| Form field border 1.47:1 | Slate `#6b7694` (4.37 to 4.52:1) | Fields are visible as fields |
| Coral keyboard focus ring 2.65:1 | Blue `#2f5bd6` (5.2 to 5.9:1), yellow `#f6b93b` on dark surfaces (5.7 to 7.7:1) | Always visible |
| Amber, red tags 6.55 and 6.70:1 | `#6b4200` and `#991c1c` (7.78 and 7.05:1) | Passes AAA |
| Indigo `#22407a`, ink `#16213e`, page `#fafbff`, mist `#eef2fa` | Unchanged | Brand and body text already passed |

## 2. The tokens (in `src/styles/input.css`, `@theme`)

The central config. Tailwind v4 has no `tailwind.config`, so this block is it. Utilities follow the token name, for example `bg-primary`, `text-muted`, `border-border-strong`, `outline-focus`.

| Role | Token | Hex | Used for |
|---|---|---|---|
| Primary | `primary` / `primary-dark` | `#22407a` / `#172d57` | Main buttons, links, header, footer, staff sidebar. Dark is the hover state |
| Secondary | `secondary` | `#5b4aa0` | Charts and the second stop of decorative gradients |
| Accent | `accent` / `accent-dark` | `#9c4c16` / `#7f3e12` | Call-to-help buttons and badges. **Solid fill with a white label only** |
| Success | `success` / `success-dark` / `success-bg` | `#175a3a` / `#0f4029` / `#ecfdf5` | Volunteer and positive buttons, "Registered" tags |
| Warning | `warning-ink` / `warning-bg` | `#6b4200` / `#fff1cc` | "Almost full" tags |
| Error | `error` / `error-bg` | `#991c1c` / `#fde8e8` | Error text and borders on the tint, "Full" tags |
| Background | `background` | `#fafbff` | Page |
| Surface | `surface` / `surface-muted` / `surface-subtle` | `#ffffff` / `#eef2fa` / `#f4f6fb` | Cards and fields / panels / staff area page |
| Text | `body` / `muted` | `#16213e` / `#465072` | Text / helper text and table headings |
| Light text | `on-primary-muted` | `#dbe4f8` | Secondary text on dark brand surfaces (replaces `text-white/80`) |
| Lines | `border-strong` | `#6b7694` | Form field borders |
| Focus | `focus` / `focus-on-dark` | `#2f5bd6` / `#f6b93b` | Keyboard ring on light / on dark surfaces |
| Decorative | `sun` / `mint` | `#f6b93b` / `#2a8371` | Fills and icons only |

**Rules that go with the tokens** (also written in the CSS comment so the next developer sees them):
1. White text only on primary, primary-dark, secondary, accent, accent-dark, success, success-dark.
2. Body, muted and error text only on the background, surface, surface-muted, surface-subtle or their tints.
3. `sun` and `mint` are never text, never white-text backgrounds, and never the only cue.
4. Status is never colour alone: icon plus word (section 6).
5. Accent is never a text colour, and error is never a fill. They sit close together for colour-blind readers (section 5).

**Legacy aliases (so nothing breaks before Phase 3).** `ink`, `indigo`, `indigo-dark`, `mist`, `coral`, `coral-dark`, `lilac`, `leaf`, `leaf-dark`, `amber-tag`, `amber-bg`, `full-tag` and `full-bg` now point at the tokens above in a `@theme inline` block, so all 54 templates already pick up the new colours. Phase 3 moves templates to the semantic names and deletes each alias when unused. **Grey overrides:** `gray-300` (field border), `gray-500` and `gray-600` (helper text) are routed to `border-strong` and `muted`, which fixes 54 class uses (12 field borders, 16 `text-gray-500`, 26 `text-gray-600`) without touching templates. `gray-200` (decorative rings), `gray-400` (disabled) and `gray-700` are left alone.

**Two other edits in `input.css`:** the page background is now the `background` token instead of a hard-coded hex, and the global focus ring uses the `focus` token, with the yellow ring on anything inside a `.bg-primary`, `.bg-primary-dark`, `.bg-indigo` or `.bg-indigo-dark` parent (footer, staff sidebar, auth panel). No sizes, spacing or layout were touched.

## 3. Contrast results for the palette

Ratios from `contrast.mjs`, **cross-checked with axe-core 4.10.2** (the engine inside Lighthouse) on swatches built from these hex values in a real browser. axe agreed with every pair to within 0.02 (it truncates where the tool rounds), and flagged the three old pairs I included as failures (white on old coral 2.74, white on sun 1.76, old grey-500 on mist 4.31). Targets: 7:1 for body text, 4.5:1 minimum for normal text, 3:1 for large text and UI.

| Pair | Ratio | Verdict |
|---|---|---|
| Body text on background / surface / muted surface | 15.37 / 15.89 / 14.17 | AAA |
| Muted text on background / surface / muted surface / admin background | 7.66 / 7.92 / 7.06 / 7.33 | AAA |
| White on primary / primary-dark | 10.08 / 13.55 | AAA |
| White on accent / accent-dark | 6.07 / 8.08 | AA (AAA for large bold button text) |
| White on success / success-dark | 8.20 / 11.76 | AAA |
| White on secondary | 7.16 | AAA |
| Success text on its tint | 7.79 | AAA |
| Warning text on its tint | 7.78 | AAA |
| Error text on white / on its tint | 8.28 / 7.05 | AAA |
| Light text on primary / primary-dark | 7.91 / 10.63 | AAA |
| Body text on sun (decorative fill) | 9.02 | AAA |
| Field border on background / white / muted surface | 4.37 / 4.52 / 4.03 | passes 3:1 |
| Focus ring on background / white / muted / admin | 5.66 / 5.85 / 5.22 / 5.41 | passes 3:1 |
| Dark-surface focus ring on primary / primary-dark | 5.72 / 7.69 | passes 3:1 |
| Mint, success, error as graphics on white | 4.58 / 8.20 / 8.28 | passes 3:1 |

**Everything is AAA except two things, both deliberate.** The accent label is 6.07:1, which meets AA for any size and AAA for large bold text, and every accent label in the app is a button label (20px bold or larger after Phase 3). Accent as text is not allowed (rule 5).

## 4. Every pair the templates actually use

The checker reads all 54 templates, expands the EJS ternaries, and pairs each text colour with the background in the same class. 42 unique pairs found. Scope and limits are in the script header.

| | Baseline | After Phase 2 |
|---|---|---|
| Below 3:1 (fails for any text) | 13 | **2** |
| 3:1 to 4.5:1 (large text only) | 9 | **4** |
| 4.5:1 to 7:1 (AA) | 6 | 9 |
| 7:1 and above (AAA) | 14 | **27** |

**Pairs still below 4.5:1, and who fixes them.** None can be fixed by changing a colour, because each is a template using a colour in a way the rules forbid:

| Ratio | Where | Why it is still low | Fix |
|---|---|---|---|
| 1.76 | `about.ejs:35`, `home.ejs:118` (gradient banner), `admin/dashboard.ejs:92` | White text on the sun-yellow fill | Phase 3: solid dark fills, or dark text on sun |
| 4.07 | `partials/authAside.ejs:5-7` | Sun-coloured text. Measured against the worst possible parent (the violet end of the gradient). On indigo it is 5.72 | Phase 3: redo the panel |
| 4.08 | `about.ejs:23-25` and 4 more (7 uses) | `text-mint` check icons beside text. Icons need only 3:1, which they meet | Phase 3: mark them as icons, no change needed to pass |
| 4.45 | `partials/nav.ejs:45` | `text-white/70` on the sidebar. Worst-case parent is violet, on indigo it is 5.87 | Phase 3: use `on-primary-muted` instead of opacity |

**Pairs at AA only (4.5 to 7), body-size text to lift in Phase 3:** `text-white/80`, `/85` and `/90` on dark surfaces (10 uses, replace with `on-primary-muted`), `text-coral` kickers on light surfaces (10 uses, 5.41 worst case, move to `primary` or large bold), and white on accent buttons (4 uses, fine for large bold labels).

**Component classes in `input.css`** (the tool checks them separately):

| Component | Before | After |
|---|---|---|
| `.btn` label / hover | 10.08 / 13.55 | 10.08 / 13.55 |
| `.btn-volunteer` label / hover | 5.25 / 7.93 | 8.20 / 11.76 |
| `.btn-coral` label / hover | 2.74 / 3.88 | 6.07 / 8.08 |
| `.field input` border | 1.47 | 4.52 |
| `.hint` on page / white / muted surface | 7.31 / 7.56 / 6.74 | 7.66 / 7.92 / 7.06 |
| `.error` on page / on tint | 7.61 / 6.70 | 8.00 / 7.05 |
| `.tag-amber` / `.tag-full` / `.tag-leaf` | 6.55 / 6.70 / 4.99 | 7.78 / 7.05 / 7.79 |
| `.admin-table th` on page / admin background | 4.68 / 4.47 | 7.66 / 7.33 |
| Focus outline on page / white / muted / dark brand surface | 2.65 / 2.74 / 2.44 / 3.68 | 5.66 / 5.85 / 5.22 / 5.72 |

## 5. Colour-blindness check

Method: the Machado, Oliveira and Fernandes (2009) simulation matrices at full severity (protanopia, deuteranopia, tritanopia), applied in linear RGB, then the same contrast formula. For "can two colours be told apart", CIE76 delta E.

**Readability survives.** Every key text pair stays above 4.5:1 under all three types (for example body 15.0 to 15.6, muted 7.4 to 7.8, white on primary 9.4 to 10.6, error on tint 6.2 to 9.1, white on accent 5.5 to 7.2). Contrast here is brightness contrast, which colour blindness does not change much. Two AAA pairs slip just under 7 for deuteranopia only: error on its tint (7.05 falls to 6.17) and white on accent (6.07 falls to 5.50, which was never AAA). Both stay comfortably AA.

**Colour alone cannot carry meaning, and the data says why.** These pairs can look alike (delta E under 25):

| Pair | Normal vision | Colour-blind | What it means for design |
|---|---|---|---|
| accent / error | 24 | 11 to 22 | Both dark warm colours. Rule 5 keeps them in different forms: accent is a solid button fill, error is coloured text or a border on a pale tint with an icon |
| accent / warning-ink | 20 | 8 to 23 | Warning is brown text on a pale yellow tint with a triangle icon and words. Accent is a solid fill. Different forms |
| success / error | 82 | 11 to 28 (protan, deutan) | Red and green merge. Every status has an icon and a word |
| success / warning-ink | 51 | 22 to 31 | Same |
| primary / secondary | 23 | 12 to 16 | Only used side by side in decorative gradients and chart bars. Charts need labels or patterns (audit 4.1, item 14) |
| success / mint | 19 | 18 to 19 | Mint is decorative only |
| primary / success under tritanopia | 63 | 13 | Blue and green merge for tritanopia. Buttons differ by label and position, not colour |

Nothing in the app may depend on telling these apart by colour.

**Gap:** the simulation matrices are the published coefficients entered by hand, and delta E 76 is a simple distance. An independent cross-check with a colour-blindness tool (Figma's checker, linked in research.md) was not possible in this session. Treat the table as strong evidence, not proof, and eyeball the final screens in Phase 4.

## 6. Non-colour cues (required in Phase 3)

| Meaning | Colour | Also required |
|---|---|---|
| Success, registered, saved | `success` on `success-bg` | Check icon and a word ("Registered", "Saved") |
| Warning, almost full | `warning-ink` on `warning-bg` | Triangle icon and words ("Almost full") |
| Error | `error` on `error-bg`, a 2px `error` border on the field | A warning icon (drawn by the stylesheet), the message beside the field, `aria-describedby`. An "Error:" prefix would need new wording in both languages, so it is a recommendation, not done |
| Full, unavailable | `error` tag | The word "Full" and disabled controls |
| Selected or current | `primary` fill | `aria-current`, a check icon, and a thicker border |
| Unread | `accent` badge | A number or dot icon, and an accessible label |
| Links | `primary` | Always underlined (already so) |
| Keyboard focus | `focus` / `focus-on-dark` | 3px outline with 2px offset, never removed |

## 7. How this was built and verified

| Step | Result |
|---|---|
| Rebuilt the CSS from unchanged source before touching anything | 157 bytes different from the committed file. Cause found: Tailwind scans every file in the repo, and the committed CSS contained four classes (`min-h-12`, `max-w-2xl`, `pb-2`, `shrink`) that exist only as words in `docs/MVP.md`. My new docs would have added 14 more |
| Added `@source not "../../docs";` to `input.css` | The docs no longer leak into the CSS. No template or script uses those four classes |
| Wrote the tokens, rebuilt `public/css/main.css` | Build clean (Tailwind 4.3.3). No class that templates need was removed. All nine old brand hex values are gone from the output, all new ones are present |
| Pair scan before and after | Table in section 4 |
| axe-core cross-check in a real browser | 19 swatches, every figure within 0.02 |
| Colour-vision simulation | Section 5 |
| Visual swatch of the final palette in the browser pane | Reviewed, looks coherent |

**Not done here and why:** I could not open the real app in a browser (no database on this machine, see the Phase 2 summary), so the new colours have been judged on swatches and on the numbers, not on the live pages. Until Phase 3, pages will look slightly mismatched: terracotta where coral was, darker field borders, and the sun-yellow gradient banners still carry white text.

## 8. Handed to Phase 3

1. Replace sun-fill-with-white-text (3 places) and the coral-to-sun and leaf-to-mint gradient banners with solid fills.
2. Replace `text-white/NN` and `opacity-NN` text with `on-primary-muted`.
3. Make `text-coral` kickers `primary` (or large bold accent). Stop using accent as text.
4. Move templates to semantic names, then delete unused aliases and the grey overrides.
5. Add the status icons and words from section 6.
6. Replace the hard-coded `bg-[#f4f6fb]` (admin shell) with `surface-subtle`.
7. Typeface: Noto Sans, self-hosted (decision pending, see the Phase 2 summary).
