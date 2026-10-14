# Phase 3 design spec (the contract every batch is built to)

Part of the [UI revamp plan](GUIDE.md). Palette: [palette.md](palette.md). Findings being fixed: [audit.md](audit.md) section 4. The shared stylesheet is `src/styles/input.css`, which already contains everything named below. **Batches use these classes. They do not edit `input.css`.** If a batch needs a class that does not exist, it reports it and does not invent a one-off utility string for it.

## 1. Hard rules (a batch that breaks one fails review)

1. **Content freeze.** Do not change, add, remove, reword or reorder any visible text, `t('...')` call, EJS logic (`<% %>`), `href`, form `action`, `method`, `name`, `value`, `for`, input `type`, route path, or `id`/`data-*` hook that a script or test uses. Do not add new copy: no new `t()` keys, no new literal words. Reusing an existing key you can already see in the same template is allowed only where the spec below says so, and must be reported. Run-time behaviour must be identical.
2. **Only your files.** Edit only the files assigned to your batch. Never edit `src/**`, `locales/**`, `tests/**`, `package.json`, `render.yaml`, `docs/**`, or `src/styles/input.css`.
3. **No new dependencies, no new routes, no new images.**
4. The checker `node docs/ui-revamp/tools/content-freeze.mjs` compares every template with the original. Anything it flags must be intentional and listed in your report.

## 2. Type, size and spacing

The root is 19px. `text-base` = 19px is body text. Use only these sizes, never arbitrary ones (`text-[0.9rem]` is banned):

| Class | Size | Use |
|---|---|---|
| `text-sm` | 16.6px | The smallest text allowed: hints, tags, tab-bar labels, table notes |
| `text-base` | 19px | Body text, labels, links, inputs |
| `text-lg` | 21px | Button labels, lead paragraphs |
| `text-xl` / `text-2xl` | 24 / 28px | Card titles, section headings (h3, h2) |
| `text-3xl` / `text-4xl` | 36 / 43px | Page title (h1 is already styled), hero statements |
| `text-5xl` | 57px | Landing hero only, with `md:`, never on phones |

Weights: `font-normal` (400) for body, `font-bold` (700) for labels, headings, buttons. **Never** `font-light`, `font-thin`, `font-extralight`, `font-medium` for body text, and no `font-extrabold`/`font-black`. Line height comes with the size. No `tracking-*`, no `uppercase` on sentences.
Targets: every link, button, input and row you can press is **at least 48px tall** (`min-h-12` = 57px here) with **at least 8px between neighbours** (`gap-3` or more). Whole rows are the target for check boxes and radios (`.check`). Inline links inside a sentence are exempt. Use `p-*`, `gap-*` and `space-y-*` from the default scale, no arbitrary spacing.
Line length: long reading text gets the class `measure` (about 65 characters). Do not centre or justify paragraphs of more than two lines.
Rounded corners: `rounded-xl` for controls, `rounded-2xl` for cards and panels, `rounded-3xl` for dialogs. No `rounded-full` on buttons (only on `.chip`, tags, avatars and the icon circles that already are).

## 3. Colour (see palette.md for the pairs)

Use the **semantic** names: `primary`, `primary-dark`, `secondary`, `accent`, `accent-dark`, `success`, `success-dark`, `success-bg`, `warning-ink`, `warning-bg`, `error`, `error-bg`, `background`, `surface`, `surface-muted`, `surface-subtle`, `body`, `muted`, `on-primary-muted`, `border-strong`, `focus`, `sun`, `mint`. The old names (`indigo`, `coral`, `mist`, `leaf`, `ink`, `lilac`, `amber-*`, `full-*`) still work but **must be replaced by the semantic names in every file you touch**. Also replace `text-gray-500/600/700` with `text-muted`, `border-gray-300` with `border-border-strong`, `bg-white` with `bg-surface`, and hard-coded hex (`bg-[#f4f6fb]`) with a token.
Never: white text on `sun`, `mint`, `surface*`; `text-accent` or `text-coral` (accent is a fill with a white label only); `bg-error` (error is text/border on `error-bg`); `text-white/70` or any `/NN` opacity on text; `opacity-NN` on text; gradients (`bg-gradient-*`, `from-*`, `to-*`): use solid fills. On a `primary`/`primary-dark` surface secondary text is `text-on-primary-muted`, primary text is `text-white`.
Colour never carries meaning alone: every status has an **icon and its words** (see patterns).

