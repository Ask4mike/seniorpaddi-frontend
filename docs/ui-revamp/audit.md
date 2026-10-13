# Phase 0 Audit: UI inventory and current state

Part of the [UI revamp plan](GUIDE.md). Baseline taken 13 Oct 2026, before any UI change.
Purposes below come from file names, the handover guide and the files read in this phase. Line counts are from `wc -l`.

## 1. Stack in one paragraph

Server-rendered **Express 5 + EJS** pages. Styling is **Tailwind CSS v4 (CSS-first)**: one source file `src/styles/input.css` (theme in an `@theme` block, plus `@layer base` and `@layer components`) compiled with `@tailwindcss/cli` to `public/css/main.css` (53 KB, minified, committed to git). No `tailwind.config.js` and no PostCSS config, which is normal for v4. Icons are Font Awesome 6.5 from cdnjs. Font is Plus Jakarta Sans from Google Fonts. Client behaviour is six small dependency-free vanilla scripts, plus Socket.IO for chat. The app is bilingual (English and Yorùbá) through `t('key')` in the templates, with strings in `locales/*.json`.

The site is already built with Tailwind, so the work is **re-standardising and fixing accessibility**, not a migration. There is almost no legacy CSS to convert.

## 2. Inventory

### 2.1 Styles and theme

| File | Purpose | Framework | Styling approach |
|---|---|---|---|
| `src/styles/input.css` (218 lines) | Theme tokens (`@theme`), base type, component classes (`.btn`, `.btn-plain`, `.btn-coral`, `.btn-volunteer`, `.panel`, `.card`, `.field`, `.tag-*`, `.admin-table`), animations, swipe-card styles, reduced-motion block | Tailwind v4 | Source of truth |
| `public/css/main.css` (53 KB) | Compiled output, **committed** and what Render serves (its build step is only `npm install`) | generated | Never edit by hand |

### 2.2 Shared partials (`views/partials/`)

| File | Lines | Purpose | Styling approach |
|---|---|---|---|
| `header.ejs` | 70 | Page shell start: `<head>`, skip link, top bar for seniors (logo, language switch, Call button, Log in), or staff sidebar shell. Loads fonts, icons, CSS, scripts | Tailwind utilities |
| `footer.ejs` | 25 | Page shell end and the footer for seniors. Loads `swipe.js` | Tailwind utilities |
| `seniorNav.ejs` | 31 | Main menu: top on desktop, **fixed bottom bar on phones** (5 items with unread badge) | Utilities, conditional classes in EJS |
| `nav.ejs` | 52 | Staff sidebar (9 links, mobile scrolling bar) | Utilities |
| `flash.ejs` | 11 | Success/error banners | Utilities |
| `loginModal.ejs` | 69 | Sign-up / log-in pop-up dialog (works without JS) | Utilities plus `.field`, `.btn` |
| `phoneInput.ejs` | 13 | Phone number field | Utilities plus `.field` |
| `eventCard.ejs` | 72 | One event: image, tags, details, Skip / Register buttons | Utilities, `.swipe-card` |
| `eventImage.ejs` | 4 | Event picture, falling back to `/images/events/<category>.jpg` | Utilities |
| `eventTags.ejs` | 16 | Status tags (full, few left, mine, and so on) | `.tag-*` |
| `authAside.ejs` | 10 | Decorative side panel on sign-up and log-in pages | Utilities |
| `qr.ejs` | 8 | QR code (check-in) | Utilities |

### 2.3 Senior-facing pages

