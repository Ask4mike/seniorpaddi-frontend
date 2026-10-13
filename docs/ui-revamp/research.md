# Phase 1: Design research

Part of the [UI revamp plan](GUIDE.md). Researched 13 Oct 2026 by two `general-purpose` web-research agents (the ECC set has no research agent, see GUIDE section 4) plus the lead session, who read the project's own Figma file and ran the font test in section 5.

**How to read this document.** Sources are paraphrased, never copied. "Verified" means I checked it myself: the font glyph test and every contrast ratio were recomputed. "Reported" means a research agent read it and I have not re-fetched it. Gaps and unverified items are listed in section 9.

## 1. Summary of findings and recommendations

| Topic | Finding | Recommendation |
|---|---|---|
| **Font** | **Atkinson Hyperlegible, the font in your Figma file, cannot render Yorùbá.** In a real browser test it fails ẹ, ọ, ṣ and every tone-marked form, exactly like a latin-only control font (section 5). Noto Sans, Inter, Source Sans 3, Lexend and your current Plus Jakarta Sans all pass. | **Noto Sans** (Google's own metadata lists Yorùbá), self-hosted as one merged file. Fallback: Source Sans 3. |
| **Palette** | Three candidates computed and verified (section 6). Your current coral, sun and mint fail with white text (2.7, 1.8 and 2.5 to 1). Field borders are 1.5 to 1. | Lean **A "Evolution"**: keeps your indigo and the Figma green, fixes every failing pair. Final choice is Phase 2. |
| **Layout** | Hub of big labelled tiles plus a labelled bottom bar on phones (what your Figma already shows), with GOV.UK-style single-column forms. | Direction 2 with Direction 1's form styling. Anything that changes page flow is blocked by the no-change rule (section 7). |
| **Sizes** | Body 19 to 20px, nothing under 16px, targets 48px with 8px gaps, line length about 65 characters. | As in the GUIDE, now with sources. |
| **Tutorial** | NN/g found a tutorial did not improve task success (91% with versus 94% without, not significant). | Keep Phase 5 short, optional and re-openable. Maximum 4 to 5 steps. |

## 2. The project's own Figma redesign (read-only)

Source: the file linked in the README (`UI-SeniorPadi`, page "New UI", 10 mobile screens at 412 x 917). I read its structure and a few nodes. I did not edit it. Exact variable tokens could not be extracted (the tool needs a selection in the Figma desktop app), so the values below come from the nodes I read.

**What it shows**
- Home is a hub of **three large labelled cards** (Find events, Find seniors, Call SeniorPadi), each with a circle icon, a title and a one-line description. This matches the existing home page's three action cards.
- Event card uses **labelled buttons "Skip" and "Register"**, 56px high, 20px bold text, 10px corner radius, side by side. The live site uses icon-only round buttons with the label underneath.
- **Pop-ups are bottom sheets** (log in, "You're registered", volunteer offer) with a dimmed backdrop.
- A **labelled 5-item bottom nav** on every screen, a header with the language button ("Yorùbá" or "English"), and an Account screen that is a plain list of labelled settings.
- Find seniors has three clear states: upload ID, ID being checked, profile card.

**Tokens seen**
- Header and cards: indigo `#22407a`. Volunteer button: dark green `#175a3a`. Buttons: white label on indigo, or indigo border with indigo label.
- Type: **Atkinson Hyperlegible** Bold and Regular. Card title 24px, card body 17px, button label 20px, logo 26px, header button 18px.

**What I can and cannot adopt**
- Adopt: large labelled cards, labelled Skip/Register buttons, bottom-sheet dialogs, the labelled bottom bar, the 56px button height, the indigo and green.
- Cannot adopt as drawn: the Figma home is **shorter** than the live home page (no "how it works", "upcoming events" or volunteer banners). Removing sections would change content, so only the visual language carries over.
- Cannot adopt: Atkinson Hyperlegible, because of Yorùbá (section 5).

## 3. Standards adopted (WCAG 2.2, with W3C's own pages as sources)

Level A and AA are mandatory. AAA is the target wherever it is realistic for body text. Base URL: https://www.w3.org/TR/WCAG22/ and the matching `.../WAI/WCAG22/Understanding/<name>.html` pages. Reported by the agent from W3C pages. The wording was passed through a summariser, so spot-check exact wording before quoting.

| SC | Level | What it requires (paraphrased) | Decision for SeniorPadi |
|---|---|---|---|
| 1.4.1 Use of colour | A | Colour is never the only signal | Icon plus words with every status colour. Underline links |
| 1.4.3 Contrast (min) | AA | 4.5:1 text, 3:1 large text | Floor |
| 1.4.6 Contrast (enhanced) | AAA | 7:1 text, 4.5:1 large | **Target for body, labels, buttons, errors** |
| 1.4.11 Non-text contrast | AA | 3:1 for field borders, focus rings, icons that carry meaning | Adopt (today's field border is 1.47:1) |
| 1.4.4 Resize text, 1.4.10 Reflow, 1.4.12 Text spacing | AA | Works at 200%, at 320px wide, and with user text spacing | Adopt. rem units, no fixed heights, never block zoom. Admin tables in a scroll wrapper |
| 1.4.8 Visual presentation | AAA | At most 80 characters per line, left-aligned, line spacing at least 1.5 | Adopt: cap lines at about 65ch (today `.page` allows 100+) |
| 2.4.7 Focus visible, 2.4.11 not obscured | AA | Keyboard focus is visible and not hidden by sticky bars | Adopt. Scroll padding for the sticky header and bottom nav |
| 2.4.12, 2.4.13 | AAA | Not obscured at all. Focus indicator of at least 2px with 3:1 change | Target. A 3px offset outline is enough |
| 2.5.8 Target size (min) | AA | 24 x 24 CSS px | Floor only |
| 2.5.5 Target size (enhanced) | AAA | 44 x 44 CSS px | **Adopt 48px with 8px gaps** (also Android's rule) |
| 2.5.1, 2.5.7 | A, AA | Swipe or drag needs a single-tap alternative | Swipe cards already have buttons. Keep them visible |
| 2.2.2 Pause, stop, hide | A | Moving content over 5 seconds can be paused | No looping decoration (9 `.float` elements today) |
| 2.3.3 Animation from interactions | AAA | Interaction motion can be turned off | Honour `prefers-reduced-motion` |
| 3.3.1, 3.3.3, 3.3.4 | A, AA | Errors in text, suggested fixes, reversible or confirmed changes | Linked errors now. Confirmations are recommendation-only (new behaviour) |
| 3.3.7 Redundant entry | A | Don't ask twice for the same information | Already satisfied (no confirm-password field) |
| 3.3.8 Accessible authentication | AA | Password fields must allow paste and autofill, no cognitive test | Keep paste and `autocomplete` working. Do not block them |
| 3.2.6 Consistent help | A | Help sits in the same place on every page | Keep the Call link in a fixed position (it is hidden below the lg width today, see audit 4.4) |
| 4.1.3 Status messages | AA | Announced without moving focus | `role="status"` or `role="alert"` on flash messages |

## 4. What older-adult research says

| Source (date) | What it says | Use here |
|---|---|---|
| W3C WAI, *Web Accessibility for Older Users*, hub page updated 20 Nov 2025. https://www.w3.org/WAI/older-users/ | WCAG covers most older-user needs | Frames the whole project |
| W3C WAI, *Developing Websites for Older People*, reviewed 2018 (WCAG 2.0 era, no target-size rule). https://www.w3.org/WAI/older-users/developing/ | 200% text, relative units, no justified or centred blocks, 4.5:1 or 7:1, soft backgrounds instead of stark white, visible focus, plain language, review before submit | Off-white page background kept. Left-aligned text |
| W3C WAI literature review (2008, updated 2018). https://www.w3.org/WAI/older-users/literature/ | Contrast sensitivity falls from the mid-40s. Dark blue next to black is hard to tell apart. Arthritis affects at least half of over-65s, so small targets, radio buttons and fly-out menus are hard. Clutter and motion cost memory | Supports 48px targets and no hover-only menus. Radio and checkbox rows become whole-row targets |
| NN/g, *Usability for Older Adults: Challenges and Changes*, 8 Sep 2019. https://www.nngroup.com/articles/usability-for-senior-citizens/ | Tiny or faint text and small targets keep recurring. Forgiving input (accept hyphens and brackets in phone numbers). Plain, prominent error messages. Simplicity matters most | Phone forgiveness is a recommendation (behaviour). Error styling is in scope |
| NN/g, *Usability for Senior Citizens: Improved, But Still Lacking*, 28 May 2013 (dated). https://www.nngroup.com/articles/usability-seniors-improvements/ | Default text at least 12pt (16px). Large links with whitespace. Pull-down and multi-level menus are hard. Strict forms punish typos | Supports the 16px floor and flat navigation |
| NN/g, *Touch Targets on Touchscreens*, 5 May 2019. https://www.nngroup.com/articles/touch-target-size/ | At least 1 cm x 1 cm. Desktop-sized controls may fail with a finger | Supports 48px |
| NN/g, *Error-Message Guidelines*, 14 May 2023. https://www.nngroup.com/articles/error-message-guidelines/ | Put the error near the field, not by colour alone, say what went wrong, suggest a fix, keep the user's input | Error pattern for Phase 3 |
| NN/g, *Modal & Nonmodal Dialogs*, 23 Apr 2017. https://www.nngroup.com/articles/modal-nonmodal-dialog/ | Use modals for critical or irreversible warnings. Keep them short and easy to dismiss | Dialog shell in Phase 3 |
| NN/g, *Hamburger Menus and Hidden Navigation*, 26 Jun 2016. https://www.nngroup.com/articles/hamburger-menus/ | Hidden navigation was used less (57% on mobile versus 86% for partly visible). About 4 visible links work best | Keep the visible bottom bar, never hide it |
| NN/g, *Icon Usability*, 27 Jul 2014. https://www.nngroup.com/articles/icon-usability/ | Icons need visible text labels. Hover-only labels fail on touch | Labelled buttons, as the Figma does |
| Apple HIG, accessibility and typography (change log 9 Jun 2025) | Controls 44 x 44pt. Allow at least 200% text. Body default 17pt. Avoid Ultralight, Thin and Light. Contrast 4.5:1 | Supports 44 to 48px and weights 400 and up. Pages are JS-rendered, so the agent read the JSON behind them |
| Google, Android accessibility (8 May 2023) and Help. https://developer.android.com/design/ui/mobile/guides/foundations/accessibility , https://support.google.com/accessibility/android/answer/7101858 | Targets at least 48dp with at least 8dp between. Contrast 4.5:1 and 3:1 for large and non-text | The 48px with 8px gap rule |
| NN/g report *UX Design for Seniors*, 3rd edition (87 guidelines, paid) | Not read | Not relied on |

**Body size.** NN/g's floor is 12pt = 16px. RNIB's large-print guidance is 16 to 18pt (https://www.rnib.org.uk/information-everyday-living-reading/large-and-giant-print). GOV.UK's body is 19px. **Recommendation (my judgement, bracketed by these sources): body 19 to 20px, secondary text 18px, nothing under 16px, weights 400 to 500 for body and 600 to 700 for headings and buttons, never 300 or lighter.** Browser zoom stays unblocked.

## 5. Typography: a font test, run in a real browser

**Why this matters.** The site is bilingual. Yorùbá needs ẹ ọ ṣ (dot below) and tone marks such as ẹ́ ọ̀ ń ǹ ḿ. A font without these draws them in a different fallback font, which looks broken to the reader.

**How I tested (verified).** In the built-in browser I loaded each font from Google Fonts and drew 17 Yorùbá test strings on a canvas twice, once with a `serif` fallback and once with a `monospace` fallback. If the font contains the glyph, both drawings are identical. If not, the fallbacks show through and they differ. **Controls:** Bebas Neue (latin only) must fail, and it did, with the same failures as Atkinson. Noto Sans (Yorùbá in Google's metadata) must pass, and it did.

| Font | Yorùbá result | Notes |
|---|---|---|
| Atkinson Hyperlegible Next (Figma font) | **FAIL.** ẹ ọ ṣ Ẹ Ọ Ṣ and tone-marked ẹ́ ẹ̀ ọ́ ọ̀ are missing. Plain ń ǹ ḿ pass | Identical failure list to the latin-only control. Atkinson Hyperlegible (2019) fails the same. A screenshot confirmed Ẹ and ọ drop into a mismatched serif |
| **Noto Sans** | **Pass**, all 17 | Google's metadata lists Yorùbá. Largest latin-ext file of the set |
| Inter | Pass, all 17 | Tall x-height. Large latin-ext file |
| Source Sans 3 | Pass, all 17 | Compact. Narrower letterforms |
| Plus Jakarta Sans (current) | Pass, all 17 | The agent could not confirm this from metadata, the browser test shows it passes |
| Lexend | Pass, all 17 | Reading-speed claims come only from the vendor's page (20 children, 1 minute, no peer review) |
| Open Sans | Fail ṣ and Ṣ in the split-file test | Skip |

**An important finding about delivery.** With Google's normal split files (latin, latin-ext, vietnamese), `m` + a combining grave and similar sequences failed for **every** font, including Noto Sans. With one merged file (using Google's `text=` option) all 17 strings passed for the five good fonts. So the base letter and its tone mark can end up in different files and fall back. A single self-hosted, merged woff2 avoids this. This was tested on only 17 strings and one browser (this pane's Chromium), so a final check on a real Android phone is still needed.

**Recommendation.**
1. **Noto Sans**, one variable woff2 containing Basic Latin, the Yorùbá letters and the combining marks U+0300, 0301, 0304, 0323 and 0329, self-hosted, `font-display: swap` with a size-matched fallback, preload that single file. Fallback: **Source Sans 3**, which is smaller.
2. Alternative if you want to keep the Atkinson look for English: Atkinson for `lang="en"` and Noto Sans for `lang="yo"`. It costs a second font download and makes the two languages look different. Your call.
3. Self-hosting is reported (CSS Wizardry, 2020; Chrome, 2020) to be a performance trade-off, not a free win: Google's shared cache no longer helps across sites, so the cost is mostly round trips, which self-hosting from the same origin removes. https://csswizardry.com/2020/05/the-fastest-google-fonts/ , https://developer.chrome.com/blog/http-cache-partitioning , https://web.dev/articles/font-best-practices
4. Self-hosting means adding font files to `public/` (a static asset, in scope) and no new dependency. The merged file must be produced from the font's open licence (OFL). That needs your permission to download the font, which I will ask for in Phase 2.

## 6. Candidate palettes

Hex values from the palette research agent. **Every ratio below was recomputed by me with the WCAG relative-luminance formula** (verified). Phase 2 re-tests every pair actually used in the app and adds colour-vision simulation.

| Role | **A "Evolution"** | **B "Warm and calm"** | **C "Maximum clarity"** |
|---|---|---|---|
| primary | `#22407a` | `#156064` (deep teal) | `#1a3366` |
| primary-dark | `#172d57` | `#0e4146` | `#0f1f45` |
| secondary | `#5b4aa0` | `#9b4a24` (clay) | `#0b5563` |
| accent | `#b83c1f` (white label) or coral `#f2795b` (ink label) | `#e8a317` (dark label) | `#f6b93b` (dark label) |
| success | `#1f7a5c` | `#2f6b1f` | `#0b643a` |
| warning text on tint | `#7a4b00` on `#fdf0d2` | `#6b4200` on `#fff1cc` | `#5c3a00` on `#fff4d6` |
| error | `#9f1d1d` (tint `#fde8e8`) | `#9f1d1d` | `#9b1212` |
| background | `#fafbff` | `#fbf7f0` (cream) | `#ffffff` |
| surface | `#ffffff` | `#ffffff` | `#ffffff` with a 2px border |
| text | `#16213e` | `#2a2420` | `#0b1530` |
| text-muted | `#4a5578` | `#5a4f47` | `#454d5e` |
| field border | `#6b7694` | `#8a7d72` | `#5a6275` |
| focus ring | `#2f5bd6` | `#b35a00` | `#0b1530` (plus a `#f6b93b` halo on dark areas) |

**Verified contrast (higher is better; AAA is 7, AA is 4.5, non-text needs 3)**

| Pair | A | B | C |
|---|---|---|---|
| Body text on background | 15.37 | 14.34 | 18.04 |
| White label on primary | 10.08 | 7.27 | 12.29 |
| Error text on white | 7.87 | 7.87 (7.37 on cream) | 8.44 |
| Muted text on background | 7.10 | 7.44 | 8.48 |
| Success text on white | 5.25 (AA) | 6.47 (AA) | 7.25 |
| Warning text on its tint | 6.55 (AA) | 7.78 | 9.30 |
| Accent label | 5.67 (white on `#b83c1f`) | 7.06 (dark on `#e8a317`) | 10.24 (dark on `#f6b93b`) |
| White on secondary | 7.16 | 6.18 (AA) | 8.42 |
| Focus ring on background | 5.66 | 4.49 | 18.04 |
| Field border on background | 4.37 | 3.74 | 6.11 |

All three clear the 3:1 needed for focus rings and field borders and the 7:1 AAA target for body text and primary-button labels. A and C also reach AAA for errors. Success and warning text in A are AA only, which is acceptable for large bold labels with an icon but is flagged for Phase 2.

**Today's colours, for comparison (verified)**

| Current pair | Ratio | Verdict | Replacement |
|---|---|---|---|
| White on coral `#f2795b` | 2.74 | Fails | Ink on coral 5.80, or darker coral `#b83c1f` with white 5.67 |
| White on coral-dark `#d9583a` | 3.88 | Large text only | Same as above |
| White on sun `#f6b93b` | 1.76 | Fails | Dark ink on sun 9.02 |
| White on mint `#3bb89f` | 2.46 | Fails | Ink on mint 6.47, or decorative only |
| White on lilac `#8e7cc3` | 3.61 | Large text only | `#5b4aa0` with white 7.16 |
| Coral text on white | 2.74 | Fails | Do not use as text |
| Field border (grey-300) on white | 1.47 | Fails 1.4.11 | `#6b7694` 4.37 |
| Grey-500 on mist `#eef2fa` | 4.31 | Just under AA | Use text-muted `#4a5578` |
| White on indigo `#22407a` | 10.08 | Passes AAA | Keep |
| White on leaf `#1f7a5c` | 5.25 | AA | Keep, or darken to `#175a3a` (the Figma green) for AAA |

**Status never by colour alone (WCAG 1.4.1).** Success: check icon plus a word ("Registered"). Warning: triangle icon plus words ("Almost full"). Error: icon, an "Error:" prefix, a thicker field border, message beside the field. Keep coral for emphasis only, never for errors, because it looks too close to error red. In B, teal primary and green success can look alike to colour-blind users, so success always needs an icon and a word.

**Lean (final choice is Phase 2).** A. It keeps the brand and the Figma indigo and green, changes the fewest pixels users already know, and fixes every failing pair. I would fold C's stricter field border and focus ring into it. B is the friendliest but is a visible rebrand, and there is no evidence in the sources that warm palettes help seniors.

## 7. Layout directions

| # | Direction | Source | Fit for SeniorPadi |
|---|---|---|---|
| 1 | **Guided single column, one task per screen.** One question per page with "Question 3 of 7", a back link, a check-your-answers page | GOV.UK: https://design-system.service.gov.uk/patterns/question-pages/ , https://design-system.service.gov.uk/patterns/check-answers/ , https://design-system.service.gov.uk/styles/type-scale/ (19px body) | Low memory load, but **splitting sign-up into several pages changes the flow and routes, so it is blocked**. What carries over: single column, large type, one primary action, back links, visible error text next to fields |
| 2 | **Big labelled tiles plus a persistent bottom bar on phones, top bar on desktop** | NN/g icon and navigation articles (section 4), Google 48dp rule, USWDS card pattern: https://designsystem.digital.gov/components/card/ | **Matches the Figma and the existing home cards and nav.** Keep labels short in both languages. Swipe stays but needs visible buttons (WCAG 2.5.1) |
| 3 | **Task list for onboarding** with text statuses (Completed, Incomplete, Cannot start yet) | GOV.UK: https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ | A new page and new status copy would be new content and routes, so **recommendation only**. Useful idea for the ID-check gate |

**Recommendation: Direction 2, with Direction 1's form styling (single column, big labelled inputs, error text beside the field).** That is what the Figma already draws, and every part of it can be done by restyling.

**Per-screen intent for Phase 3:** home keeps all its sections but with larger type and solid-colour cards (no gradients). Event cards get labelled Skip and Register buttons inside the control. Dialogs become one bottom-sheet shell. Forms stay on one page, with large inputs and linked errors. Chat keeps the bottom bar visible. Admin keeps its sidebar and tables with captions and scroll wrappers.

## 8. Templates and UI kits

No credible, widely used, senior-specific design system turned up. What was found (all reported, none verified for contrast or licence):
- **GOV.UK Design System** and **USWDS** are the strongest foundations for tokens and patterns. Code licences not verified. https://design-system.service.gov.uk/ , https://designsystem.digital.gov/
- **WarmUI**, an open-source component library: MIT, 0 stars, 6 commits, Chinese README. Too new to rely on. https://github.com/mariobeng/WarmUI
- **Figma Community files** (page contents blocked, so titles only): Elderly Care Assistant App https://www.figma.com/community/file/1538259065671692855/elderly-care-assistant-app , Sahayata https://www.figma.com/community/file/1481906935181630982/sahayata-elderly-support-app , SeniorNet https://www.figma.com/community/file/1506954953120462009/seniornet-a-simple-social-for-elderly , senior guard UI Kit https://www.figma.com/community/file/1499300945140603198/senior-guard-ui-kit , Free Accessible Design System (Tailwind, claims WCAG AA) https://www.figma.com/community/file/1131891137727824106/free-accessible-design-system
- **Webestica ElderCare**: paid ($19), desktop only, care-provider oriented, no accessibility claims on its page. https://www.webestica.com/premium-figma-templates/eldercare-senior-care-figma-template
- Palette tools: Adobe Color's contrast checker with one-click fixes https://adobe.design/ideas/inclusive-palettes-with-adobe-color , Coolors contrast checker https://coolors.co/contrast-checker (whole-palette checking is a Pro feature), Figma's contrast and colour-blindness checker https://www.figma.com/color-contrast-checker/ , Material 3 roles via https://developer.android.com/design/ui/mobile/guides/styles/color , USWDS grade system https://designsystem.digital.gov/design-tokens/color/overview/ , Atlassian https://atlassian.design/foundations/color , IBM Carbon https://carbondesignsystem.com/elements/color/overview/

## 9. Input for Phase 5 (tutorial)

- NN/g's 70-person study found tutorials did not improve success (91% with, 94% without, not significant) and people who read one rated the tasks harder. https://www.nngroup.com/articles/mobile-tutorials/ (8 Mar 2020)
- If there is one: brief and optional, a visible Skip, one idea per card, few cards, easy to dismiss and to find again. Help at the moment of need beats help at login. https://www.nngroup.com/articles/onboarding-tutorials/ (12 Feb 2023), https://www.nngroup.com/articles/mobile-app-onboarding/ (21 Jun 2020), https://www.nngroup.com/articles/mobile-instructional-overlay/ (16 Feb 2014)
- Coach-mark chains can overload short-term memory, and people try to tap the annotations. Pair short text with the highlighted element.
- Accessibility: follow the ARIA Authoring Practices modal dialog pattern (label it, move focus in, trap Tab, Escape closes, return focus to the opener, visible close button). https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ . Inline "What is this?" help can use the disclosure pattern. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ . Any time limit must be adjustable, with a 20-second warning (2.2.1), though the tour will have none.
- My design judgement (not sourced): at most 4 or 5 steps, announce "Step 2 of 4" in a live region, make the page behind inert, and offer "Show me again" in the header.

## 10. Gaps, caveats and what I did not verify

- **Fonts:** the glyph test proves each font's file contains the characters. It does not judge mark positioning or beauty, and it ran in one browser on 17 strings. Test real Yorùbá copy on a real Android phone at 19px before shipping.
- **Not read or not retrievable:** Material 3 pages (JS-rendered), Apple tab-bar page, Adobe Color help (403), Figma Community pages (403), a PMC font-size review (CAPTCHA, not bypassed), the paid NN/g report. No figures from those are used.
- **Contrast** numbers are verified by formula, but not yet by an independent tool or a colour-vision simulation. Phase 2 does both.
- **GOV.UK hex values** the agent quoted were not used. The WCAG wording came through a summariser.
- **Source age:** W3C older-user pages are from the WCAG 2.0 era (2018) and the literature review from 2008. NN/g's seniors article marked 2013 is flagged dated by NN/g itself.
- **Source URLs:** several NN/g and Apple/Google paths were expanded by me from the research agents' shorthand and not all re-fetched. Check any link before quoting it externally.
- **Nigeria and low-end phones:** no study found. The mobile-data advice is general web-performance guidance, not Ibadan-specific.
- **Admin tables:** not researched. They follow the same standards, with captions, `scope` and scroll wrappers (audit section 4.1, item 14).
- **Side effect:** one research agent's fetch auto-saved a PDF into the session's temporary tool-results folder, outside the project. Nothing in the repository was touched.
