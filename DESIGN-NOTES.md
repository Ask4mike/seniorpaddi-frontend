# SeniorPadi visual redesign: design notes

Branch `ui-redesign-outfit` (cut from `ui-revamp`). Visual layer only: EJS markup and classes, the Tailwind theme, `src/styles/input.css`, partials, fonts and images. No route, controller, service, model, socket or i18n change.

## 1. Skills used

Installed skills were listed from the ECC plugin, `~/.claude/skills` (only document skills: docs, docx, pdf, pptx, xlsx and similar) and the project (no `.claude/skills`). **There is no EJS or Tailwind skill installed.** Chosen:

| Skill | Why | How it was applied |
|---|---|---|
| `ecc:frontend-design-direction` | The closest thing to a "frontend-design" skill: pick a purpose, audience, tone and one memorable detail before coding, then use tokens, not one-off values | Direction in section 3. Rules followed: tokens for every colour, no cards inside cards, no decorative blobs as filler, verify text fit on mobile |
| `ecc:frontend-a11y` | Forms, dialogs, focus and ARIA for the pop-ups and fields | Labels tied to inputs, errors linked with `aria-describedby`, `aria-current` on nav, decorative SVGs `aria-hidden` with empty alt |

EJS conventions applied in place of an EJS skill: shared markup in `views/partials/` through `include`, no new logic or data in templates, every value printed with escaped `<%= %>`, existing variables, loops and conditionals left exactly as they were.

Tailwind is **v4.3** (`@tailwindcss/cli`). v4 has no `tailwind.config.js` by default: theme tokens live in the `@theme` block in `src/styles/input.css`. The brief's "tailwind.config theme.extend" therefore means that `@theme` block.

## 2. The inspiration images, one by one

All 11 files in `docs/images/` were opened and looked at. None shows SeniorPadi. Two corrections to the brief's hypotheses: **there is no WIBI panel image** in the folder, and **three images were not in the brief's list** (9, 10 and 11 below). None of these images, logos, names or photos is copied into the app.

**1. Aether, precision medicine (`092147`).** Marketing site in four panels. Palette: acid yellow `#F2F04A`, black `#111111`, white. Heavy uppercase grotesk headings, tiny uppercase body. Hard 2-column splits, photo-left/text-right on the doctor panel. Best idea: the booking panel's **date and time chips**: a grid of large rounded boxes, the selected one solid black, past slots faded. Works: big bold numerals, obvious selected state. Fails for 60+: body copy around 9px, all caps, faint labels, faded "unavailable" slots that rely on contrast alone.

**2. Finvera, investor dashboard (`092328`).** Light fintech dashboard. Soft grey page `#F2F2F2`, white cards, lime `#9BE15D` active pill, black bars, orange/blue/lime donut. Sans-serif, medium weights. Pill top nav, 4 stat cards in a row (icon + label + big number + delta), rounded-2xl cards with no borders, a table with status dots. Adopt: **stat card anatomy** and **white rounded cards on a soft surface** for the admin area and the Account rows. Reject: density, 12px table text, colour-only status dots, decorative charts.

**3. Halden, fraud queue (`092436`).** Dark analyst console. Near-black `#0E0E10`, red `#E5484D` and amber `#F5A524` status, monospace "late" timers. Left sidebar with saved views, summary strip, **queue list** (due, person, reason, amount, suggested action). Adopt for **admin ID checks and reports only**: sidebar + summary strip + queue rows with a status chip and one action per row. Reject: dark theme, monospace, colour-only status squares, small grey text on black.

**4. Netguru / Trinity College, activity course for the elderly (`092609`).** A case study of a senior-tested design. Palette shown with measured ratios: purple `#5B4BC4` (7.37:1), eucalyptus `#2E9E7E`, warm yolk `#F2A900` (used with dark text), charcoal `#1F1B2E`, lavender background `#F1EFFB`. Rounded geometric sans, generous line height. **Flat, friendly illustrations of older people** (purple, green and yellow clothes, no outlines, a soft lavender circle behind each figure, small plant accents) and a quoted research finding that older people dislike stock photos of "jumpy" seniors. This is the **main reference for palette and illustration style**. Fails: some case-study body text is small and grey, which we do not copy.