| File | Lines | Purpose | Styling approach |
|---|---|---|---|
| `home.ejs` | 127 | Landing: hero, three main actions, upcoming events, how it works, volunteer and call banners | Utilities heavy, `data-reveal`, `.float` animations |
| `about.ejs` | 43 | About the service | Utilities |
| `call.ejs` | 36 | "Call us" help page | Utilities |
| `error.ejs` | 5 | Error page | Utilities |
| `onboarding.ejs` | 31 | Welcome video, transcript, "Continue" / "Skip" | Utilities, `.btn`, `.panel` |
| `auth/login.ejs` | 35 | Log in | `.field`, `.btn`, utilities |
| `auth/signup.ejs` | 56 | Sign up (name, phone, email, password, age declaration) | `.field`, `.btn` |
| `auth/verify.ejs` | 43 | Phone verification code | `.field`, `.btn` |
| `auth/forgot.ejs` | 28 | Forgot password | `.field`, `.btn` |
| `auth/reset.ejs` | 21 | Reset password | `.field`, `.btn` |
| `auth/change.ejs` | 22 | Change password | `.field`, `.btn` |
| `events/index.ejs` | 62 | **Find events**: one swipe card at a time | Utilities, `.swipe-*` |
| `events/show.ejs` | 109 | Event detail and registration actions | Utilities, `.btn`, `.card` |
| `events/registered.ejs` | 40 | "You're registered" pop-up with volunteer offer | Utilities, `.btn` |
| `events/confirmed.ejs` | 25 | Registration confirmation | Utilities |
| `account/account.ejs` | 54 | My account | Utilities, `.card` |
| `account/settings.ejs` | 101 | Settings: language, reminders, picture and more | `.field`, radios and checkbox |
| `account/registrations.ejs` | 51 | My registrations | Utilities |
| `account/history.ejs` | 19 | Past events | Utilities |
| `account/delete.ejs` | 23 | Delete my account (destructive) | `.btn`, utilities |
| `social/find.ejs` | 117 | **Find seniors**: swipe cards | Utilities, `.swipe-*` |
| `social/inbox.ejs` | 28 | Message list | Utilities |
| `social/thread.ejs` | 77 | A conversation (live chat) | Utilities, uses `chat.js` |
| `social/notifications.ejs` | 19 | Notifications | Utilities |
| `social/block.ejs` | 14 | Block confirmation | `.btn`, utilities |
| `social/report.ejs` | 21 | Report someone | `.field`, `.btn` |

### 2.4 Staff pages (`views/admin/`)

| File | Lines | Purpose | Styling approach |
|---|---|---|---|
| `dashboard.ejs` | 179 | Upcoming events, attendance to enter, IDs to check, reports, charts (bars, ring) | Utilities, **inline `style=` for data-driven widths**, `dashboard.js` |
| `events.ejs` | 42 | Event list, cancel (native `confirm()`) | `.admin-table`, utilities |
| `event-form.ejs` | 133 | Add/edit event, with an inline script for the image preview | `.field`, utilities |
| `organizations.ejs`, `organization-edit.ejs`, `orgFields.ejs` | 27, 13, 16 | Partner organisations | `.field`, `.admin-table` |
| `seniors.ejs` | 48 | Find seniors, reset password, remove, delete (native `confirm()`) | `.admin-table` |
| `ids.ejs` | 37 | ID checks: approve or send back | utilities, `.btn` |
| `reports.ejs`, `report.ejs` | 37, 40 | Safety reports | utilities |
| `attendance.ejs` | 60 | Attendance list: print, radio per person | utilities, radios |
| `scan.ejs` | 29 | Scan a check-in code | utilities |
| `onboarding-video.ejs` | 35 | Upload the welcome video | `.field`, `data-upload` |
| `staff.ejs` | 50 | Staff accounts (native `confirm()`) | `.admin-table` |
| `system.ejs` | 48 | System health | utilities |

### 2.5 Email and scripts

| File | Lines | Purpose | Styling approach |
|---|---|---|---|
| `views/emails/layout.ejs` | 13 | HTML email wrapper | **Inline styles only** (correct for email). Body 18px, footer 15px |
| `public/js/swipe.js` | 80 | Drag/arrow-key swipe on cards. **Arrow keys act immediately** (register or skip) | JS-set transforms |
| `public/js/chat.js` | 99 | Live chat over Socket.IO, progressive enhancement | classes `chat-live`, `chat-offline` on `<body>` |
| `public/js/phone-input.js` | 71 | Phone validation messages, `aria-invalid`, shake class | toggles classes |
| `public/js/dashboard.js` | 41 | Refreshes dashboard numbers every 20 s, flashes `text-coral` | toggles Tailwind classes (needs `@source public/js`, already set) |
| `public/js/reveal.js` | 22 | Scroll-in reveal, adds `.revealed` | CSS-driven |
| `public/js/upload.js` | 11 | "Uploading…" button text | none |

### 2.6 Assets and tests

| Path | Notes |
|---|---|
| `public/images/hero.png`, `public/images/events/{faith,fitness,health,learning,skills,social}.jpg` | Hero art and category pictures |
| `locales/en.json`, `locales/yo.json` | Copy. **Not changed** in Phases 0 to 4, additive only in Phase 5 |
| `tests/newui.test.js` and 8 more | Jest + supertest, need PostgreSQL. UI-relevant assertions are listed in the GUIDE |

**Totals:** 54 templates, 6 scripts, 1 CSS source (plus 1 generated file), 7 images, 2 locale files.

