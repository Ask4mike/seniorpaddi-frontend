#!/usr/bin/env node
// SeniorPadi content-freeze checker (UI revamp). No dependencies, Node 20+. Run from the project root.
//
//   node docs/ui-revamp/tools/content-freeze.mjs                 compare every template with the baseline commit
//   node docs/ui-revamp/tools/content-freeze.mjs --file views/home.ejs    one template
//   node docs/ui-revamp/tools/content-freeze.mjs --base <git-ref>         another baseline (default f82a8da)
//   node docs/ui-revamp/tools/content-freeze.mjs --additions               also list things that were ADDED (always allowed)
//
// The question it answers: "did the revamp change what the page says or does?"
//
// COMPARED (must be identical, in order):
//   - every piece of visible text
//   - every EJS tag (<% ... %>), i.e. all the template logic and every t('...') call. String literals that are only
//     CSS class lists are blanked out first, so restyling inside EJS conditionals does not count
//   - the structure that carries meaning: a, button, form, input, label, select, option, textarea, h1-h6, p, ul, ol, li,
//     table parts, img, nav, br, strong/b, em, fieldset, legend, details, summary, video, source, track, link, meta,
//     script (inline script text too), title, html, head, body, caption, dl, dt, dd
//   - the attributes that carry meaning: href, action, method, name, for, value, type, src, alt, placeholder, autocomplete,
//     required, checked, selected, disabled, readonly, multiple, accept, min, max, maxlength, minlength, pattern, inputmode,
//     enctype, target, rel, lang, hreflang, title, hidden, rows, cols, controls, preload, playsinline, content, charset
// MUST NOT DISAPPEAR (but more may be added): id, aria-*, role, tabindex, and every data-* hook except data-reveal
// IGNORED: class, style, width, height, loading, decoding, draggable, data-reveal*, plain div/span/section/article/aside/
//          header/footer/main/figure wrappers, and <i> icons.
// ALSO: every existing key in locales/*.json must still exist with the identical value (new keys are allowed).
//
// A reviewed, intentional difference can be listed in docs/ui-revamp/tools/freeze-approved.json:
//   { "views/partials/header.ejs": ["- <exact diff line printed by this tool>", "+ <...>"] }
// Anything not approved fails the run (exit code 1).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('--base', 'f82a8da');
const ONE = opt('--file', null);
const SHOW_ADD = args.includes('--additions');
const APPROVED_FILE = path.join(ROOT, 'docs/ui-revamp/tools/freeze-approved.json');
// a missing or empty ledger just means "nothing approved yet" (--ledger itself ignores the ledger so it can rewrite it)
const approved = (() => { if (args.includes('--ledger') || !fs.existsSync(APPROVED_FILE)) return {}; try { return JSON.parse(fs.readFileSync(APPROVED_FILE, 'utf8') || '{}'); } catch { return {}; } })();

const git = (cmd) => execSync('git ' + cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const baseText = (f) => { try { return git(`show ${BASE}:${f}`); } catch { return null; } };
const nowText = (f) => { const p = path.join(ROOT, f); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };

const STRICT = new Set('href action method name for value type src alt placeholder autocomplete required checked selected disabled readonly multiple accept min max maxlength minlength pattern inputmode enctype target rel lang hreflang title hidden rows cols controls preload playsinline content charset'.split(' '));
const KEEP_TAGS = new Set('a button form input label select option textarea h1 h2 h3 h4 h5 h6 p ul ol li table thead tbody tfoot tr th td img nav br strong em fieldset legend details summary video source track link meta script title html head body caption dl dt dd canvas iframe'.split(' '));
const TAG_ALIAS = { b: 'strong', i: null };
// aria-hidden is only a marker on decorative icons, so dropping it together with an icon is not a lost hook
const SUBSET_ATTR = (a) => a === 'id' || a === 'role' || a === 'tabindex' || (a.startsWith('aria-') && a !== 'aria-hidden') || (a.startsWith('data-') && !a.startsWith('data-reveal'));

// ---- EJS normalising: blank out string literals that are only CSS classes ----
const UTIL = /^(?:[a-z0-9-]+:)*!?-?[a-z][a-z0-9]*(?:-[a-z0-9./\[\]#%()_]+)*(?:\/[0-9]+)?$/;
const PREFIX = /^(?:[a-z0-9-]+:)*!?-?(?:bg|text|border|ring|rounded|shadow|p[xytblr]?|m[xytblr]?|w|h|min|max|flex|grid|gap|font|items|justify|hidden|block|inline|absolute|relative|fixed|sticky|opacity|outline|underline|no-underline|truncate|sr-only|space|divide|object|aspect|overflow|z|top|left|right|bottom|inset|col|row|self|place|leading|tracking|uppercase|transition|duration|ease|animate|hover|focus|group|peer|fa-[a-z-]+)(?:$|-)/;
const blankClasses = (code) => code.replace(/'([^'\\\n]*)'|"([^"\\\n]*)"/g, (m, a, b) => {
  const s = (a ?? b ?? '').trim(); const w = s.split(/\s+/).filter(Boolean);
  if (!w.length || !w.every((x) => UTIL.test(x))) return m;
  return w.length >= 2 || PREFIX.test(w[0]) ? "'~'" : m;
});
const ejsToken = (raw) => 'E: ' + blankClasses(raw.replace(/\s+/g, ' ').trim());