**5. Lightyear, geriatric care (`092851`).** Marketing site. Mint `#C9F1E6` to lavender `#D9D5F7` hero gradient, deep indigo `#2B2A72` headings and button, yolk `#F6C344` primary CTA with dark text. Photos in **tall arch and circle masks**, a "Help is here" band with a circle photo and a pale mint pill shape. Adopt: **mint-to-lavender hero wash**, **arch photo mask**, **yolk CTA with dark text on an indigo-led page**. Reject: small grey body text, logo walls.

**6. Fortune senior care (`092949`).** Charity site. Peach-to-white wash `#FDE9E2`, orange-red `#E8501C` buttons, navy `#14183E` footer, mustard and mint dots. **Serif headings** (rejected: Outfit only), small body. Hero: big **circular photo** ringed by a dashed orbit with small avatar circles. A volunteering card row. Adopt: **peach warmth** for the volunteer prompt and Call screen, **circular photo** for profiles, the **volunteer card** idea. Reject: serif, dashed orbit decoration, play-button video, 12px text.

**7. Home Care (`093208`).** Full-bleed photo hero, frosted dark **pill nav** with a lime `#E8F56B` pill CTA that has an arrow in a dark circle, large white serif headline over the photo. Adopt: **pill-shaped top bar** and **pill CTA with an icon in a circle**. Reject: white text over a busy photo (contrast depends on the photo), serif, "Watch demo" video.

**8. Eldora, senior companion app (`093347`).** Four phone screens. Warm cream `#FBF3EA`, peach cards `#F8E4D6`, deep green `#2F5D4A` buttons, terracotta and blue icons. Greeting header "Good morning, Anita" with an illustrated couple, **"What would you like to do?" over a grid of icon tiles** (icon, bold label, one-line description), an "Upcoming" card, a messages list with avatar, name, preview and time. Adopt: **greeting header**, **tile anatomy**, **cream page**, **"Coming up" card**, **message list rows**. Reject: 3-column tiles at phone width (too small at 360px; we use 1 column on phones, 3 on desktop), 12px descriptions, serif wordmark.

**9. Doctor booking app (`100802`).** Light grey page, periwinkle `#7B7BD8` appointment card with white text, a **date and time pill row inside the card**, a **pill-shaped active item in the bottom nav** ("Home" in a filled pill). Adopt: **bottom nav active pill**, **date/time row in the event card**. Reject: periwinkle with small white text (fails AA), tiny labels.

**10. Yoga Life (`100722`).** Lavender `#F3EEFC` to white, purple `#8B5CF6` accents, **flat illustrated women** doing yoga, purple-tinted cards, "Good Morning, Anaya" greeting, bottom nav with labels. Supports the illustration and greeting ideas. Reject: one-hue purple everything, serif display, light purple text on lavender.

**11. Senior exercise and chat app (`100516`).** Pale blue-grey `#E4EDF2` background, navy `#1C2B5A` full-width "Continue" buttons, mint and peach cards with flat illustrations, a **"Successful" celebration card** (confetti, green text), a **chat** with avatars and grey/pink bubbles and a large "Send" button, an outlined "Send to a friend" button. Adopt: **calm celebration card** for the Registered pop-up, **chat bubble and send-bar layout**, **one big full-width primary button at the bottom**. Reject: pink bubble with white text (low contrast), confetti clutter, the "230 watching" counter.

## 3. Synthesis: one direction for SeniorPadi

**Direction: "a warm front room".** Cream page (8 Eldora), a senior-tested purple/eucalyptus/yolk/charcoal palette (4 Netguru), soft mint-to-lavender and cream-to-peach washes only behind heroes (5 Lightyear, 6 Fortune), flat illustrated Nigerian elders in place of stock photos (4, 10, 11), big plain Outfit type. One memorable detail: **the arch**, an arch-masked picture on Home and on the event card (5), repeated as the shape of the illustration backdrops. A faint Ankara-style diamond pattern appears only in hero corners and empty states, never behind text.

