#!/usr/bin/env node
// SeniorPadi colour checker (UI revamp, Phase 2). No dependencies, Node 20+.
//
//   node docs/ui-revamp/tools/contrast.mjs                  everything, Markdown on stdout
//   node docs/ui-revamp/tools/contrast.mjs --only pairs     only the "every pair the app uses" section
//   node docs/ui-revamp/tools/contrast.mjs --only roles     only the palette role tables
//   node docs/ui-revamp/tools/contrast.mjs --only cvd       only the colour-vision simulation
//   node docs/ui-revamp/tools/contrast.mjs --base <ref>     compare against another git ref (default: baseline commit)
//   node docs/ui-revamp/tools/contrast.mjs --check          exit 1 if any pair the app uses is below 4.5:1 (for Phase 6)
//
// BEFORE = templates + theme at the baseline commit.  AFTER = the working tree.
//
// What "every pair" means here, and its limits (read before trusting a number):
//  * It scans every class="..." in views/**/*.ejs, expands EJS ternaries into their alternatives, and pairs the
//    text-* colour with the bg-* colour (or both gradient stops) found in the same class string.
//  * A text colour with no background in the same string sits on a parent's background, which the scanner cannot see.
//    Light text (white, sun) is tested against the dark brand surfaces (primary, primary-dark, secondary). Dark text is
//    tested against the page background, white and the muted surface (plus the admin background inside views/admin).
//    The WORST result is reported, so this can over-report (for example the footer is reported against secondary
//    too), it will not under-report.
//  * Font size and weight are not known to the scanner, so every text pair is judged against the normal-text
//    limit (4.5:1 AA, 7:1 AAA). Large bold text only needs 3:1 / 4.5:1, so a pair that lands between is "large text only".
//  * hover:/focus:/md: variants and colours set from JavaScript or from component classes are skipped by the scanner.
//    The component classes in src/styles/input.css are checked separately in the "component classes" table.
//  * Tailwind's default colours are rounded sRGB hex values of the v4 palette. Opacity (text-white/80, bg-white/85,
//    opacity-85) is composited over the real background before measuring.
//  * Colour-vision simulation uses the Machado, Oliveira and Fernandes (2009) matrices at full severity, applied in
//    linear RGB. Verify a few results with an independent tool (see research.md) before relying on the exact numbers.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BASE = opt('--base', 'f82a8da');
const ONLY = opt('--only', 'all');
const CHECK = args.includes('--check');
const want = (s) => ONLY === 'all' || ONLY === s;

