## Every text colour pair the templates use

Baseline = commit `f82a8da` (templates and theme). After = working tree. Unique pairs: 42 before, 42 after. Judged as normal text (limits in the script header).

| | Before | After |
|---|---|---|
| Below 3:1 (fails everything) | 13 | 2 |
| 3:1 to 4.5:1 (large text only) | 9 | 4 |
| 4.5:1 to 7:1 (AA) | 6 | 9 |
| 7:1 and above (AAA) | 14 | 27 |

### Before: pairs below 4.5:1

| Ratio | Pair | Uses | First places |
|---|---|---|---|
| 1.76 | text-white on bg-coral / bg-sun | 2 | about.ejs:35, home.ejs:118 |
| 1.76 | text-white on bg-sun | 1 | admin/dashboard.ejs:92 |
| 2.05 | text-sun on surface (indigo, indigo-dark, lilac) | 3 | partials/authAside.ejs:5, partials/authAside.ejs:6, partials/authAside.ejs:7 |
| 2.19 | text-mint on surface ([#fafbff], white, mist) | 6 | about.ejs:23, about.ejs:24, about.ejs:25 |
| 2.19 | text-mint on surface ([#fafbff], white, mist, [#f4f6fb]) | 1 | admin/dashboard.ejs:150 |
| 2.44 | text-coral on surface ([#fafbff], white, mist) | 9 | about.ejs:6, account/registrations.ejs:33, home.ejs:11 |
| 2.44 | text-coral on surface ([#fafbff], white, mist, [#f4f6fb]) | 1 | admin/dashboard.ejs:104 |
| 2.46 | text-white on bg-mint | 1 | about.ejs:30 |
| 2.46 | text-white on bg-leaf / bg-mint | 1 | home.ejs:112 |
| 2.59 | text-white/70 on surface (indigo, indigo-dark, lilac) | 1 | partials/nav.ejs:45 |
| 2.74 | text-white on bg-coral | 4 | about.ejs:14, admin/dashboard.ejs:96, partials/header.ejs:55 |
| 2.74 | text-coral on bg-white | 4 | partials/eventCard.ejs:16, partials/eventCard.ejs:46, social/find.ejs:25 |
| 2.91 | text-white/80 on surface (indigo, indigo-dark, lilac) | 2 | partials/footer.ejs:12, social/thread.ejs:35 |
| 3.07 | text-white/85 on surface (indigo, indigo-dark, lilac) | 3 | partials/nav.ejs:25, partials/nav.ejs:36, partials/nav.ejs:49 |
| 3.25 | text-white/90 on surface (indigo, indigo-dark, lilac) | 5 | partials/authAside.ejs:4, partials/footer.ejs:15, partials/footer.ejs:16 |
| 3.46 | text-coral-dark on surface ([#fafbff], white, mist) | 1 | account/registrations.ejs:34 |
| 3.61 | text-white on bg-lilac / bg-indigo | 2 | account/account.ejs:23, social/find.ejs:22 |
| 3.61 | text-white on bg-indigo / bg-lilac | 1 | partials/authAside.ejs:2 |
| 3.61 | text-white on surface (indigo, indigo-dark, lilac) | 1 | partials/nav.ejs:17 |
| 3.88 | text-coral-dark on bg-white | 2 | about.ejs:39, home.ejs:122 |
| 4.31 | text-gray-500 on surface ([#fafbff], white, mist, [#f4f6fb]) | 12 | admin/dashboard.ejs:17, admin/dashboard.ejs:38, admin/dashboard.ejs:51 |
| 4.31 | text-gray-500 on surface ([#fafbff], white, mist) | 3 | partials/eventCard.ejs:34, partials/eventCard.ejs:36, partials/eventCard.ejs:69 |

### After: pairs below 4.5:1

| Ratio | Pair | Uses | First places |
|---|---|---|---|
| 1.76 | text-white on bg-coral / bg-sun | 2 | about.ejs:35, home.ejs:118 |
| 1.76 | text-white on bg-sun | 1 | admin/dashboard.ejs:92 |
| 4.07 | text-sun on surface (primary, indigo, primary-dark, indigo-dark, secondary, lilac) | 3 | partials/authAside.ejs:5, partials/authAside.ejs:6, partials/authAside.ejs:7 |
| 4.08 | text-mint on surface (background, white, surface-muted) | 6 | about.ejs:23, about.ejs:24, about.ejs:25 |
| 4.08 | text-mint on surface (background, white, surface-muted, [#f4f6fb]) | 1 | admin/dashboard.ejs:150 |
| 4.45 | text-white/70 on surface (primary, indigo, primary-dark, indigo-dark, secondary, lilac) | 1 | partials/nav.ejs:45 |

### After: pairs between 4.5:1 and 7:1 (AA, short of the AAA target)

| Ratio | Pair | Uses |
|---|---|---|
| 4.58 | text-white on bg-mint | 1 |
| 4.58 | text-white on bg-leaf / bg-mint | 1 |
| 5.26 | text-white/80 on surface (primary, indigo, primary-dark, indigo-dark, secondary, lilac) | 2 |
| 5.41 | text-coral on surface (background, white, surface-muted) | 9 |
| 5.41 | text-coral on surface (background, white, surface-muted, [#f4f6fb]) | 1 |
| 5.70 | text-white/85 on surface (primary, indigo, primary-dark, indigo-dark, secondary, lilac) | 3 |
| 6.07 | text-white on bg-coral | 4 |
| 6.07 | text-coral on bg-white | 4 |
| 6.17 | text-white/90 on surface (primary, indigo, primary-dark, indigo-dark, secondary, lilac) | 5 |

## Component classes defined in `src/styles/input.css`

| Component | Kind | Before | After | After verdict |
|---|---|---|---|---|
| .btn label | text | 10.08 | 10.08 | AAA |
| .btn hover | text | 13.55 | 13.55 | AAA |
| .btn-volunteer label | text | 5.25 | 8.20 | AAA |
| .btn-volunteer hover | text | 7.93 | 11.76 | AAA |
| .btn-coral label | text | 2.74 | 6.07 | AA |
| .btn-coral hover | text | 3.88 | 8.08 | AAA |
| .btn-plain label | text | 10.08 | 10.08 | AAA |
| .field input text | text | 15.89 | 15.89 | AAA |
| .field input border | UI / non-text (3:1) | 1.47 | 4.52 | pass (3:1) |
| .hint on page | text | 7.31 | 7.66 | AAA |
| .hint on white | text | 7.56 | 7.92 | AAA |
| .hint on muted surface | text | 6.74 | 7.06 | AAA |
| .error on page | text | 7.61 | 8.00 | AAA |
| .error on error tint | text | 6.70 | 7.05 | AAA |
| .tag-amber | text | 6.55 | 7.78 | AAA |
| .tag-full | text | 6.70 | 7.05 | AAA |
| .tag-mine | text | 8.99 | 8.99 | AAA |
| .tag-leaf | text | 4.99 | 7.79 | AAA |
| .admin-table th on page | text | 4.68 | 7.66 | AAA |
| .admin-table th on admin bg | text | 4.47 | 7.33 | AAA |
| body text on page | text | 15.37 | 15.37 | AAA |
| focus outline on page | UI / non-text (3:1) | 2.65 | 5.66 | pass (3:1) |
| focus outline on white | UI / non-text (3:1) | 2.74 | 5.85 | pass (3:1) |
| focus outline on muted surface | UI / non-text (3:1) | 2.44 | 5.22 | pass (3:1) |
| focus outline on primary (header, footer, sidebar) | UI / non-text (3:1) | 3.68 | 5.72 | pass (3:1) |
| .btn[disabled] (inactive controls are exempt) | text | 2.60 | 2.60 | exempt (inactive) |

## Palette roles (after)

**Brand**

| Token | Hex |
|---|---|
| `primary` | `#22407a` |
| `primary-dark` | `#172d57` |
| `secondary` | `#5b4aa0` |
| `accent` | `#9c4c16` |
| `accent-dark` | `#7f3e12` |

**Status**

| Token | Hex |
|---|---|
| `success` | `#175a3a` |
| `success-dark` | `#0f4029` |
| `success-bg` | `#ecfdf5` |
| `warning-ink` | `#6b4200` |
| `warning-bg` | `#fff1cc` |
| `error` | `#991c1c` |
| `error-bg` | `#fde8e8` |

**Surfaces**

| Token | Hex |
|---|---|
| `background` | `#fafbff` |
| `surface` | `#ffffff` |
| `surface-muted` | `#eef2fa` |
| `surface-subtle` | `#f4f6fb` |

**Text and lines**

| Token | Hex |
|---|---|
| `body` | `#16213e` |
| `muted` | `#465072` |
| `on-primary-muted` | `#dbe4f8` |
| `border-strong` | `#6b7694` |

**Focus**

| Token | Hex |
|---|---|
| `focus` | `#2f5bd6` |
| `focus-on-dark` | `#f6b93b` |

**Decorative only (never text, never the only cue)**

| Token | Hex |
|---|---|
| `sun` | `#f6b93b` |
| `mint` | `#2a8371` |

## Role pairs (after)

| Pair | Ratio | Verdict |
|---|---|---|
| Body text on background | 15.37 | AAA |
| Body text on white surface | 15.89 | AAA |
| Body text on muted surface | 14.17 | AAA |
| Muted text on background | 7.66 | AAA |
| Muted text on white surface | 7.92 | AAA |
| Muted text on muted surface | 7.06 | AAA |
| Muted text on admin background | 7.33 | AAA |
| White label on primary | 10.08 | AAA |
| White label on primary-dark (hover) | 13.55 | AAA |
| Primary text on white | 10.08 | AAA |
| White label on accent | 6.07 | AA |
| White label on accent-dark (hover) | 8.08 | AAA |
| Accent text on white | 6.07 | AA |
| White label on success | 8.20 | AAA |
| White label on success-dark (hover) | 11.76 | AAA |
| Success text on success tint | 7.79 | AAA |
| Warning text on warning tint | 7.78 | AAA |
| Error text on white | 8.28 | AAA |
| Error text on error tint | 7.05 | AAA |
| White label on secondary | 7.16 | AAA |
| Dark text on sun (decorative fill) | 9.02 | AAA |
| Light text on primary | 7.91 | AAA |
| Light text on primary-dark | 10.63 | AAA |
| Field border on background | 4.37 | pass (3:1) |
| Field border on white | 4.52 | pass (3:1) |
| Field border on muted surface | 4.03 | pass (3:1) |
| Focus ring on background | 5.66 | pass (3:1) |
| Focus ring on white | 5.85 | pass (3:1) |
| Focus ring on muted surface | 5.22 | pass (3:1) |
| Focus ring on admin background | 5.41 | pass (3:1) |
| Focus ring (dark surfaces) on primary | 5.72 | pass (3:1) |
| Focus ring (dark surfaces) on primary-dark | 7.69 | pass (3:1) |
| Mint graphic on white | 4.58 | pass (3:1) |
| Success graphic on white | 8.20 | pass (3:1) |
| Error graphic on white | 8.28 | pass (3:1) |

## Colour-vision simulation (after)

**Contrast of the key pairs as seen with each type of colour blindness** (simulated, full severity). Brightness contrast should stay put; if it drops, the pair relied on hue.

| Pair | Normal | Protanopia | Deuteranopia | Tritanopia |
|---|---|---|---|---|
| Body text on background | 15.37 | 15.00 | 15.59 | 15.25 |
| Muted text on background | 7.66 | 7.42 | 7.81 | 7.58 |
| White label on primary | 10.08 | 9.37 | 10.56 | 9.49 |
| White label on accent | 6.07 | 7.23 | 5.50 | 6.12 |
| Accent text on white | 6.07 | 7.23 | 5.50 | 6.12 |
| White label on success | 8.20 | 7.76 | 8.54 | 8.20 |
| Success text on success tint | 7.79 | 7.45 | 8.04 | 7.77 |
| Warning text on warning tint | 7.78 | 8.34 | 7.45 | 7.67 |
| Error text on white | 8.28 | 10.87 | 7.15 | 7.76 |
| Error text on error tint | 7.05 | 9.08 | 6.17 | 6.56 |
| Field border on background | 4.37 | 4.25 | 4.45 | 4.34 |
| Focus ring on background | 5.66 | 4.85 | 5.76 | 4.86 |

**Can two status or brand colours be told apart by colour alone?** Distance (CIE76 delta E) between each pair. Below about 25 the two can look alike, so they must also differ by icon and word. The design already requires an icon and a word for every status.

| Colour pair | Normal | protanopia | deuteranopia | tritanopia |
|---|---|---|---|---|
| primary / secondary | **23** (alike) | **14** (alike) | **12** (alike) | **16** (alike) |
| primary / accent | 84 | 77 | 86 | 73 |
| primary / success | 63 | 52 | 50 | **13** (alike) |
| primary / warning-ink | 78 | 73 | 80 | 50 |
| primary / error | 81 | 58 | 77 | 90 |
| primary / sun | 116 | 115 | 119 | 74 |
| primary / mint | 60 | 47 | 44 | 26 |
| secondary / accent | 89 | 87 | 91 | 60 |
| secondary / success | 82 | 63 | 56 | **24** (alike) |
| secondary / warning-ink | 88 | 84 | 86 | 40 |
| secondary / error | 81 | 69 | 83 | 79 |
| secondary / sun | 122 | 122 | 121 | 60 |
| secondary / mint | 77 | 54 | 46 | 32 |
| accent / success | 68 | **25** (alike) | 37 | 76 |
| accent / warning-ink | **20** (alike) | **8** (alike) | **12** (alike) | **23** (alike) |
| accent / error | **24** (alike) | **22** (alike) | **11** (alike) | **20** (alike) |
| accent / sun | 48 | 49 | 43 | 39 |
| accent / mint | 74 | 38 | 47 | 83 |
| success / warning-ink | 51 | **22** (alike) | 31 | 54 |
| success / error | 82 | **11** (alike) | 28 | 92 |
| success / sun | 82 | 68 | 75 | 74 |
| success / mint | **19** (alike) | **19** (alike) | **19** (alike) | **18** (alike) |
| warning-ink / error | 38 | **16** (alike) | **5** (alike) | 39 |
| warning-ink / sun | 54 | 57 | 54 | 46 |
| warning-ink / mint | 61 | 39 | 44 | 64 |
| error / sun | 69 | 69 | 53 | 53 |
| error / mint | 88 | 30 | 40 | 101 |
| sun / mint | 84 | 69 | 76 | 73 |
