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

## 12. Header and motion (second pass, 15 Oct 2026)

Skills: the same two (`ecc:frontend-design-direction` for deciding where motion helps, `ecc:frontend-a11y` for focus, ARIA and reduced motion), plus EJS practice (no new logic or data, escaped output). There is still no EJS or Tailwind skill installed. Tailwind is v4: "tailwind.config" tokens live in the `@theme` block, plus `@utility` and `:root` in `src/styles/input.css`.

### 12.1 The one-line header

**Layout.** One `flex-nowrap` row inside the pill top bar (`.topbar`). The brand link is `min-w-0`; the logo mark and the language pill are `shrink-0`. Below md: logo mark + wordmark | language. From md: logo | the five-item menu as a compact pill (`.pillnav`) in the middle | language. The old second menu row is gone. The bottom menu on phones is unchanged.

**Removed from the header:** the "Log in" link (logged-out visitors) and the "Call SeniorPadi" link (wide screens only). With them, the line cannot fit at 768px. Log in is still one tap away (Account sends a logged-out visitor to the log-in page, and Register opens the log-in pop-up), and Call is still the yolk Home tile and a footer link.

**Shrink order, CSS only (no measuring script):**
1. Gaps and padding step down: `gap-1 sm:gap-2 lg:gap-4`, bar padding `pl-2 sm:pl-3 lg:pl-4`, menu items `px-2.5 lg:px-3.5 xl:px-4`.
2. The logo mark is 36px below sm, 40px from sm. The wordmark is visually hidden from 768 to 1279px (`md:max-xl:sr-only`, corrected in section 13), where the menu needs the room. The link keeps `aria-label="SeniorPadi"`.
3. Fluid text, defined once as utilities:
   - `header-text` = `clamp(0.778rem, 5vw - 0.11rem, 1rem)`: **14px at 320, 16px at 360, 18px from 400** (language pill).
   - `.brand-word` uses the same curve with a 1.25rem cap (22.5px).
   - `nav-text` = `clamp(0.889rem, 0.35rem + 1.15vw, 1rem)`: **16px at 768, 18px by 1024** (menu items).
4. Fluid icons: `header-icon` = `clamp(0.889rem, 0.5rem + 1vw, 1.125rem)`. The language icon and the menu icons hide below 360px and from 768 to 1023px (on a wrapper span: see section 13).

Menu labels use the existing short words (Events, Seniors / Ètò, Àwọn àgbà) up to 1280px and the full words (Find events, Find seniors / Wá ètò, Wá àwọn àgbà) from 1280px. Both are existing i18n keys, and the hidden one is `display:none`, so the accessible name always matches what is shown.

**The 14px exception** is limited to the header: only `header-text` and `.brand-word` can go under 16px, and only between 320 and 359px wide. Everything else keeps the 16px floor (checked: the smallest text on every page at 360 and 1280 is 16.2px).

