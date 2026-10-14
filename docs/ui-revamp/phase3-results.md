# Phase 3 results: the full restyle

Part of the [UI revamp plan](GUIDE.md). Built to [design-spec.md](design-spec.md). Colour reasoning: [palette.md](palette.md). Findings fixed: [audit.md](audit.md) section 4.

## 1. Before and after, measured the same way

Same 47 page variants (every page and pop-up state in the no-database preview, with made-up sample data), same in-browser checks ([tools/page-checks.js](tools/page-checks.js): axe-core 4.10 for WCAG 2.0, 2.1, 2.2 A and AA plus best practice, and measurements of text size, control size, sideways scroll, endless animation and broken images). "Before" is the original code at commit `f82a8da`, run through the same preview and the same checks.

| Measure | Before (original) | After |
|---|---|---|
| **Phone width (320px)** | | |
| Pages with accessibility violations (axe) | 30 of 47 (91 elements; 89 are colour contrast) | **0** |
| Pages that scroll sideways | 34 | **0** |
| Controls smaller than 48 x 48px | 439 (on all 47 pages) | **0** |
| Pages with text under 16px | 47 (smallest 11.9px) | **0** (smallest 16.6px) |
| Pages with endless animation | 9 | **0** |
| Broken images | 4 | **0** |
| **Desktop width (1280px)** | | |
| Pages with accessibility violations (axe) | 47 of 47 (63 elements; 62 are colour contrast) | **0** |
| Controls smaller than 48 x 48px | 595 | **0** |
| Pages with text under 16px | 47 | **0** |
| **Yorùbá at 320px** | not measured | **0 problems on all 47** (axe, overflow, controls, text) |
| Distinct text/background colour pairs in the templates | 42 | 23 (the design reuses far fewer combinations) |
| Of those, below 4.5:1 | 22 | 1 (decorative icons only, 4.07 against the worst case; icons need 3:1) |
| Of those, at AAA (7:1 or better) | 14 | 20 (the other 2 are AA) |

What these numbers are and are not: they come from automated checks on the preview with sample data. Automated tools find only part of the real accessibility problems (they cannot judge reading order, clarity of wording, or how a screen reader sounds). They are strong evidence of the mechanical standards (contrast, size, overflow, labels, structure), not a certificate. See section 6.

## 2. What changed

- **Stylesheet** (`src/styles/input.css`, rebuilt into `public/css/main.css`, 52.6 KB): the palette as tokens (Phase 2); a 19px base text size with a fixed type scale; Noto Sans self-hosted from `public/fonts/` (57 KB, verified for Yorùbá); shared components (`.btn` family, `.chip`, `.field`/`.hint`/`.error`, `.check`, `.alert`, `.tag-*`, `.nav-link`/`.tab-link`, `.dialog`, `.table-wrap`, `.skip-link`); all old colour names and grey overrides removed (nothing uses them); no looping animation, no scroll-reveal, no hover movement; a `prefers-reduced-motion` rule that actually applies.
- **52 of 54 templates** restyled. Only `orgFields.ejs` and `eventImage.ejs` needed nothing. Across them: larger labelled buttons (Skip and Register are text buttons, not round icons), every status with an icon and words, linked field hints and errors, one dialog shell for the three pop-ups, tables in scroll wrappers with column scopes, `lang` on language names, solid fills in place of gradients, cards and banners that stack on phones.
- **Scripts** (accessibility only): `swipe.js` ignores arrow keys on buttons inside a card; new `dialog.js` (focus into the pop-up, page behind switched off, Escape closes only when nothing has been typed); `chat.js` and `dashboard.js` class names updated; `reveal.js` deleted.
- **Email layout**: larger inline sizes and a darker footer colour (emails cannot use Tailwind).
- **Nothing outside the UI**: no backend, test, locale, `package.json` or `render.yaml` change. 58 files changed, +1,221 / -917 lines, all in `views/`, `public/` and `src/styles/`.

## 3. Real defects found and fixed along the way

These were in the original app, or were introduced during this phase and caught by review:

| Defect | Where | Fix |
|---|---|---|
| **The "Skip to main content" link never appeared for keyboard users.** The Font Awesome stylesheet from the CDN defines its own unlayered `.sr-only`, which beats Tailwind's focus rule | every page (original bug) | A dedicated `.skip-link` class that nothing can override. Verified by pressing Tab in a real browser |
| Four home-page pictures and the event-form preview pointed at `.png` files that are `.jpg` | `home.ejs`, `admin/event-form.ejs` | Extension corrected |
| Request pop-up in a conversation had no height limit, so its buttons were unreachable at high zoom | `social/thread.ejs` | Shared dialog shell with a height cap |
| Pop-ups did not move focus or hide the page behind them | 3 dialogs | `dialog.js` (verified: focus lands on the title, 7 page regions switched off) |
| Arrow keys on the Skip or Register button also skipped or registered | `swipe.js` | One-line guard |
| Endless floating animations on 9 pages; scroll-reveal could leave content invisible | landing, about, sign-in pages | Removed |
| 34 pages scrolled sideways at 320px in the original (not individually diagnosed). In the revamp, the causes I found and fixed were: a bottom bar whose five items did not fit, an unbreakable long word, hidden screen-reader words in a wide table, and a flex column that would not shrink | senior and staff pages | Bar sizing, long words wrap, `.table-wrap` positioned, `min-w-0` on the staff column |
| Empty table header cell (axe violation) | `admin/dashboard.ejs` | Empty data cell |
| **Returning visitors would keep the old stylesheet and scripts for up to 7 days** (production serves static files with a 7-day cache), mixing new pages with old styles. A cached old `chat.js` would draw message bubbles with a colour class that no longer exists | live site, after deploy | `?v=ui1` on every stylesheet and script tag. **Bump it whenever CSS or scripts change** |
| Two phone-field problems: a duplicate `id` on the staff page, and the hint and server error not linked to the field | `phoneInput.ejs`, `signup.ejs`, `staff.ejs` | Optional `describedBy` and `invalid` inputs on the partial |
| One existing test depends on exact markup (`name="status_N" value="attended" class="h-6 w-6" checked`). A new attribute would have broken it | `admin/attendance.ejs` | Attribute order restored. The only two markup-reading assertions in the whole suite were checked by hand |

## 4. Differences from the original that the content-freeze checker reports

The checker compared all 54 templates with the original and found **17 with reviewed differences** (recorded in [tools/freeze-approved.json](tools/freeze-approved.json)). Each is deliberate and none changes what a page says or does:

- Fixed image extensions (2 files), the font links removed and font preload added, the `reveal.js` tag removed, the `dialog.js` tag added.
- Version marker `?v=ui1` on the stylesheet and 8 script tags.
- The Skip and Register words (event card) and the Skip and Message words (Find seniors) moved inside their buttons, so `aria-label` was dropped. The same words are visible text now.
- A visible "Log out" word (an existing word) on the staff phone bar.
- The first menu moved below the logo row in the header (reading order: logo, language, Call, Log in, then the menu).
- `call.ejs`: a styled paragraph is now a real `<h2>`. `registered.ejs`: the dialog title is now the page's `<h1>`.
- Staff pages: status icons inside the System tags, `aria-live` switched off on the auto-refreshing dashboard numbers, an empty header cell made a data cell.
- Phone helper inputs, and `autocomplete="email"` on the settings email field.

## 5. How the work was done (agents)

| Role | Who | Note |
|---|---|---|
| Foundation stylesheet, email layout, all final fixes, verification | lead session | Wrote `input.css` and the tools directly because the whole phase depends on it being right |
| Template batches 3a (partials and `swipe.js`), 3b (public, sign-in, events), 3c (account, social), 3d (staff) | 4 x `ecc:a11y-architect` in parallel | They have no shell, so they could not run the checker or the build. Every claim was re-verified by me |
| Review | `ecc:code-reviewer` (read-only) | Found 1 High and 4 Medium issues, all fixed (section 3), plus Low items, most fixed |
| `ecc:code-simplifier` | **not run** | Planned in the GUIDE. The consolidation it would have done (shared danger button, alert layout, standalone `.hint`, removal of unused classes and aliases) came out of the review and was done by hand |
| `ecc:e2e-runner` | not used yet | Phase 4 |

## 6. What this does not prove, and what was left alone

- **The existing Jest test suite was not run.** It needs PostgreSQL, which you chose not to install. I checked the two assertions that read markup by hand, and the checker proves text, links, forms and script hooks are unchanged, but a green `npm test` would be stronger.
- **The live app was not run.** Everything above comes from the no-database preview. Login, form submission, registration, messaging and uploads were not exercised.
- **No real phone, no screen reader.** Nothing was tried on an Android phone, with TalkBack, VoiceOver or NVDA. Axe checks structure, not whether the page makes sense when read aloud.
- **Sample data only.** Real events with long titles or Yorùbá names may wrap differently.
- **Font Awesome and axe still come from CDNs.** Icons are decorative with text beside them, so a failure degrades gracefully.
- **Colour-blindness figures** come from standard published matrices that I entered by hand, not an independent tool.
- **Low review items left as they are** (no effect on the checks): an empty `aria-describedby=""` on 10 fields that have no error, the file-upload box styled twice on two pages, three hand-built "empty state" circles, and a now-unused `js` class on `<html>`.
- **Needs a content or behaviour change, or is outside the UI** (see [audit.md](audit.md) section 4.4): confirmation steps before cancel, block, delete and remove; an unread cue for screen readers; captions for the welcome video; text baked into `hero.png`; the Call link below the `lg` width; adding `npm run build` to Render's build command; self-hosting Font Awesome.

## 7. How to look at it

- **Double-click** `docs/ui-revamp/tools/start-preview.bat` (it installs the project's packages the first time), or run `node docs/ui-revamp/tools/preview-server.mjs` and open http://localhost:4100/__pages. The preview needs no database. Add `?lang=yo` for Yorùbá and `?as=guest`, `?as=senior` or `?as=admin` to change who is "logged in".
- After editing a template or `input.css`, run `npm run build:css` and reload.