// ---------- colour maths ----------
const hexToRgb = (s) => { s = s.replace('#', ''); if (s.length === 3) s = [...s].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const unlin = (v) => 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]]
};
const simulate = (c, m) => { const l = c.map(lin); return m.map((r) => unlin(Math.max(0, Math.min(1, r[0] * l[0] + r[1] * l[1] + r[2] * l[2])))); };
const lab = (c) => {
  const [r, g, b] = c.map(lin);
  const X = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047, Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b, Z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const deltaE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
const f2 = (n) => n.toFixed(2);
const grade = (r, kind = 'text') => (kind === 'ui' ? (r >= 3 ? 'pass (3:1)' : 'FAIL') : r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'large text only' : 'FAIL');

// ---------- theme and templates, at a git ref or in the working tree ----------
const git = (cmd) => execSync('git ' + cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const readAt = (ref, file) => (ref ? git(`show ${ref}:${file}`) : fs.readFileSync(path.join(ROOT, file), 'utf8'));
function listViews(ref) {
  if (ref) return git(`ls-tree -r --name-only ${ref} views`).split('\n').filter((f) => f.endsWith('.ejs'));
  const out = []; const walk = (d) => { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const p = d + '/' + e.name; e.isDirectory() ? walk(p) : p.endsWith('.ejs') && out.push(p); } };
  walk('views'); return out;
}
const TW = { white: '#ffffff', black: '#000000', 'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5dc', 'gray-400': '#99a1af', 'gray-500': '#6a7282', 'gray-600': '#4a5565', 'gray-700': '#364153', 'gray-800': '#1e2939', 'gray-900': '#101828', 'green-50': '#f0fdf4', 'emerald-50': '#ecfdf5' };
function parseTheme(css) {
  const raw = {};
  for (const block of css.matchAll(/@theme[^{]*\{([^}]*)\}/g)) for (const d of block[1].matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g)) raw[d[1]] = d[2].trim();
  const out = { ...TW };
  const resolve = (name, depth = 0) => {
    const v = raw[name]; if (v === undefined || depth > 8) return null;
    const m = v.match(/^var\(--color-([a-z0-9-]+)\)$/);
    if (m) return resolve(m[1], depth + 1) || TW[m[1]] || null;
    return /^#[0-9a-f]{3,6}$/i.test(v) ? v : null;
  };
  for (const k of Object.keys(raw)) { const r = resolve(k); if (r) out[k] = r; }
  return out;
}
function colorOf(name, map) {
  let n = name, alpha = 1; const m = n.match(/^(.*)\/(\d+)$/); if (m) { n = m[1]; alpha = +m[2] / 100; }
  const h = /^\[#[0-9a-fA-F]{3,6}\]$/.test(n) ? n.slice(1, -1) : map[n];
  return h ? { name, rgb: hexToRgb(h), alpha } : null;
}
function variants(attr) {
  const parts = []; let last = 0;
  for (const m of attr.matchAll(/<%[=-]?([\s\S]*?)%>/g)) {
    parts.push([attr.slice(last, m.index)]);
    const strs = [...m[1].matchAll(/'([^']*)'|"([^"]*)"|`([^`]*)`/g)].map((x) => x[1] ?? x[2] ?? x[3]);
    parts.push(m[1].includes('?') && strs.length ? strs : ['']);
    last = m.index + m[0].length;
  }
  parts.push([attr.slice(last)]);
  let combos = [''];
  for (const p of parts) { const next = []; for (const c of combos) for (const a of p) next.push(c + ' ' + a); combos = next.slice(0, 16); }
  return combos;
}
function scanPairs(ref) {
  const css = readAt(ref, 'src/styles/input.css'); const map = parseTheme(css);
  const bodyBg = (css.match(/body\s*\{[^}]*?\bbg-(\[#[0-9a-fA-F]+\]|[a-z0-9-]+)/) || [])[1];
  const page = (bodyBg && colorOf(bodyBg, map)) || colorOf('white', map);
  const muted = colorOf('surface-muted', map) || colorOf('mist', map);
  const found = new Map(); const unresolved = new Set();
  for (const file of listViews(ref)) {
    const src = readAt(ref, file);
    for (const m of src.matchAll(/class="([^"]*)"/g)) {
      const line = src.slice(0, m.index).split('\n').length;
      for (const v of variants(m[1])) {
        let fg = null, bg = null, op = 1; const stops = [];
        for (const t of v.split(/\s+/).filter((x) => x && !x.includes(':'))) {
          let k;
          if ((k = t.match(/^text-(.+)$/))) { const c = colorOf(k[1], map); if (c) fg = c; }
          else if ((k = t.match(/^bg-(.+)$/)) && !/^gradient/.test(k[1])) { const c = colorOf(k[1], map); if (c) bg = c; else if (/^[a-z]+-\d{2,3}$/.test(k[1])) unresolved.add('bg-' + k[1]); }
          else if ((k = t.match(/^(?:from|to)-(.+)$/))) { const c = colorOf(k[1], map); if (c) stops.push(c); }
          else if ((k = t.match(/^opacity-(\d+)$/))) op = +k[1] / 100;
        }
        if (!fg) continue;
        const bgs = stops.length ? stops : bg ? [bg] : null;
        // no background in the same class string: the background is on a parent. Light text (white, sun) can only be sitting on
        // the dark brand surfaces (footer, sidebar, auth panel); dark text sits on the light surfaces.
        const darkParents = ['primary', 'indigo', 'primary-dark', 'indigo-dark', 'secondary', 'lilac'].map((n) => colorOf(n, map)).filter(Boolean);
        const lightParents = [page, colorOf('white', map), muted, ...(file.includes('/admin/') ? [colorOf('[#f4f6fb]', map)] : [])].filter(Boolean);
        const surfaces = bgs || (lum(fg.rgb) >= 0.5 ? darkParents : lightParents);
        let worst = null;
        for (const b of surfaces) {
          const bRgb = b.alpha < 1 ? mix(b.rgb, page.rgb, b.alpha) : b.rgb;
          const fRgb = mix(fg.rgb, bRgb, fg.alpha * op);
          const r = ratio(fRgb, bRgb);
          if (!worst || r < worst.r) worst = { r, b: b.name };
        }
        const label = `text-${fg.name}${op < 1 ? ' (opacity ' + op + ')' : ''} on ${bgs ? bgs.map((b) => 'bg-' + b.name).join(' / ') : 'surface (' + surfaces.map((s) => s.name).join(', ') + ')'}`;
        const e = found.get(label) || { label, r: worst.r, n: 0, where: [] };
        e.n++; if (e.where.length < 3 && !e.where.includes(`${file.replace('views/', '')}:${line}`)) e.where.push(`${file.replace('views/', '')}:${line}`);
        found.set(label, e);
      }
    }
  }
  return { map, page, pairs: [...found.values()].sort((a, b) => a.r - b.r), unresolved };
}

// ---------- component classes defined in input.css (names resolve against the theme at each ref) ----------
function componentRows(ref, scan) {
  const css = readAt(ref, 'src/styles/input.css'); const map = scan.map;
  const focusBlock = (css.match(/:focus-visible\s*\{([^}]*)\}/) || [])[1] || '';
  const outline = [...focusBlock.matchAll(/outline-([a-z0-9-]+)/g)].map((x) => x[1]).find((n) => colorOf(n, map)) || 'coral';
  const rows = [
    ['.btn label', 'text', 'white', 'indigo'], ['.btn hover', 'text', 'white', 'indigo-dark'], ['.btn-volunteer label', 'text', 'white', 'leaf'],
    ['.btn-volunteer hover', 'text', 'white', 'leaf-dark'], ['.btn-coral label', 'text', 'white', 'coral'], ['.btn-coral hover', 'text', 'white', 'coral-dark'],
    ['.btn-plain label', 'text', 'indigo', 'white'], ['.field input text', 'text', 'ink', 'white'], ['.field input border', 'ui', 'gray-300', 'white'],
    ['.hint on page', 'text', 'gray-600', null], ['.hint on white', 'text', 'gray-600', 'white'], ['.hint on muted surface', 'text', 'gray-600', 'mist'],
    ['.error on page', 'text', 'full-tag', null], ['.error on error tint', 'text', 'full-tag', 'full-bg'], ['.tag-amber', 'text', 'amber-tag', 'amber-bg'],
    ['.tag-full', 'text', 'full-tag', 'full-bg'], ['.tag-mine', 'text', 'indigo', 'mist'], ['.tag-leaf', 'text', 'leaf', 'emerald-50'],
    ['.admin-table th on page', 'text', 'gray-500', null], ['.admin-table th on admin bg', 'text', 'gray-500', '[#f4f6fb]'], ['body text on page', 'text', 'ink', null],
    ['focus outline on page', 'ui', outline, null], ['focus outline on white', 'ui', outline, 'white'], ['focus outline on muted surface', 'ui', outline, 'mist'],
    ['focus outline on primary (header, footer, sidebar)', 'ui', outline, 'indigo'], ['.btn[disabled] (inactive controls are exempt)', 'text', 'white', 'gray-400']
  ];
  // the theme switches to the focus-on-dark ring inside dark brand surfaces, so measure that ring there
  const darkRing = css.includes('focus-on-dark') && map['focus-on-dark'] ? 'focus-on-dark' : null;
  return rows.map(([label, kind, fgN0, bgN]) => {
    const fgN = darkRing && label.startsWith('focus outline on primary') ? darkRing : fgN0;
    const fg = colorOf(fgN, map); const bg = bgN ? colorOf(bgN, map) : scan.page;
    if (!fg || !bg) return { label, kind, missing: true };
    return { label, kind, fg: fgN, bg: bgN || 'page', r: ratio(fg.rgb, bg.rgb) };
  });
}

// ---------- palette roles (new semantic tokens, working tree only) ----------
const ROLE_GROUPS = [
  ['Brand', ['primary', 'primary-dark', 'secondary', 'accent', 'accent-dark']],
  ['Status', ['success', 'success-dark', 'success-bg', 'warning-ink', 'warning-bg', 'error', 'error-bg']],
  ['Surfaces', ['background', 'surface', 'surface-muted', 'surface-subtle']],
  ['Text and lines', ['body', 'muted', 'on-primary-muted', 'border-strong']],
  ['Focus', ['focus', 'focus-on-dark']],
  ['Decorative only (never text, never the only cue)', ['sun', 'mint']]
];
const ROLE_PAIRS = [
  ['Body text on background', 'body', 'background', 'text'], ['Body text on white surface', 'body', 'surface', 'text'], ['Body text on muted surface', 'body', 'surface-muted', 'text'],
  ['Muted text on background', 'muted', 'background', 'text'], ['Muted text on white surface', 'muted', 'surface', 'text'], ['Muted text on muted surface', 'muted', 'surface-muted', 'text'],
  ['Muted text on admin background', 'muted', 'surface-subtle', 'text'],
  ['White label on primary', 'white', 'primary', 'text'], ['White label on primary-dark (hover)', 'white', 'primary-dark', 'text'], ['Primary text on white', 'primary', 'surface', 'text'],
  ['White label on accent', 'white', 'accent', 'text'], ['White label on accent-dark (hover)', 'white', 'accent-dark', 'text'], ['Accent text on white', 'accent', 'surface', 'text'],
  ['White label on success', 'white', 'success', 'text'], ['White label on success-dark (hover)', 'white', 'success-dark', 'text'], ['Success text on success tint', 'success', 'success-bg', 'text'],
  ['Warning text on warning tint', 'warning-ink', 'warning-bg', 'text'], ['Error text on white', 'error', 'surface', 'text'], ['Error text on error tint', 'error', 'error-bg', 'text'],
  ['White label on secondary', 'white', 'secondary', 'text'], ['Dark text on sun (decorative fill)', 'body', 'sun', 'text'],
  ['Light text on primary', 'on-primary-muted', 'primary', 'text'], ['Light text on primary-dark', 'on-primary-muted', 'primary-dark', 'text'],
  ['Field border on background', 'border-strong', 'background', 'ui'], ['Field border on white', 'border-strong', 'surface', 'ui'], ['Field border on muted surface', 'border-strong', 'surface-muted', 'ui'],
  ['Focus ring on background', 'focus', 'background', 'ui'], ['Focus ring on white', 'focus', 'surface', 'ui'], ['Focus ring on muted surface', 'focus', 'surface-muted', 'ui'],
  ['Focus ring on admin background', 'focus', 'surface-subtle', 'ui'], ['Focus ring (dark surfaces) on primary', 'focus-on-dark', 'primary', 'ui'], ['Focus ring (dark surfaces) on primary-dark', 'focus-on-dark', 'primary-dark', 'ui'],
  ['Mint graphic on white', 'mint', 'surface', 'ui'], ['Success graphic on white', 'success', 'surface', 'ui'], ['Error graphic on white', 'error', 'surface', 'ui']
];
const CVD_SET = ['primary', 'secondary', 'accent', 'success', 'warning-ink', 'error', 'sun', 'mint'];
const CVD_TEXT = ROLE_PAIRS.filter((p) => ['Body text on background', 'White label on primary', 'White label on accent', 'White label on success', 'Warning text on warning tint', 'Error text on white', 'Error text on error tint', 'Muted text on background', 'Focus ring on background', 'Field border on background', 'Accent text on white', 'Success text on success tint'].includes(p[0]));

// ---------- report ----------
const out = []; const P = (s = '') => out.push(s);
const before = scanPairs(BASE), after = scanPairs(null);
const bad = (s) => s.pairs.filter((p) => p.r < 4.5), mid = (s) => s.pairs.filter((p) => p.r >= 4.5 && p.r < 7);

if (want('pairs')) {
  P('## Every text colour pair the templates use');
  P();
  P(`Baseline = commit \`${BASE}\` (templates and theme). After = working tree. Unique pairs: ${before.pairs.length} before, ${after.pairs.length} after. Judged as normal text (limits in the script header).`);
  P();
  P('| | Before | After |'); P('|---|---|---|');
  P(`| Below 3:1 (fails everything) | ${before.pairs.filter((p) => p.r < 3).length} | ${after.pairs.filter((p) => p.r < 3).length} |`);
  P(`| 3:1 to 4.5:1 (large text only) | ${before.pairs.filter((p) => p.r >= 3 && p.r < 4.5).length} | ${after.pairs.filter((p) => p.r >= 3 && p.r < 4.5).length} |`);
  P(`| 4.5:1 to 7:1 (AA) | ${mid(before).length} | ${mid(after).length} |`);
  P(`| 7:1 and above (AAA) | ${before.pairs.filter((p) => p.r >= 7).length} | ${after.pairs.filter((p) => p.r >= 7).length} |`);
  for (const [title, s] of [['Before: pairs below 4.5:1', before], ['After: pairs below 4.5:1', after]]) {
    P(); P(`### ${title}`); P();
    const rows = bad(s);
    if (!rows.length) { P('None.'); continue; }
    P('| Ratio | Pair | Uses | First places |'); P('|---|---|---|---|');
    for (const p of rows) P(`| ${f2(p.r)} | ${p.label.replace(/\|/g, '/')} | ${p.n} | ${p.where.join(', ')} |`);
  }
  P(); P('### After: pairs between 4.5:1 and 7:1 (AA, short of the AAA target)'); P();
  if (!mid(after).length) P('None.'); else { P('| Ratio | Pair | Uses |'); P('|---|---|---|'); for (const p of mid(after)) P(`| ${f2(p.r)} | ${p.label.replace(/\|/g, '/')} | ${p.n} |`); }
  if (after.unresolved.size || before.unresolved.size) { P(); P(`Unresolved background colours (not measured): ${[...new Set([...before.unresolved, ...after.unresolved])].join(', ')}`); }
  P(); P('## Component classes defined in `src/styles/input.css`'); P();
  P('| Component | Kind | Before | After | After verdict |'); P('|---|---|---|---|---|');
  const cb = componentRows(BASE, before), ca = componentRows(null, after);
  ca.forEach((a, i) => { const b = cb[i]; P(`| ${a.label} | ${a.kind === 'ui' ? 'UI / non-text (3:1)' : 'text'} | ${b.missing ? 'n/a' : f2(b.r)} | ${a.missing ? 'n/a' : f2(a.r)} | ${a.missing ? 'n/a' : a.label.includes('exempt') ? 'exempt (inactive)' : grade(a.r, a.kind)} |`); });
}

if (want('roles')) {
  const map = after.map;
  P(); P('## Palette roles (after)'); P();
  for (const [group, names] of ROLE_GROUPS) {
    P(`**${group}**`); P(); P('| Token | Hex |'); P('|---|---|');
    for (const n of names) P(`| \`${n}\` | ${map[n] ? '`' + map[n] + '`' : 'not defined'} |`);
    P();
  }
  P('## Role pairs (after)'); P(); P('| Pair | Ratio | Verdict |'); P('|---|---|---|');
  for (const [label, a, b, kind] of ROLE_PAIRS) {
    const fg = colorOf(a, map), bg = colorOf(b, map);
    if (!fg || !bg) { P(`| ${label} | n/a | token missing |`); continue; }
    P(`| ${label} | ${f2(ratio(fg.rgb, bg.rgb))} | ${grade(ratio(fg.rgb, bg.rgb), kind)} |`);
  }
}

if (want('cvd')) {
  const map = after.map;
  P(); P('## Colour-vision simulation (after)'); P();
  P('**Contrast of the key pairs as seen with each type of colour blindness** (simulated, full severity). Brightness contrast should stay put; if it drops, the pair relied on hue.'); P();
  P('| Pair | Normal | Protanopia | Deuteranopia | Tritanopia |'); P('|---|---|---|---|---|');
  for (const [label, a, b] of CVD_TEXT) {
    const fg = colorOf(a, map), bg = colorOf(b, map); if (!fg || !bg) continue;
    const cells = Object.values(CVD).map((m) => f2(ratio(simulate(fg.rgb, m), simulate(bg.rgb, m))));
    P(`| ${label} | ${f2(ratio(fg.rgb, bg.rgb))} | ${cells.join(' | ')} |`);
  }
  P(); P('**Can two status or brand colours be told apart by colour alone?** Distance (CIE76 delta E) between each pair. Below about 25 the two can look alike, so they must also differ by icon and word. The design already requires an icon and a word for every status.'); P();
  const sets = [['Normal', null], ...Object.entries(CVD)];
  P(`| Colour pair | ${sets.map((s) => s[0]).join(' | ')} |`); P(`|---|${sets.map(() => '---').join('|')}|`);
  for (let i = 0; i < CVD_SET.length; i++) for (let j = i + 1; j < CVD_SET.length; j++) {
    const A = colorOf(CVD_SET[i], map), B = colorOf(CVD_SET[j], map); if (!A || !B) continue;
    const cells = sets.map(([, m]) => { const d = m ? deltaE(simulate(A.rgb, m), simulate(B.rgb, m)) : deltaE(A.rgb, B.rgb); return (d < 25 ? '**' + d.toFixed(0) + '** (alike)' : d.toFixed(0)); });
    P(`| ${CVD_SET[i]} / ${CVD_SET[j]} | ${cells.join(' | ')} |`);
  }
}

console.log(out.join('\n'));
if (CHECK && after.pairs.some((p) => p.r < 4.5)) { console.error(`CHECK FAILED: ${after.pairs.filter((p) => p.r < 4.5).length} pair(s) below 4.5:1`); process.exitCode = 1; }