// ---- tokenizer ----
function tokenize(src) {
  const toks = []; const subset = []; let i = 0; const n = src.length; let buf = '';
  const flush = () => { const t = buf.replace(/\s+/g, ' ').trim(); if (t) toks.push('T: ' + t); buf = ''; };
  const skipEjs = (from) => { const e = src.indexOf('%>', from); return e < 0 ? n : e + 2; };
  while (i < n) {
    if (src.startsWith('<%#', i)) { i = skipEjs(i); continue; }
    if (src.startsWith('<%', i)) { flush(); const e = skipEjs(i); toks.push(ejsToken(src.slice(i, e))); i = e; continue; }
    if (src.startsWith('<!--', i)) { flush(); const e = src.indexOf('-->', i); i = e < 0 ? n : e + 3; continue; }
    if (src[i] === '<' && /[a-zA-Z/!]/.test(src[i + 1] || '')) {
      flush();
      if (src[i + 1] === '!') { const e = src.indexOf('>', i); toks.push('<!doctype>'); i = e < 0 ? n : e + 1; continue; }
      const closing = src[i + 1] === '/'; let j = i + (closing ? 2 : 1);
      let name = ''; while (j < n && /[A-Za-z0-9-]/.test(src[j])) name += src[j++]; name = name.toLowerCase();
      const attrs = []; const inTagEjs = [];
      while (j < n && src[j] !== '>') {
        if (/\s|\//.test(src[j])) { j++; continue; }
        if (src.startsWith('<%', j)) { const e = skipEjs(j); inTagEjs.push(ejsToken(src.slice(j, e))); j = e; continue; }
        let an = ''; while (j < n && !/[\s=>/]/.test(src[j]) && !src.startsWith('<%', j)) an += src[j++]; an = an.toLowerCase();
        let val = null;
        if (src[j] === '=') {
          j++;
          if (src[j] === '"' || src[j] === "'") {
            const q = src[j++]; let v = '';
            while (j < n && src[j] !== q) { if (src.startsWith('<%', j)) { const e = skipEjs(j); v += src.slice(j, e); j = e; } else v += src[j++]; }
            j++; val = v;
          } else { let v = ''; while (j < n && !/[\s>]/.test(src[j])) v += src[j++]; val = v; }
        }
        if (an) attrs.push([an, val === null ? '' : val.replace(/\s+/g, ' ').trim()]);
      }
      j++; // past '>'
      const tag = name in TAG_ALIAS ? TAG_ALIAS[name] : name;
      if (tag && KEEP_TAGS.has(tag)) {
        if (closing) toks.push(`</${tag}>`);
        else {
          const strict = attrs.filter(([a]) => STRICT.has(a)).map(([a, v]) => `${a}=${blankClasses(JSON.stringify(v)).replace(/^"|"$/g, '')}`).sort();
          toks.push(`<${tag}${strict.length ? ' ' + strict.join(' ') : ''}>`);
          for (const e of inTagEjs) toks.push(e);
        }
      }
      if (!closing) for (const [a, v] of attrs) if (SUBSET_ATTR(a)) subset.push(`${tag || name} ${a}=${v}`);
      if (!closing && (name === 'script' || name === 'style')) {
        const end = src.toLowerCase().indexOf('</' + name, j); const body = src.slice(j, end < 0 ? n : end).replace(/\s+/g, ' ').trim();
        if (body) toks.push(`${name === 'script' ? 'S' : 'CSS'}: ${body}`);
        j = end < 0 ? n : end;
      }
      i = j; continue;
    }
    buf += src[i]; i++;
  }
  flush();
  const merged = [];
  for (const t of toks) { const last = merged[merged.length - 1]; if (t.startsWith('T: ') && last && last.startsWith('T: ')) merged[merged.length - 1] = last + ' ' + t.slice(3); else merged.push(t); }
  return { toks: merged, subset };
}

// ---- diff (LCS) ----
function diff(a, b) {
  const n = a.length, m = b.length; const w = m + 1; const dp = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i * w + j] = a[i] === b[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
  const out = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { i++; j++; } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) out.push('- ' + a[i++]); else out.push('+ ' + b[j++]); }
  while (i < n) out.push('- ' + a[i++]); while (j < m) out.push('+ ' + b[j++]);
  return out;
}
const multiset = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return m; };