| Screen / component | Adopted from | Notes |
|---|---|---|
| Palette | 4 Netguru (primary), 5 Lightyear (yolk on indigo), 8 Eldora (cream) | Brief palette, checked in section 5 |
| Illustrations | 4 Netguru, 10 Yoga Life, 11 | Flat, no outlines, lavender arch backdrop, our own SVGs of dark-skinned elders in gele, fila, buba |
| Top bar | 7 Home Care pill nav | White pill on cream, logo left, language pill right |
| Bottom nav | 9 Doctor app active pill | Icon over label, indigo pill on the active item |
| Home | 8 Eldora greeting + tiles, 5 Lightyear arch + wash | Three tiles only; Call tile uses yolk |
| Find events | 1 Aether date chips, 9 date row in card, 5 arch crop | One event at a time, Skip secondary, Register accent |
| Registered pop-up | 11 "Successful" card, 6 volunteer card | Calm eucalyptus check, two big volunteer buttons |
| Log-in pop-up | 11 big full-width button, 8 cream | Illustration on top, tall fields |
| Find seniors locked | 4 illustration style | Shield illustration, one upload CTA, status chip |
| Senior profile | 6 Fortune circular photo | Circle photo, Message primary, Report terracotta soft |
| Call SeniorPadi | 5 yolk CTA, 6 peach warmth | Huge yolk phone button, hours card |
| Messages | 8 Eldora list, 11 chat + send bar | Indigo sent, lavender received |
| Account | 2 Finvera cards and rows | Profile header card, grouped rows |
| Admin | 3 Halden layout (light), 2 Finvera stat cards | Sidebar on desktop, stat cards, queue rows with chips |

**Deliberately rejected, and why (images):** serif headings (1, 6, 7, 8, 10: Outfit only, and thin serifs blur on low-DPI phone screens); dark and neon themes (1, 3: glare and low contrast for ageing eyes); dense dashboards and charts (2, 3: cognitive load; the senior UI has no charts); text under 16px and all-caps body (1, 2, 3); white text on photos (7: contrast depends on the photo); colour-only status dots (2, 3); scarcity counters and view counts (11: the brief forbids pressure); video autoplay and play buttons (6, 7: data cost); dashed orbits, confetti and blobs as filler (6, 11).

## 4. UX audit of the screens before this pass, and the fix for each

The app was already accessible after the earlier revamp (docs/ui-revamp/phase3-results.md). The weaknesses were about clarity, warmth and hierarchy for a 65-year-old on a cheap phone:

| Weakness | Fix |
|---|---|
| Home hero used a phone mock-up picture with words baked into it, plus two buttons that repeated the tiles below, so there were five competing choices on the first screen | Hero is a greeting on a soft wash with one arch photo (desktop only); the three choices are the tiles, each with an illustration, bold label and one line. Call is the single yolk tile. On a 360 px phone the first tile is visible without scrolling |
| Clay-red "Call" button in the header on every page competed with each screen's main action | Header Call is a quiet link (wide screens only). Each screen now has one yolk action: Register on Find events, the phone button on Call, the ID upload on Find seniors |
| Find events: 7 filter chips wrapped to 4 rows on a phone and pushed the event card below the fold | Chips are one swipeable row on phones (wrapping on tablet and up); the event photo shows on the first screen |
| Event date and time were small rows with icon squares | Two big rounded blocks: date in white on indigo, time on lavender, bold Outfit (Aether chips, ref 1) |
| Skip and Register had equal weight | Skip is outlined indigo, Register is yolk with a check in a dark circle, both 56 px+ tall |
| Pop-ups were plain white boxes with a small icon | Rounded sheets with an illustration on top, centred title, large buttons. Registered pop-up has a calm eucalyptus check and the volunteer offer in its own warm peach card (refs 11 and 6) |
| Find seniors locked state was an icon square and a paragraph | Shield illustration, a status chip ("We're checking your ID" with an hourglass) when pending, one yolk upload button |
| Senior profile was a wide photo, with "Report a problem" as a small underlined link | Round photo on a soft wash (ref 6), name with an "ID checked" chip, bio in a lavender box, Message primary; Report a problem is a soft terracotta button (still on every profile and conversation) |
| Messages list rows had heavy borders and no time | Rounded rows with avatar, name, time, last message, and an unread dot plus the word "New" |
| Chat bubbles were square-ish, input was a plain form at the end | Rounded bubbles with a tail corner (indigo sent, lavender received, 18 px text); the send box is a raised card, sticky on tablet and up |
| Account was a grid of separate cards | Profile header card on a wash, then one grouped list of rows with chevrons, Log out as an outlined terracotta button |
| Staff area used a dark indigo sidebar | Light sidebar with pill links, stat cards, ID checks and reports as queue rows with status chips (refs 3 and 2) |
| Top bar stuck to the top on phones as well as the bottom bar, leaving little room | On phones only the bottom menu is fixed; the top bar scrolls away. Both bars are fixed on tablet and up |