## 4. Motion

Remove: `float`, `float-slow`, `dots-drift`, every `data-reveal` and `data-reveal-delay` attribute, `animate-*`, `hover:-translate-*`, `hover:scale-*`, `group-hover:translate-*`, `blur-3xl` decorative blobs, `backdrop-blur`. Keep colour transitions only (`transition-colors`). Auto-playing media: none (already so).

## 5. Component catalogue (all in `input.css`)

| Class | Use |
|---|---|
| `.btn` | Primary action. One per screen section. `.btn-block` for full width at every size |
| `.btn-plain` | Secondary action (outlined) |
| `.btn-volunteer` | Positive action (green): volunteer, accept |
| `.btn-coral` | Help and call actions (clay) |
| `.btn-link`, `.btn-link-danger` | Low-key text button or link-like button (e.g. the old `font-bold text-full-tag underline` buttons). Still 48px tall |
| `.chip` | Filter choices. Selected one gets `aria-current="true"` |
| `.back-link` | The "back" link at the top of a page |
| `.card`, `.panel`, `.icon-tile`, `.kicker` | Surfaces, icon square, small heading above a title (**replaces `text-coral` kickers**) |
| `.alert` + `.alert-success/-error/-warning/-info` | Banners and flash messages. Put a Font Awesome icon (`aria-hidden="true"`) first |
| `.field` (+ `.hint`, `.error`), `.check` | Forms (pattern below) |
| `.tag-amber`, `.tag-full`, `.tag-mine`, `.tag-leaf` | Status tags: always with an icon |
| `.nav-link`, `.tab-link` | Top menu links, phone bottom-bar items (set `aria-current="page"`) |
| `.site-header`, `.tabbar` | The sticky top bar and fixed bottom bar |
| `.dialog-backdrop`, `.dialog`, `.dialog-close` | Dialog shell (pattern below) |
| `.table-wrap`, `.admin-table` | Tables (pattern below) |
| `.page`, `.page-wide`, `.measure` | Page widths, reading width |

## 6. Patterns

**Button with icon.** The label is always real text. Icons are decoration.
```html
<a href="…" class="btn"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><%= t('existing.key') %></a>
```
**Round icon buttons are replaced by labelled buttons** (Skip / Register on the swipe cards): one `.btn-plain` and one `.btn` side by side in a `grid grid-cols-2 gap-3`, the existing word *inside* the button, the old `aria-label` removed because the visible text is the name. The form, its `id` (`skip-…`, `register-…`), hidden inputs and `action` stay exactly as they are. Remove the little caption span under the circle only if its text now sits inside the button.

**Form field.** Keep the existing `id`, `name`, `autocomplete`, `required`. Link the hint and the server error to the input and mark invalid, using only attributes (no new text):
```html
<div class="field">
  <label for="phone"><%= t('signup.phone') %></label>
  <input type="tel" id="phone" name="phone" autocomplete="tel-national" required
         aria-describedby="phone-hint<%= errors.phone ? ' phone-error' : '' %>"
         aria-invalid="<%= errors.phone ? 'true' : 'false' %>">
  <span class="hint" id="phone-hint"><%= t('signup.phone_hint') %></span>
  <% if (errors.phone) { %><span class="error" id="phone-error"><%= errors.phone %></span><% } %>
</div>
```
Do not add `role="alert"` to server-rendered errors (already on the page at load). Only add `aria-describedby` for hints and errors that exist for that field. Do not change `novalidate`. If a field already has a different `autocomplete`, leave it.