// ---- templates ----
const listViews = () => git(`ls-tree -r --name-only ${BASE} views`).split('\n').filter((f) => f.endsWith('.ejs'));
const nowViews = () => { const out = []; const walk = (d) => { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const p = d + '/' + e.name; e.isDirectory() ? walk(p) : p.endsWith('.ejs') && out.push(p); } }; walk('views'); return out; };
const files = ONE ? [ONE] : [...new Set([...listViews(), ...nowViews()])].sort();

let failures = 0, changed = 0, added = 0; const report = []; const ledger = {};
// --ledger prints the differences as JSON, to be reviewed by a person and saved as freeze-approved.json
if (args.includes('--ledger')) { process.on('exit', () => {}); }
for (const f of files) {
  const A = baseText(f), B = nowText(f);
  if (A === null) { added++; report.push(`NEW FILE  ${f} (not in baseline, review by hand)`); continue; }
  if (B === null) { failures++; report.push(`MISSING   ${f} (deleted since baseline)`); continue; }
  const ta = tokenize(A), tb = tokenize(B);
  const d = diff(ta.toks, tb.toks).filter((l) => !(approved[f] || []).includes(l));
  const sb = multiset(tb.subset); const lost = [];
  for (const [k, c] of multiset(ta.subset)) if ((sb.get(k) || 0) < c) lost.push('- A: ' + k + (c > 1 ? ` (x${c - (sb.get(k) || 0)} missing)` : ''));
  const lostApproved = lost.filter((l) => !(approved[f] || []).includes(l));
  const problems = [...d, ...lostApproved];
  if (problems.length) { failures++; changed++; report.push(`CHANGED   ${f}`); for (const l of problems) report.push('    ' + l); ledger[f] = problems; }
  if (SHOW_ADD) { const gained = []; const sa = multiset(ta.subset); for (const [k, c] of sb) if ((sa.get(k) || 0) < c) gained.push('  + A: ' + k); if (gained.length) { report.push(`additions ${f}`); gained.forEach((g) => report.push('  ' + g)); } }
}

// ---- locales: every existing key must survive unchanged ----
const flat = (o, p = '', out = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? p + '.' + k : k; v && typeof v === 'object' ? flat(v, key, out) : (out[key] = v); } return out; };
let localeAdded = 0;
for (const f of ['locales/en.json', 'locales/yo.json']) {
  const a = baseText(f), b = nowText(f); if (a === null || b === null) continue;
  const fa = flat(JSON.parse(a)), fb = flat(JSON.parse(b));
  for (const [k, v] of Object.entries(fa)) if (!(k in fb)) { failures++; report.push(`LOCALE    ${f}: key removed: ${k}`); } else if (fb[k] !== v) { failures++; report.push(`LOCALE    ${f}: value changed: ${k}`); }
  localeAdded += Object.keys(fb).filter((k) => !(k in fa)).length;
}

if (args.includes('--ledger')) { console.log(JSON.stringify(ledger, null, 2)); process.exit(0); }
console.log(`Content freeze against ${BASE}: ${files.length} templates checked, ${changed} changed, ${added} new files, locale keys added: ${localeAdded}`);
if (report.length) console.log(report.join('\n')); else console.log('No differences in text, template logic, links, forms, field names or script hooks.');
if (failures) { console.error(`\nFAILED: ${failures} problem(s). Fix them, or review and list intentional ones in docs/ui-revamp/tools/freeze-approved.json.`); process.exitCode = 1; } else console.log('\nPASS');