## 5. Palette and measured contrast

Tokens live in the `@theme` block of `src/styles/input.css` (Tailwind v4). The brief's palette was kept; two shades were added because the brief's own shades fail on their tints: **eucalyptus-800 #175E49** (text on the eucalyptus tint) and **terracotta-700 #A8380A** (text on the terracotta tint). Ratios measured with the WCAG 2 formula:

| Pair | Ratio | Use |
|---|---|---|
| white on indigo-600 #4A3FB0 | 7.99 | primary buttons, date block, sent bubbles |
| white on indigo-500 #5B51C9 | 6.06 | allowed, not used for text |
| white on indigo-700 / 900 | 10.27 / 14.98 | hover, footer |
| indigo-100 #E0DCF7 on indigo-600 | 5.99 | secondary text on indigo |
| charcoal #1F1B2E on yolk-400 #F5B82E | 9.39 | the one main action per screen, Call tile |
| charcoal on yolk-500 #E5A417 | 7.70 | yolk hover |
| white on eucalyptus-700 #1F7A5F | 5.24 | Volunteer and Approve buttons |
| white on eucalyptus-500 #2F9E7E | **3.33, fails** | so eucalyptus-500 is for icons and illustrations only |
| eucalyptus-800 #175E49 on eucalyptus-100 | 6.61 | Verified chip, success alert |
| terracotta-600 #C2410C on white | 5.18 | unread dot (non-text) |
| terracotta-600 on terracotta-100 | **4.38, fails** | so text on the tint uses terracotta-700 |
| terracotta-700 #A8380A on terracotta-100 / white | 5.49 / 5.86 | Report a problem, errors, Full and Cancelled chips |
| charcoal on cream #FFF9F0 | 15.99 | body text |
| slate-muted #4B4763 on cream / lavender / white | 8.43 / 7.96 / 8.82 | secondary text |
| indigo-600 on cream / lavender / indigo-50 | 7.63 / 7.21 / 6.91 | links, chips |
| warning-ink #6B4200 on yolk-100 #FEF3D6 | 7.90 | Pending chip |
| field border #6E6987 on white | 5.21 | non-text, needs 3:1 |
| focus ring indigo-700 on cream / white | 9.81 / 10.27 | non-text |
| focus ring yolk on indigo-600 | 4.48 | non-text, needs 3:1 |

The project's checker (`node docs/ui-revamp/tools/contrast.mjs --only pairs`) found **no text pair below 4.5:1** in the templates. Its only sub-4.5 entry is the yolk calendar icon on indigo (4.48), an icon beside words that needs 3:1. Two rows in its component table say FAIL (`.btn-coral`, `.tag-leaf`) only because the tool still assumes the old white-on-clay and old green; the real pairs are 9.39 and 6.61.

Gradients appear only as the mint-to-lavender `.hero-wash` and the cream-to-peach `.hero-warm`, behind charcoal text (14:1 or better on every stop).