**Check box or radio.** `<label class="check"><input …> <span><%= existing text %></span></label>`. The input keeps its name, value, checked logic.

**Status tag.** Icon plus the existing words:
```html
<span class="tag-amber"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><%= existing %></span>
```
Icons: success `fa-circle-check`, warning `fa-triangle-exclamation`, error/full `fa-circle-xmark`, mine `fa-user-check`, unread dot `fa-circle` (small), info `fa-circle-info`.

**Dialog shell.** The three dialogs (`loginModal`, `events/registered`, `social/thread` incoming request) all use it. Keep every form and button exactly as is.
```html
<div class="dialog-backdrop" aria-hidden="true"></div>
<div id="login" class="dialog" role="dialog" aria-modal="true" aria-labelledby="login-title" aria-describedby="login-desc" data-dialog>
  <div class="mb-2 flex items-start justify-between gap-4">
    <h2 id="login-title" tabindex="-1">…</h2>
    <a href="<%= closeHref %>" class="dialog-close" aria-label="<%= t('modal.close') %>" data-dialog-close>&times;</a>
  </div>
  <p id="login-desc">…existing intro…</p>
```
Only add `data-dialog-close` where a close link already exists. `public/js/dialog.js` (already written) moves focus to the title, makes the rest of the page inert and closes on Escape. The footer partial loads it.

**Table.** Wrap in `<div class="table-wrap">`. Put `scope="col"` on header cells. Name the table with `aria-labelledby` pointing at the id of its existing heading (give the heading an `id`). Do **not** add a caption with new words.

**Navigation.** Top menu: `<a class="nav-link" aria-current="page">` only on the current page (keep the existing EJS that sets it). Phone bar: `<nav class="tabbar" aria-label="…existing…">` with `.tab-link` items, icon (`text-xl`) over the label. Labels use `text-sm` minimum and never wrap to a second line at 320px (use the existing short labels). The unread badge keeps its number and gets `text-sm font-bold` on `bg-accent text-white`.

**Skip link** (first thing in `<body>`): `<a href="#main" class="skip-link">`. Do **not** build it from `sr-only focus:not-sr-only`: the Font Awesome CDN stylesheet defines its own unlayered `.sr-only`, which beats Tailwind's layered focus rules and keeps the link invisible when focused (found and fixed in Phase 3). `.skip-link` lives outside any layer in `input.css` for that reason. `<main id="main" tabindex="-1">`.

**Language names** (English, Yorùbá) that sit inside other-language text get `lang="yo"` or `lang="en"` on a `<span>`.

**Images.** Decorative images keep `alt=""`. Do not invent alt text. Fix only a wrong file extension if the file on disk is `.jpg` (`/images/events/*.png` should be `.jpg`; report it).

**Layout at small sizes.** Must work at 320px wide and 400% zoom with no sideways page scroll: no fixed widths, stack with `flex-col` below `md:`, buttons full width on phones, `min-w-0` on flex children that hold text.

## 7. Scripts (accessibility-only edits, assigned to the partials batch)

- `public/js/swipe.js`: in the `keydown` handler return unless `e.target === card`, so arrow keys on the Skip/Register buttons or a link do not skip or register. Nothing else changes.
- `public/js/phone-input.js`: no behaviour change.
- `views/partials/footer.ejs` adds `<script src="/js/dialog.js" defer></script>`.
- `views/partials/header.ejs`: remove the Google Fonts `<link>`s (the font is self-hosted in the CSS) and the `reveal.js` script tag, and add `<link rel="preload" href="/fonts/noto-sans-variable.woff2" as="font" type="font/woff2" crossorigin>`.
- `public/js/reveal.js` is deleted by the lead after the batches land.

## 8. What each batch hands back

1. Files edited (list).
2. Every deliberate difference the content-freeze checker is expected to show, and why.
3. Classes you wanted that `input.css` does not have.
4. Anything you could not do without changing content or behaviour (recommendation only).
5. Anything you were unsure about.