## 3. Current-state summary

### 3.1 Layout patterns
- Two shells chosen in `header.ejs`: a **senior shell** (sticky top bar plus a fixed bottom nav on phones, centred `.page` / `.page-wide` column, dark footer) and a **staff shell** (left sidebar on desktop, scrolling bar on phones).
- Landing page uses full-width sections with decorative blurred blobs, gradient banners and floating images.
- Find events and Find seniors are **one-card-at-a-time swipe stacks** with round icon buttons.
- Forms use a stacked label-over-input `.field` pattern. Auth pages use a two-column card with a decorative aside.

### 3.2 Existing components
Classes: `.btn` (also `.btn-volunteer`, `.btn-coral`), `.btn-plain`, `.panel`, `.card`, `.field` (+ `.hint`, `.error`), four `.tag-*`, `.admin-table`. Partials listed in 2.2. A grep finds **195 lines using these classes across 44 files**, so the system exists but is only partly used. Many templates still hand-roll their own buttons, links and tags with long utility strings (examples: header language and Call buttons, `home.ejs` banner buttons, `eventCard.ejs` round buttons).

### 3.3 Styling debt (measured)
Counts are matching **lines** from a grep over `views/`, so they slightly understate repeated uses on one line.

| Item | Count |
|---|---|
| Hard-coded small text sizes (`text-[0.7rem]` to `text-[0.95rem]`, `text-xs`, `text-sm`). With the current 17px root, 0.75rem renders at about 13px and 0.95rem at about 16px | **45 lines in 12 files** (worst: `admin/dashboard.ejs` 12, `partials/eventCard.ejs` 8, `social/find.ejs` 6) |
| Low-contrast patterns (`text-gray-400/500/600`, `text-white/60 to /90`, `opacity-60 to /90`) | **55 lines in 13 files** (worst: `admin/dashboard.ejs` 18, `home.ejs` 7, `partials/footer.ejs` 5) |
| Base font size | 106.25% of 16px = **17px**, below the 18px target |
| Arbitrary values in templates | Many (`text-[1.9rem]`, `rounded-[2rem]`, `bg-[#fafbff]`, `bg-[#f4f6fb]`, `aspect-[4/3.4]`) instead of theme tokens |
| Palette | 15 colour tokens, no semantic roles (primary, success, error, and so on), and `bg-[#fafbff]` bypasses the theme |
| Inline `style=` | Only 4 data-driven widths and one conic gradient in `admin/dashboard.ejs`, plus the email layout. Acceptable |
| Native `confirm()` | 5 admin forms use browser dialogs for destructive actions |
| `.font-bold { font-weight: 600 }` override | Hides the real weight of `font-bold` everywhere. `font-extrabold` (800) is still used in the home hero |