## 6. Typography: Outfit, and the Yorùbá glyph test

- **Only typeface:** Outfit, self-hosted as one variable WOFF2 (`public/fonts/outfit-variable.woff2`, 40 KB, weights 400 to 700) with `@font-face` and `font-display: swap`. Preloaded once in `views/partials/header.ejs`, which every page (senior, auth, error, admin) includes. The old Noto Sans file and its preload were removed. There are no Google Fonts links, so no preconnect is needed.
- `--font-sans` and `--font-display` both resolve to `"Outfit", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. `font-sans` is applied to `html` and `body` in `@layer base`, and `button, input, select, textarea, optgroup` get `font-family: inherit`.
- Weights: h1 700, h2 700, h3 600, body 400; buttons, labels and chips 600. Large headings use `tracking-tight`.
- Sizes: root 18 px (`font-size: 112.5%`), body line-height 1.6, h1 2.25 rem on wide screens (1.75 rem on phones), h2 1.75 rem, h3 1.25 rem. The smallest text anywhere is 16.2 px (`text-sm`, used only for bottom-menu labels and chips).
- **Computed font checked in the browser:** h1, h2, body, buttons, inputs, select, textarea, legend, the log-in pop-up, chat bubbles, the bottom menu, the admin sidebar, admin inputs and admin table cells all compute to Outfit. The page checker reported Outfit as the rendered font on all 80 page variants at 360, 768 and 1280 px.
- **Yorùbá glyph test** (Chromium, canvas width test, run on the merged file and on Google's own latin and latin-ext files):
  - **In Outfit:** à á è é ì í ò ó ù ú, ǹ ń ḿ, the capitals with grave and acute, curly quotes, dashes.
  - **Not in Outfit, drawn by the fallback:** ẹ ọ ṣ Ẹ Ọ Ṣ, and therefore ẹ̀ ẹ́ ọ̀ ọ́ and their capitals, plus the Naira sign ₦. Outfit has no Vietnamese subset and no dot-below letters at all, so this is a gap in the font, not in the download. The Yorùbá locale uses these letters often (529 ẹ, 693 ọ, 208 ṣ).
  - **What a reader sees:** those letters come from the next font in the stack (Roboto or Noto on Android, Segoe UI on Windows, San Francisco on iPhone). They are always readable and at the right weight, but slightly different in shape from the Outfit letters around them. The Yorùbá pop-ups read cleanly in screenshots.
  - **Options if this matters:** (a) accept it (current choice, the brief's option b); (b) add a `unicode-range` face for only U+1E62-1E63, U+1EB8-1EB9, U+1ECC-1ECD and U+20A6 from a geometric font that has them, so English pages never download it; (c) build a patched Outfit (the OFL allows modification) with the dot-below letters composed from Outfit's own e, o, s and a dot. Options b and c need your go-ahead, because they add a second font file or a font-building tool.

## 7. Component classes (all in `src/styles/input.css`)

- **Buttons:** `.btn` / `.btn-primary` (indigo), `.btn-accent` (yolk, charcoal text, the one main action), `.btn-plain` / `.btn-secondary` (outlined indigo), `.btn-ghost`, `.btn-volunteer` (eucalyptus), `.btn-danger-soft` (terracotta tint, Report a problem), `.btn-danger` (outlined terracotta), `.btn-lg` (56 px+), `.btn-block`, `.btn-icon` (icon in a circle), `.btn-link`, `.btn-link-danger`. `.btn-coral` is kept as an alias of `.btn-accent`. All are pill-shaped, with hover and pressed colours and no movement.
- **Bars:** `.site-header`, `.topbar` (pill), `.brand`, `.brand-mark`, `.lang-pill`, `.pillnav` + `.nav-link` (wide screens), `.tabbar` + `.tab-link` + `.tab-icon` + `.tab-label` (phones, active pill), `.count-badge`, `.admin-link`.
- **Surfaces:** `.card`, `.panel`, `.tile`, `.tile-accent`, `.tile-art`, `.icon-tile`, `.empty-state`, `.empty-art`, `.stat-card`, `.queue-row`, `.convo`, `.avatar`, `.unread-dot`, `.send-bar`.
- **Decoration:** `.hero-wash`, `.hero-warm`, `arch` (a `@utility`, so `md:arch` works), `.pattern-ankara` (corners only, never behind text).
- **Chips:** `.chip` (filters); `.chip-status` with `.chip-verified`, `.chip-pending`, `.chip-locked`, `.chip-danger`. The older `.tag-leaf`, `.tag-amber`, `.tag-mine`, `.tag-full` map to the same looks, and `.tag-float` puts a tag on a solid white base over a photo. Always icon + word.
- **Events:** the `.date-block` family and `.time-chip`.
- **Forms:** `.field` (56 px+ inputs, label above, 2 px border, terracotta inline error with a drawn icon), `.hint` (18 px), `.check`, `.drop-zone`.
- **Dialogs:** `.dialog-backdrop`, `.dialog` (rounded sheet), `.dialog-art`, `.dialog-close`.
- **Chat bubbles** are styled from `#thread > li > div.bg-primary` / `.bg-surface-muted`, the classes `public/js/chat.js` already uses, so live messages get the same shape with no script change.