**Kept:** sticky at every width (it was not sticky on phones after the first pass; now it is one 67px line, so it can be), a 95% cream background with a soft blur, safe-area padding (`viewport-fit=cover` added to the viewport meta so `env(safe-area-inset-*)` works on notched phones, which also activates the bottom bar's existing safe-area padding), `scroll-padding-top: 6rem`, the skip link, `aria-label="Main"`, `aria-current="page"`, the language form exactly as before (same action, fields and value; it still shows the OTHER language), and focus rings.

**Graceful degradation:** if very large text ever makes the five items wider than their space, the menu scrolls sideways inside its own pill (`overflow-x-auto`, scrollbar hidden). The page never widens and nothing overlaps. Only the wordmark may be cut short (with an ellipsis), and its full name stays in the link's `aria-label`.

### 12.2 Header test results

Measured in the browser with real layout (one line = every control's vertical centre within 2px), for logged out and logged in, in English and Yorùbá, on Find seniors (active item "Seniors", the longest Yorùbá label):

| Width | One line | Page sideways scroll | Controls under 48px | Active item fully visible | Language pill text | Menu text | Result |
|---|---|---|---|---|---|---|---|
| 320 | yes | 0 | 0 | n/a (bottom bar) | 14px | n/a | PASS |
| 360 | yes | 0 | 0 | n/a | 16px | n/a | PASS |
| 390 | yes | 0 | 0 | n/a | 17.5px | n/a | PASS |
| 412 | yes | 0 | 0 | n/a | 18px | n/a | PASS |
| 600 | yes | 0 | 0 | n/a | 18px | n/a | PASS |
| 768 | yes | 0 | 0 | yes | 18px | 16px | PASS |
| 1024 | yes | 0 | 0 | yes | 18px | 18px | PASS |
| 1280 | yes | 0 | 0 | yes | 18px | 18px (full labels) | PASS |
| 1536 | yes | 0 | 0 | yes | 18px | 18px | PASS |
| 1920 | yes | 0 | 0 | yes | 18px | 18px | PASS |

All 40 combinations (10 widths x 2 languages x logged out/in) pass. The language pill is 54px tall everywhere. The bar is 67px tall on phones and 76 to 81px on wider screens.

**Zoom.** Browser page zoom (Ctrl +) narrows the CSS viewport (150% on a 1280 screen behaves like 853px, 200% like 640px), so it is covered by the width table. **Text zoom** (the browser's font-size setting) was tested by scaling the root size to 150% and 200%:
- 150%, at 320, 360, 768, 1024 and 1280: one line, no overlap, no page scroll. From 768 up the menu scrolls inside its pill.
- 200%: the header stays on one line with no overlap at every width; the menu scrolls inside its pill on md+. **On 320 and 360 phones the page itself becomes wider at 200%, but not because of the header**: it is the page content (a senior's name in 1.75rem, two side-by-side buttons, the footer). That is outside this pass and is noted as a follow-up. The bottom menu now scrolls inside itself at such sizes instead of widening the page, and the profile photo is capped at the screen width.

### 12.3 Motion

**Tokens** (`@theme` in `input.css`): `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in: cubic-bezier(0.4, 0, 1, 1)`, `--duration-micro: 150ms`, `--duration-enter: 250ms`, `--duration-leave: 150ms`, and named animations `--animate-*` with their `@keyframes`. Only transform and opacity animate (plus colour on buttons). Entrance animations use fill-mode `backwards`, so they hold nothing once finished (the swipe script's own transforms and the pop-ups' centring are never overridden). Nothing loops.

| Where | What | Duration, easing |
|---|---|---|
| Every page | main content fades in with an 8px rise (bars do not animate). Skipped on pages showing a pop-up (see below) | 250ms ease-out |
| Pop-up backdrop | fades in | 200ms ease-out |
| Pop-up, phones | slides up 24px and fades in | 250ms ease-out |
| Pop-up, md and up | scales 0.96 to 1 and fades in | 250ms ease-out |
| Registered pop-up | circle scales in (from 120ms), white check draws itself with stroke-dashoffset (from 300ms), "Yes, volunteer" and "Not now" rise in at 420 and 480ms. No confetti | 300ms / 400ms / 260ms ease-out |
| Buttons, language pill, filter chips | colour change and press to 0.97 (not when disabled). Focus rings appear at once (outline is never transitioned) | 150ms ease-out |
| Menus (top pill and bottom bar) | active pill background changes colour; the active icon is scaled to 1.08 (transform only, layout never moves) | 150ms ease-out |
| Home tiles | rise in one after another (0, 70, 140ms), press to 0.98, lift 2px under a mouse only (`@media (hover: hover) and (pointer: fine)`). The bigger shadow is on a pseudo-element whose opacity changes; blur is never animated | 260ms / 150ms |
| Home "Coming up" cards | press feedback, 2px lift under a mouse only | 150ms |
| Find events / Find seniors card | the card slides in 12px from the right on each page load (after Skip the next card arrives this way). Register and Skip get the button press | 220ms ease-out |
| Chat | only new bubbles added live by `chat.js` pop in (opacity, 6px rise, scale 0.98). Messages already on the page carry a `msg-past` class and do not move. Send button gets the press | 180ms ease-out |
| Form errors | slide down 4px and fade in with their icon (also when `phone-input.js` un-hides one) | 150ms ease-out |
| Flash messages | slide down 8px and fade in; success messages just fade in | 200ms ease-out |
| Lists and account rows | pressed background colour only | 150ms |
| Staff area | page fade, button press, pop-ups and the top loader only: no lifts, no list or table entrances (`.admin-area` on the staff body) | |

Status chips, date and time blocks and plain cards do **not** lift on hover. They are not tappable, and a lift would suggest to an older reader that they are.

**Modal exit animations: skipped.** The pop-ups are server-rendered: closing one follows a link to another page (the close link, Escape via `dialog.js`, or a form), so the pop-up never fades out in place. Only the entrance animates, with CSS that runs when the page loads. `dialog.js` is unchanged: focus still moves to the title, the page behind is still made inert (7 regions on the Registered page), and `aria-modal`, `aria-labelledby` and Escape behave as before (all checked).

**Why pop-up pages skip the main fade:** during the 250ms rise, `#main` would have a transform, and that would make the fixed-position pop-up position itself inside the main area for that moment. `#main:has([data-dialog]) { animation: none }` prevents the jump.

**Reduced motion** (`@media (prefers-reduced-motion: reduce)`): every animation and transition is cut to 0.01ms with no delay, presses and hovers change colour only (no scale or lift), the active-icon scale is removed, and the top loader becomes a full, still bar while loading (no growing, no fading). Checked by applying the exact rules from that block: all animations become instant, and the loader shows at 100% width, fully opaque. Nothing relies on motion to convey information.

### 12.4 The top loader

- **Element:** `<div id="top-loader" class="top-loader" role="progressbar" aria-hidden="true">` added once in `views/partials/header.ejs`, in both the senior and staff branches, so every page has it (including error pages). It is 3px tall (4px from md), fixed at the very top above the sticky header (z-index 70, top offset `env(safe-area-inset-top)`), yolk-to-indigo gradient, `pointer-events: none`, and only `transform: scaleX` and opacity change.
- **It stays `aria-hidden` while loading too.** An unnamed progress bar appearing for half a second would only be noise to a screen-reader user, and the browser already reports page loading. A spoken label would also need a new i18n key, which is out of scope.
- **Script:** `public/js/top-loader.js`, 1.9 KB with comments (about 1.2 KB of code, under 1 KB gzipped), no dependencies, loaded with `defer` from the header partial. Passive listeners on `document` for `click` and `submit`, plus `pagehide` and `pageshow` on `window`. Everything is wrapped in try/catch.
- **Behaviour:** an internal link click or a form submit shows the bar at once and eases it towards 90% over about 8 seconds. When the page unloads it fills to 100% and fades. On `pageshow` (including back/forward cache restores) it resets and hides. A 15-second safety timer hides it if no new page ever comes (for example a file download).
- **Ignored:** clicks already handled by a script (`defaultPrevented`), ctrl/cmd/shift/alt and middle clicks, `target="_blank"` (and any other target), `download` links, same-page hash links, `tel:` (the Call SeniorPadi button), `mailto:` and other origins. For forms: a submit another script cancels (the live chat sends over the socket, a wrong phone number is stopped by `phone-input.js`, the swipe card waits for its slide) and forms with a target.
- **Never** calls `preventDefault` or `stopPropagation`, never delays anything, never reads or touches form data, and no existing script was edited.
- **Checked:** every case above in the browser (internal link and form show it; the seven ignore cases do not; a cancelled form does not; pageshow resets; pagehide fills). A real click on "Events" started the next page 11ms after the click, the bar was idle on arrival, and Back restored a page with the bar hidden.

### 12.5 Verification for this pass

| Check | Result |
|---|---|
| Header, 10 widths x 2 languages x logged out/in | 40 of 40 pass (12.2) |
| Text zoom 150% and 200% | header one line, no overlap at every width; page content (not the header) widens at 200% on 320 and 360 phones (12.2) |
| Accessibility sweep (axe 4.10 WCAG A/AA + best practice, text size, target size, sideways scroll, looping motion, broken images, font) on all 80 page variants at 360 and 1280 | 0 sideways scroll, 0 controls under 48px, 0 text under 16px, 0 looping animations, Outfit everywhere. axe flagged "no level-one heading" on the 8 pop-up variants only while animations were frozen at their first frame in the hidden test frame; with the animations finished it passes (checked) |
| Every animation's end state (Web Animations API `finish()`) | content fully visible, no leftover transform, on Home, Find events, both pop-ups, chat and admin |
| JavaScript off (sandboxed frames with scripts blocked) | header one line, loader invisible, no sideways scroll, pop-ups present; entrances are CSS and end visible. Pages, links and forms are plain HTML as before |
| Reduced motion | all motion instant, loader a still full bar (12.3) |
| Top loader cases and real navigation | all pass (12.4) |
| Content freeze against the previous commit | only the reviewed differences: header Log in and Call links removed, top-loader script and viewport-fit added, menu label spans, Registered check now inline SVG. No form, field, id, data-* hook or locale key changed |
| Jest suite (`npm test`, with the local database running) | 59 of 59 pass |
| Home weight | estimated: + 1.9 KB for the loader script on top of the measured 335 KB (phone) and 386 KB (computer), uncompressed |
| Layout shift from animation | none by construction: only transform and opacity animate, and fill-mode backwards holds no layout. A Lighthouse run was not possible because the browser pane does not paint while hidden |

**Not checked by eye:** the browser pane stopped painting during this pass, so animations were verified by their computed timings and end states rather than watched. Please look at them once on a phone (Home tiles, Registered pop-up, the loader on a slow connection) before shipping.

**Files changed in this pass:** `views/partials/header.ejs`, `views/partials/seniorNav.ejs`, `views/events/registered.ejs` (inline success mark, `enter-up` classes), `views/home.ejs` (`tile-list`, `lift` classes), `views/social/thread.ejs` (`msg-past` class on server-rendered bubbles), `views/social/find.ejs` (profile photo capped at screen width), `src/styles/input.css`, rebuilt `public/css/main.css` (`?v=ui3`), new `public/js/top-loader.js`, and this file. **No existing file in `public/js` was modified**, and no route, controller, service, model, migration, socket, locale or test file was touched.

## 13. Log in, Create account, Verify and Log out (third pass, 17 to 18 Oct 2026)

### 13.1 References and what each one gave

The images folder now holds 10 screenshots: three of the current SeniorPadi screens (Home "Events near you", Log in, Create account in two parts) and six login/register designs from other products. Nothing was copied: no logo, wording, picture or claim.

**Weak today:** heavy dark field outlines and no icons; no way to see the password and no confirm box; a big empty gap on the friendly panel between the checklist and the small picture; flat hierarchy (title, fields and "Forgot your password?" all weigh the same); on phones the friendly panel vanished, leaving a bare form.

| Weakness | Taken from | What we did |
|---|---|---|
| Heavy outlines, no icons, no eye | AI inbox ("Welcome Back") | Soft tinted fields (`--color-input-fill` #F8F7FC, 1.5px `--color-input-border` #7C7796 at 4:1), a leading icon, an eye button inside the field |
| Hints far from fields, unclear labels | Store app (Attiro) | Label above, lock icon on password fields, helper text right under its field |
| Dead space on the friendly panel | Car trading (Adoma) and AI inbox | Bigger arch illustration filling the panel, with a trust card on it: initials avatars + "A safe, friendly community / Our staff check every member's ID" (no invented numbers) |
| Flat hierarchy | Children's stories | One strong full-width purple button; "Forgot your password?" on the Password label line |
| Weak focus | Workforce app | 4px soft indigo ring plus the 3px focus outline on the active field |
| Bare phone layout | AI chat (Solara) | One centred card with the logo mark on top and the headline under the title |

Rejected: small light-grey text, "Sign in with Google/Apple" buttons (not offered here), user-count claims, decorative 3D art.

### 13.2 Components (all reusable)

| Component | Where | Notes |
|---|---|---|
| TextInput | `views/partials/ui/textInput.ejs` | leading icon; prints `aria-describedby` / `aria-invalid` only when given, so pages keep exactly their old attributes (checked in the rendered HTML) |
| PasswordInput | `views/partials/ui/passwordInput.ejs` | lock icon + 48px eye button (`aria-controls`, `aria-pressed`, label switches between "Show password" and "Hide password", icon eye / eye-slash); the button stays hidden until the script runs. `name` is optional, so Confirm password is never sent |
| Button busy state | `public/js/ui.js` + `.btn-spinner` | forms with `data-busy-text` show a spinner and "Logging you in..." / "Creating your account..." / "Checking..." / "Sending..."; applied only after every other check passed (a form stopped by the phone check never looks busy); a second tap is blocked; reset on Back |
| Modal | `public/js/ui.js` (`SP.openModal` / `SP.closeModal`) + `.dialog` | focus moves in (`data-modal-initial`), Tab is trapped, Escape and the backdrop close, body scroll locked (`body.modal-open`), focus returns to the trigger |
| OTPInput | `public/js/otp.js` + `.otp-group` / `.otp-box` | see 13.4 |
| ConfirmLogoutModal | `views/partials/confirmLogoutModal.ejs` | see 13.5 |
| Shared panel | `views/partials/authAside.ejs` | the friendly panel for log in, create account, forgot, reset and change password |

Tokens added in `@theme`: `--color-input-fill`, `--color-input-border`. Component classes: `.auth-shell`, `.auth-panel`, `.auth-title`, `.auth-lede`, `.auth-mobile-mark`, `.auth-switch`, `.auth-hero`, `.auth-hero-art`, `.trust-card`, `.avatar-stack`, `.form-soft`, `.label-row`, `.input-wrap`, `.input-icon`, `.input-toggle`, `.field .ok`, `.btn-spinner`, `.otp-group`, `.otp-box`, `.resend-row`, `.modal-actions`, `.modal-icon`, `.btn-link:disabled`.

### 13.3 Log in and Create account

- **Log in:** phone with a phone icon (the existing phone check is untouched), password with eye, forgot link on the label line, busy button, the existing error box (`role="alert"`). The log-in pop-up on Find events uses the same password field and busy button.
- **Create account:** every field and hint kept. **Confirm password** added with its own eye. It has **no `name`, so the server never receives it**; it is checked in the browser only:
  - while typing, a quiet "The passwords match" tick appears as soon as they match (inside an always-present `aria-live="polite"` region);
  - on leaving the box, a mismatch shows "The two passwords are not the same. Please type them again." (`role="alert"`, `aria-invalid="true"`);
  - on submit, an empty or different confirm box stops the form and puts focus on it.
  - Without JavaScript the form submits as before and the confirm box is simply not checked (the server never asked for it).
- Checked in the real app: a mismatch is stopped with the message and focus on the box; with matching passwords the account was created and the welcome page opened.

### 13.4 Verify: code boxes and resend countdown

- **No backend change.** The six boxes fill the existing single `code` field, and resend uses the existing `POST /verify/send` with its existing 60-second server limit.
- **Boxes:** 6 big boxes (72px tall), numeric keyboard, auto-advance, paste or SMS auto-fill spreads the digits, Backspace on an empty box goes back, arrow keys move. Each box is labelled "Digit n of 6"; the visible label points at the first box. An incomplete code is stopped with "Please type all 6 numbers of the code."
- **Countdown:** "Resend code in 00:60" (disabled) until it reaches zero, then a "Resend code" link (announced once to screen readers, not every second). It is worked out from the time the code was asked for (saved in the tab's sessionStorage), not from a ticking timer, so it is right after the phone sleeps; it refreshes when the page becomes visible and stops on page exit.
- **After a resend:** a pop-up "A new code has been sent to your phone number 0809•••0001." (`role="dialog"`, `aria-modal`, OK focused, Tab trapped, Escape closes). Focus then goes to the first code box, because the resend link is disabled again while it counts down.
- **Failure:** if the server refuses (too soon), the pop-up does not open; one friendly message appears next to the resend link ("We couldn't send a new code just now. Please wait a minute and try again.") and the duplicate message at the top of the page is hidden. Rapid clicks are blocked (the button is disabled while sending and while counting down).
- **Without JavaScript:** one code box and a "Send a new code" button, exactly as before.
- Checked in the real app with a new test account: all of the above, including a forced early resend.

### 13.5 Log-out confirmation (seniors and staff)

- One partial, `confirmLogoutModal.ejs`, included once in the footer for anyone logged in; every log-out form carries `data-confirm-logout` (senior Account page, staff sidebar, staff mobile bar). Those are all the log-out buttons in the app.
- "Log out" opens "Are you sure you want to log out?" with "You will need your phone number and password to log in again." `role="alertdialog"`, focus on **Cancel**, Tab trapped, Escape and a tap on the backdrop act as Cancel, scrolling locked, focus returns to the button.
- **Log out** sends the same form (so the page loader shows); **Cancel** keeps them on the page.
- **One server change, non-breaking:** `POST /logout` now redirects to `/login` instead of `/` (`src/routes/public.js`), as asked. No API or data change, and no test depended on it.
- Without JavaScript, the log-out button logs out straight away, as before.
- Checked in the real app as a senior (Account) and as staff (sidebar): Cancel, Escape and backdrop keep them on the page; Log out ends the session and lands on Log in.

### 13.6 Header fixes found while testing

A finer sweep (every 4px from 760 to 1300px) found two overflow gaps the earlier 10-width test missed:
- **1000 to 1023px:** the wordmark returned at 1024px while menu labels were already full size. The wordmark now stays visually hidden until 1280px (`md:max-xl:sr-only`; still in the link's name).
- **768 to 800px, logged in:** the unread count pushed the menu 32px over. The menu icons now step aside from 768 to 1023px (labels and count stay), and menu padding is tighter at that size.
- **Font Awesome overrides Tailwind's `hidden` on an icon** (its display rule is outside Tailwind's layers), so the language icon's hide from section 12 never actually worked. The responsive hide now sits on a wrapper `<span>` for both the language and menu icons.
- Result: **572 of 572 header checks pass** (320, 360, 390, 412, 600, every 4px from 760 to 1300, 1536, 1920; English and Yorùbá; logged in with an unread count and logged out): one line, no clipping, no page scroll, every control 48px+.

### 13.7 Strings

27 new keys in each of `locales/en.json` and `locales/yo.json` (`auth.*`, `signup.confirm_*`, `signup.password_match` / `_mismatch`, `verify.*` for the code and resend, `common.ok`, `logout.*`). No existing key changed. **The Yorùbá was written by me and should be checked by a native speaker**, especially `auth.trust_text`, `verify.resend_in` and `logout.text`.

### 13.8 Verification

| Check | Result |
|---|---|
| Real app, local database: log in (wrong password), sign up (mismatch, then match), verify (boxes, paste, Backspace, incomplete, countdown, resend pop-up, too-soon), log out as senior and staff | all behave as described above |
| Accessibility checker (axe 4.10 + text size, targets, overflow) on log in, sign up (and with errors), verify (both states), the log-in pop-ups, account and ID checks, English and Yorùbá, 360 and 1280px | clean, apart from the known frozen-animation artefact on the log-in pop-up pages (passes once animations finish, as in section 12) |
| Rendered sign-up fields | ids, names, `aria-describedby`, `aria-invalid` identical to before; Confirm password has no `name` |
| Browser console on the real pages | no errors |
| Content freeze against the previous commit | only the changes above; 54 keys added, none changed. (The tool cannot see inside the new partials, so it lists their attributes as "removed"; the rendered HTML shows they are all there) |
| Jest (`npm test`) | 58 of 59 in two full runs, each time a **different** test failing ("ID documents can only be opened by admins..." then "unverified seniors cannot open or send messages"); both pass when run on their own. The machine was also running the app, the database and browser checks, so this looks like timing under load, not this change (neither test touches these screens). A clean run on a quiet machine is worth doing |

**Assumptions:** the confirm box is browser-only (the server never required it); the resend countdown trusts the server's existing 60-second limit; after the resend pop-up, focus goes to the first code box because the resend link is disabled again.

**Test data:** testing created one account in your local database: **Test Elder (Claude QA), phone 08099990001**. Delete it from the staff Seniors page if you do not want it.

**Files in this pass:** `views/auth/login.ejs`, `views/auth/signup.ejs`, `views/auth/verify.ejs`, `views/partials/authAside.ejs`, `views/partials/loginModal.ejs`, `views/partials/header.ejs`, `views/partials/seniorNav.ejs`, `views/partials/footer.ejs`, `views/partials/nav.ejs`, `views/account/account.ejs`, new `views/partials/ui/textInput.ejs`, `views/partials/ui/passwordInput.ejs`, `views/partials/confirmLogoutModal.ejs`, new `public/js/ui.js` and `public/js/otp.js`, `src/styles/input.css`, rebuilt `public/css/main.css`, `locales/en.json`, `locales/yo.json`, `src/routes/public.js` (log-out redirect only), and this file. No existing file in `public/js` was modified.