### 3.4 Defects found while reading (verified in the files)
1. **Broken images:** `home.ejs:90-93` and `admin/event-form.ejs:113` point to `/images/events/*.png`, but the files on disk are `*.jpg`. The four home "how it works" pictures and the event-form default preview do not load.
2. **Reduced-motion bug (latent):** `input.css:216` re-enables `.dots-drift` inside the `prefers-reduced-motion: reduce` block. No template uses `.dots-drift` today, so nobody sees it yet, but it would defeat the setting the moment it is used. More important: the infinite `.float` and `.float-slow` animations (9 elements) are only switched off inside that block, and the scroll-reveal rule hides content (see section 4, items 8 and 9).
3. **Contrast failures by design:** white text on `--color-coral` (#f2795b) is about 2.7:1 (hand-computed from the hex), and the coral-to-sun banner (`home.ejs:118`) and leaf-to-mint banner (`home.ejs:112`) are lower still. Exact ratios come in Phase 2.
4. **Arrow keys register for an event** with no confirmation (`swipe.js:65-68`). One stray key press on a focused card submits Register or Skip.
5. **Modal focus:** `loginModal.ejs` has `role="dialog"` and `aria-modal`, but nothing moves focus into it, traps it, or returns it. The close control is an `×` link.
6. **Form errors** (`signup.ejs:17`, and the same pattern in other forms) are plain `<span class="error">` with no `aria-describedby` or `role="alert"`, so screen readers do not hear them.
7. **Mobile bottom nav** labels are about 13px (`seniorNav.ejs:20`), and the unread badge is about 12px.

### 3.5 What is already good (keep)
Skip link on both shells. `lang` set on `<html>`. Icons are `aria-hidden` and paired with text. `aria-current="page"` in both navs. Labelled `<nav>` landmarks. Real `<label for>` on form fields. Native elements and forms that work without JavaScript. Progressive enhancement in `chat.js`, `swipe.js` and `upload.js`. `min-h-12` (48px) on buttons and inputs. `outline-3` focus ring. Dimensions on images. Lazy loading on event images.

## 4. Accessibility audit (WCAG 2.2, `ecc:a11y-architect`)

Static read of every view, every script and `input.css`. **Nothing was rendered in a browser**, and contrast ratios are computed from the `@theme` hex values and Tailwind v4 default greys, so treat them as approximate until Phase 2 and Phase 4 measure them. Items marked ✔ were re-checked by me against the files. The rest are the agent's reading and will be confirmed when each template is edited.

### 4.1 Top issues

| # | Severity | Issue | Where | Markup/Tailwind-only fix |
|---|---|---|---|---|
| 1 ✔ | Critical | Incoming-request dialog has no height cap or scroll. At 400% zoom or in landscape the Accept/Decline buttons are clipped and unreachable (1.4.10, 2.1.1). The other two dialogs do have `max-h` and `overflow-y-auto`. | `social/thread.ejs:61-62` | Add `max-h-[92vh] overflow-y-auto` |
| 2 | High | **Coral-family contrast** (1.4.3, 1.4.11): white on coral about 2.7:1, coral text on white about 2.7:1, coral-dark about 3.9:1, white on sun about 1.8:1, white on mint about 2.5:1. About 23 lines in 7 files, including `home.ejs` L15, 38, 45, 51, 64, 96, 102, 112-122, `about.ejs` L6 and L35-39, `header.ejs:55` (Call button), `seniorNav.ejs:25`, `registrations.ejs:34`, `eventCard.ejs` L16 and L46, `find.ejs` L25 and L36 | see left | Darken coral to about #bf4128 (about 5.2:1 on white) or put dark text on coral. Replace gradients with solid dark fills. Remove `opacity-85/90` on text |
| 3 | High | **Text size.** 17px root. About 50 uses of 0.7 to 0.95rem (46 in 12 views, 4 in `input.css`), 29 of them senior-facing. Bottom-nav labels render at 12.75px and the badge at 11.9px (`seniorNav.ejs` L20, L25). Worst: `dashboard.ejs` 12, `eventCard.ejs` 8, `find.ejs` 6 | many | Root 112.5 to 118.75%, floor all text at `text-base` |
| 4 | High | **Dialogs lack focus management** (2.4.3, 4.1.2): rendered inline at the end of `<main>`, so focus starts at the page top, the background is not inert, no Esc, no focus return. Close `×` is about 35x32px | `loginModal.ejs` L10-16, `registered.ejs` L8-10, `thread.ejs` L60-62 | Move the include after `</main>`, server-render `inert` on the page shell while a dialog is open, `tabindex="-1" autofocus` on the title, `aria-describedby`, a 48px close control. Esc and focus return need about 10 lines of JS |
| 5 | High | **Hints and errors are not linked to fields** (1.3.1, 3.3.1, 3.3.3, 4.1.3): 21 `.hint` spans in 9 files and 11 server `.error` spans have no id, `aria-describedby`, `aria-invalid` or `role`. `input.css:121` styles `aria-invalid` but only `phone-input.js` ever sets it. Signup forms use `novalidate` with no error summary | `signup.ejs` L17-46, `settings.ejs:43`, `staff.ejs` L35 and L41, `event-form.ejs:4` | One shared field partial emitting ids, `aria-describedby`, `aria-invalid`, plus an error summary with `role="alert"` |
| 6 | High | **Field borders and focus** (1.4.11, 2.4.7): `border-gray-300` is about 1.5:1 on white. `focus:outline-none` with a 10% ring leaves a 1px border change. The global coral focus outline is about 2.7:1 on white and 2.4:1 on mist | `input.css` L50, L109-110 | `border-2 border-gray-500`, `focus:ring-4` at 40%, keep the outline, indigo-dark or ink outline colour |
| 7 | High | **Targets under 48px**: about 55 lines in about 25 files, about 40 senior-facing. Passes the 24px AA minimum (2.5.8), fails the 48px goal. Includes header pills (about 42px), top-nav links, filter chips, checkbox/radio rows (about 28px), text-link buttons, standalone links in footer, show, thread and find | see 4.2 | `min-h-12`, padding and `inline-flex items-center` on chips, pills, text buttons, links and check rows |
| 8 | High | **Infinite motion** (2.2.2, 2.3.3): `.float` (6s) and `.float-slow` (9s) loop forever on 9 elements: `home.ejs` L5, 6, 30, 90-93, `about.ejs:9`, `authAside.ejs:9` (shown on all 5 auth pages) | `input.css` L155-165, L211-218 | Wrap animations in `@media (prefers-reduced-motion: no-preference)`, limit or remove them, delete L216 |
| 9 ✔ | High | **Reveal-on-scroll can hide content permanently**: `data-reveal` is on 44 lines in 13 files, including the home h1 and all 5 auth cards, and sets `opacity: 0`. The `js` class is added inline but `reveal.js` is `defer`, so a slow or failed script leaves content invisible. The fade also delays forms by 0.7s | `input.css` L168-178, `header.ejs:14` | Hide only inside `no-preference`. Remove `data-reveal` from above-the-fold content, forms and auth cards |
| 10 ✔ | High | **Swipe cards:** the `keydown` listener sits on the card with no `e.target` guard, so ArrowLeft/Right while the Skip or Register **button** or the map link is focused fires skip or register, and register submits. `.swipe-badge` text is read twice by screen readers. The swipe hint is `hidden md:block`, so touch users never see it, and `find.ejs` has none | `swipe.js:65-68`, `eventCard.ejs` L16-17, L69, `find.ejs` L25-26 | One-line guard in JS, `aria-hidden` on badges, show the hint at all sizes |
| 11 | Med-High | Sticky header and fixed bottom nav with no scroll padding. At 400% zoom about half of a 320x256 viewport is covered, so focused items can hide (1.4.10, 2.4.11). Header is one non-wrapping row at 768 to 1024px, to verify in a browser | `header.ejs:35`, `seniorNav.ejs:14` | `scroll-padding` on `html`, bars become static on short viewports |
| 12 | Med-High | **Icon-only round buttons** with the visible label outside the control and about 14px. If the Font Awesome CDN fails they are blank circles. Coral icon about 2.7:1 and a near-invisible border | `eventCard.ejs` L46, 54, 62, `find.ejs` L36, 42 | Put a `text-base` label inside the control, indigo for Skip |
| 13 | Medium | **Colour-only state** (1.4.1): active filter chip, unread notifications, flash message type, coral progress bars | `events/index.ejs` L20-22, `notifications.ejs:11`, `flash.ejs` L2-8, `dashboard.ejs` L81, L134 | `aria-current`, a check icon, an unread dot icon, an icon per flash type |
| 14 | Medium | **Admin tables and data** (1.3.1, 1.1.1, 4.1.3): 5 tables lack caption or `scope`, one empty `<th>`. Attendance radios are 24px and not named by person. The dashboard chart is `role="img"` with hover-only `title`, and `aria-live` announces bare numbers | `attendance.ejs` L33, L43-49, `dashboard.ejs` L34, L53-55, L125-126, L166, `system.ejs:21`, `reports.ejs:23` | `scope`, sr-only caption, a fieldset per row, an sr-only data list, `aria-live="off"` |
| 15 | Medium | **Structure and language**: `registered.ejs` has no `h1`, `call.ejs:17` fakes a heading with a styled `<p>`, the language names in settings, admin video and seniors lack `lang` (3.1.2), `<main>` lacks `tabindex="-1"`, the email layout has no `lang` or `<title>` | see left | Semantic fixes only |

### 4.2 Tallies

| Area | Finding |
|---|---|
| Text size | By size: 0.7rem x1, 0.75rem x4, 0.85rem x11, 0.9rem x13, 0.95rem x17. `text-xs` and `text-sm` are not used. `text-base` (17px) on 23 lines in 15 files |
| Contrast | About 23 coral-family lines fail. `text-gray-500` on 15 lines (12 in dashboard) is about 4.8:1 on white but about 4.3 to 4.5 on tinted backgrounds. Disabled `.btn[disabled]` is about 2.6:1. `authAside.ejs:4` `white/90` is about 3.3:1 at the lilac end. Placeholders are about 3.3:1 (inferred from Tailwind v4 preflight). Passing: white at 70 to 90% on indigo (5.9:1 or better), and the indigo, leaf, full-tag and amber-tag pairs |
| Targets | Senior-facing worst offenders: `header.ejs` L50, 55, 59, `seniorNav.ejs:20` (top variant), `events/index.ejs` L20 and L22, `loginModal.ejs` L16 and L43, `settings.ejs` L13 and L22, `signup.ejs:43`. Admin: `nav.ejs` L25 and L49, `seniors.ejs`, `staff.ejs`, `events.ejs`, `dashboard.ejs`, `attendance.ejs:46`, `event-form.ejs` L93 and L105 |
| Names and icons | Every icon is `aria-hidden`. 7 icon-only controls are all named. `nav.ejs:25` has a hard-coded English label. The unread badge number has no meaning for screen readers |
| Forms | About 45 fields, all labelled (no placeholder-only labels). Fieldsets on settings and event-form only. No visible required markers. Missing `autocomplete` on `settings.ejs` L36 and L48. 21 hints and 11 errors unwired |
| Landmarks | Banner, nav, main, footer and skip link present. The admin skip link is English-only with no background (`header.ejs:26`). Footer link list is not in a `<nav>`. `.page` is `max-w-4xl`, giving lines of 100+ characters |
| Motion | 9 `.float*` elements, 44 `data-reveal` lines, no autoplay media (onboarding video is `controls preload="none"`). `phone-shake` is toggled by `phone-input.js` but has **no CSS** (the shake never shows) ✔ |
| Images | Only `home.ejs:30` has a real alt. Event images use `alt=""`. The `.png` vs `.jpg` mismatch is confirmed in section 3.4 |
| Viewport | Meta tag does not block zoom. Line-height is 1.625 |

### 4.3 Repeated patterns to extract in Phase 3

1. **Form field** partial (label, input, hint, error, ids): about 40 blocks (`signup`, `settings`, `loginModal`, `staff`, `event-form`, `orgFields`).
2. **Auth card shell**: identical wrapper in login, signup, forgot, reset, change.
3. **Alert banner**: 8 hand-written variants plus `flash.ejs`.
4. **Round action button with label**: `eventCard.ejs` and `find.ejs` (4 near-identical buttons).
5. **Dialog shell**: `loginModal`, `registered`, `thread` (fixes issues 1 and 4 once).
6. **Text-link button** (`font-bold text-full-tag underline` x5, `text-indigo underline` x3) → `.btn-link` with `min-h-12`.
7. **Chip / pill link**: `events/index.ejs`, `header.ejs`, `seniorNav.ejs`.
8. **Icon tile**, **section kicker + h2**, **back link**, **admin card** (7 in `dashboard.ejs`), **data table helper** with caption and `scope`.
9. **`btn w-full sm:w-full`**: 17 uses in 12 files → `.btn-block`.
10. **Checkbox/radio row**: 7 uses → `.check` with `min-h-12`.
11. Login and signup fields are duplicated between `loginModal.ejs` and `auth/login.ejs` / `auth/signup.ejs`.

### 4.4 Recommendation-only (needs a content or behaviour change, or is outside the UI zone)

| Item | Why it is not done here |
|---|---|
| Captions for the onboarding video (`onboarding.ejs:8-10`) | Needs a `.vtt` file. A transcript exists. Add `<track kind="captions">` when the file exists |
| Text baked into `hero.png` (English UI text and a sample ticket "SP-7K3QX9") stays English on the Yorùbá site | Needs new artwork and a localised alt |
| "(opens in new tab)" cue on `target=_blank` links, a meaning for the nav unread badge, an "unread" label on notifications | Each needs a **new string**. Reuse existing keys such as `nav.notifications_count` and `messages.new` where possible |
| Confirmation before destructive actions: cancel registration (`registrations.ejs` L39-42), block, admin report action (`report.ejs:33`), delete account | A new confirmation step is a **behaviour change** |
| Show-password toggle, phone paste tolerance (`phone-input.js` L39-45 rejects pasted spaces as "letters") | New behaviour |
| Dashboard live announcements | Behaviour |
| `system.ejs:9` "If something is red" (sensory wording), all admin strings are hard-coded English | Copy change |
| Per-event image alt text | Needs an admin field (`event-form.ejs` L111-117) |
| `lang` on user-supplied fallback text (`tTitle || title`) | Needs the source language of the data |
| Call link below `lg` width: hidden in the header, and absent from the bottom nav | Adding it changes navigation |
| Render build command should run `npm run build` | Outside the UI zone (`render.yaml`) |

### 4.5 Accessibility-only JS edits proposed (flag for approval, D4 in the GUIDE)

These change keystroke or focus handling but add no feature: the `e.target` guard in `swipe.js`, Esc to close and focus return for dialogs, and `aria-hidden` on swipe badges. The brief permits "usability aids", but they touch behaviour, so I will list them in the Phase 3 summary rather than do them silently.