## 8. Images, performance and licences

- **Illustrations:** 9 original flat SVGs in `public/images/illustrations/` (0.7 to 1.8 KB each): dark-skinned Nigerian elders in gele, fila, buba and agbada, palette colours only, no text inside, always `alt=""`. Generator: `docs/ui-revamp/tools/make-illustrations.mjs`. Sources and the photo brief: `public/images/README.md`.
- **Photos:** the six existing category photos are kept (event covers, plus `fitness.jpg` as the arch-cropped Home hero on wide screens). **Their licence is not recorded in the repo; please confirm before launch** (the README has a sourcing brief). They were not converted to WebP or AVIF because no image tool was available here.
- **Inspiration images:** none is copied into `public/` or the built site (checked with `git ls-files public`).
- **Page weight, Home, first load, uncompressed:** 335 KB on a phone (the hero photo is lazy and never downloads there) and 386 KB on a computer, fonts included. Font Awesome from the CDN is the biggest part (about 196 KB of CSS and icon fonts); self-hosting a subset of the roughly 40 icons used would remove most of that. Our own CSS is 70 KB raw (about 12 KB gzipped).
- No new JavaScript and no animation library. Transitions are 150 to 200 ms, and `prefers-reduced-motion` switches them off.

## 9. Verification

| Check | Result |
|---|---|
| Every preview page renders in English and Yorùbá (`preview-server.mjs --check`) | 39 pages x 2 languages, all render |
| Page checker with axe-core 4.10 (WCAG 2.0, 2.1, 2.2 A and AA, plus best practice) at **360, 768 and 1280 px**, 80 variants each (every page and pop-up state, both languages) | **0 axe violations, 0 pages with sideways scroll, 0 controls under 48 px, 0 text under 16 px, 0 broken images, 1 h1 per page, Outfit rendered on all** |
| Contrast checker over every class pair in the templates | no text pair below 4.5:1 (section 5) |
| Content freeze against `ui-revamp` (text, EJS logic, links, forms, field names, values, ids, aria, data-* hooks, locale keys) | no id, aria, role or data-* hook removed; no form action, method, name or value changed; 0 locale keys changed. Reviewed differences are listed in section 10 |
| Admin templates the preview does not render (dashboard, reports, report) | compile cleanly with EJS |
| Jest suite (`npm test`) | **not runnable here**: 56 of 59 tests fail with "connection refused" because PostgreSQL is not running on this machine |
| Live app (login, register, volunteer, language toggle, live chat, ID upload, admin actions) | **not exercised**: only the no-database preview was run. No route, controller, form field or script changed, so behaviour should be identical, but it has not been clicked through end to end |

**Screen review against the references (step 10).** Home matches Eldora's greeting and tiles and Lightyear's wash and arch; Call is the only yolk tile. Find events matches Aether's bold date blocks and Lightyear's arch (desktop); Register is the only yolk button. The pop-ups match the calm "Successful" card and Fortune's warmth. Find seniors matches the Netguru illustration style and Fortune's round photo. Messages and chat match Eldora's list and the chat app's bubbles and send bar. Account and admin match Finvera's cards and Halden's queue in light form.

**Gaps:** the photo-left/details-right event layout follows the brief, not a reference, because the WIBI image is not in the folder. The senior profile is still the swipe card, since the app has no separate profile page and adding one would be new logic. There is no "Good morning" greeting because no such text exists in the locale files and adding keys was out of scope, so the existing "Welcome, {name}" is used.

## 10. Legacy markup kept on purpose, and reviewed differences

- **Kept for scripts:**
  - `swipe.js`: `data-swipe-card`, `data-left`/`data-right`, `data-badge`, and the `skip-<id>` / `register-<id>` / `skip-senior` / `message-senior` ids.
  - `chat.js`: `#thread` with its `data-me`, `data-other`, `data-other-name`, `data-you`, `data-just-now`; `form[data-chat-form]#latest`; `textarea#body`; `#thread-empty`; `msg-<id>`.
  - `dialog.js`: `data-dialog`, `data-dialog-close`, `aria-labelledby`.
  - `phone-input.js`: `input[data-phone]`, `<id>-error`, `.phone-shake`.
  - `upload.js`: `form[data-upload]`, `data-uploading-text`.
  - `dashboard.js`: `data-stat`, `#rate-ring`, `data-day-bar`, `data-day-total`, `#stats-updated`, `bg-warning-bg`.
- **Class names kept because scripts write them:** `bg-primary`, `text-white`, `bg-surface-muted`, `text-body`, `text-on-primary-muted` and `text-muted` (chat bubbles) now map to the new palette, so `chat.js` needed no change. `.btn-coral` and the `tag-*` names are kept as aliases.
- **Reviewed differences from `ui-revamp`** (content-freeze output):
  - Home drops the two hero buttons that repeated the tiles, the tiles' "Open" word (the whole tile is the link), the old phone mock-up image and its alt text, and the four-photo collage.
  - About, the auth side panel, the pop-ups, the error page and the empty states gain decorative illustrations.
  - The header puts Log in before Call and preloads Outfit instead of Noto Sans, with `?v=ui2` on the stylesheet (bump it whenever the CSS changes).
  - The event card's location is a paragraph instead of a one-item list.
  - Find seniors shows "We're checking your ID" in a chip instead of a bold line.
  - The inbox shows each conversation's last-message time (existing data), and the chat header shows the person's avatar.
  - ID checks and Reports show "ID pending" and "Reported" chips (staff pages are English-only, as before).

## 11. Files changed (branch `ui-redesign-outfit`, from `ui-revamp`)

- **Styles:** `src/styles/input.css` (tokens, base, components) and the rebuilt `public/css/main.css`.
- **Partials (7):** `header`, `footer`, `seniorNav`, `nav` (admin), `eventCard`, `loginModal`, `authAside`.
- **Screens (18):** `home`, `about`, `call`, `error`, `events/index`, `events/registered`, `social/find`, `social/inbox`, `social/thread`, `account/account`, `auth/login`, `auth/signup`, `auth/forgot`, `auth/reset`, `auth/change`, `admin/dashboard`, `admin/ids`, `admin/reports`. All other templates pick up the new look through the tokens and component classes.
- **Assets:** `public/fonts/outfit-variable.woff2` (new), `public/fonts/noto-sans-variable.woff2` (removed), `public/fonts/README.txt`, 9 SVGs in `public/images/illustrations/`, `public/images/README.md`.
- **Docs and tools:** `DESIGN-NOTES.md`, `docs/ui-revamp/tools/make-illustrations.mjs`.
- **Not touched:** routes, controllers, services, models, migrations, sockets, `public/js/*`, `locales/*`, `package.json`, tests. Confirmed with `git diff ui-revamp --name-only`.
