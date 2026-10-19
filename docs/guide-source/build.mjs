#!/usr/bin/env node
// Builds docs/Senior-Paddi-Beginners-Guide.pdf from the files in docs/guide-source/.
//
//   node docs/guide-source/build.mjs              build the PDF
//   node docs/guide-source/build.mjs --html-only  only write docs/guide-source/out/guide.html (open it in a browser)
//
// What it does, in order:
//   1. joins guide.html with every file in chapters/ (in name order)
//   2. fills each <pre data-file="..." data-find="..." data-lines="N"> with REAL lines from the project,
//      so code in the guide always matches the code. It stops with an error if the text is not found.
//   3. builds the folder-and-file map from `git ls-files` + filemap.json (warns about files with no description)
//   4. colours the code (a small built-in highlighter, no packages)
//   5. prints the page to PDF twice with Microsoft Edge or Google Chrome (already on most computers):
//      the first print tells us which page every heading landed on, the second print puts those page
//      numbers into the table of contents.
// Needs: Node 20+ and Edge or Chrome. Nothing to install.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT_DIR = path.join(HERE, 'out');
const PDF_FILE = path.join(ROOT, 'docs', 'Senior-Paddi-Beginners-Guide.pdf');
const htmlOnly = process.argv.includes('--html-only');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unesc = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const problems = [];

// ---------- 1. join the pieces ----------
let html = fs.readFileSync(path.join(HERE, 'guide.html'), 'utf8');
const chapterFiles = fs.readdirSync(path.join(HERE, 'chapters')).filter((f) => f.endsWith('.html')).sort();
html = html.replace('<!--CHAPTERS-->', () => chapterFiles.map((f) => fs.readFileSync(path.join(HERE, 'chapters', f), 'utf8')).join('\n'));
html = html.replace(/<!--TODAY-->/g, () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));

// ---------- 2. real snippets ----------
// <pre data-file="src/app.js" data-find="app.set('view engine'" data-lines="3"></pre>
// data-find is any text on the first line you want; data-nth picks a later match.
html = html.replace(/<pre([^>]*?)data-file="([^"]+)"([^>]*)><\/pre>/g, (all, a, file, b) => {
  const attrs = a + b;
  const find = unesc((attrs.match(/data-find="([^"]*)"/) || [])[1] || '');
  const count = Number((attrs.match(/data-lines="(\d+)"/) || [])[1] || 1);
  const occurrence = Number((attrs.match(/data-nth="(\d+)"/) || [])[1] || 1);
  const lang = (attrs.match(/data-lang="([^"]+)"/) || [])[1] || (file.endsWith('.ejs') ? 'ejs' : file.endsWith('.css') ? 'css' : file.endsWith('.json') ? 'json' : file.endsWith('.bat') ? 'shell' : 'js');
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) { problems.push('Missing file in a snippet: ' + file); return all; }
  const lines = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n').split('\n');
  let seen = 0;
  const start = lines.findIndex((l) => l.includes(find) && ++seen === occurrence);
  if (start < 0) { problems.push('Text not found in ' + file + ': ' + find); return all; }
  const picked = lines.slice(start, start + count);
  // remove the shared indent so snippets start at the left edge
  const indent = Math.min(...picked.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  const body = picked.map((l) => l.slice(indent)).join('\n');
  const where = esc(file) + '<span class="loc">, line ' + (start + 1) + (count > 1 ? '–' + (start + count) : '') + '</span>';
  return '<div class="code-file">' + where + '</div><pre class="code" data-lang="' + lang + '">' + esc(body) + '</pre>';
});

// ---------- 3. the file map ----------
const descriptions = JSON.parse(fs.readFileSync(path.join(HERE, 'filemap.json'), 'utf8'));
let tracked = [];
try {
  tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean)
    .filter((f) => !f.startsWith('docs/guide-source/') && f !== 'docs/Senior-Paddi-Beginners-Guide.pdf');
} catch (err) { problems.push('git ls-files failed, so the file map may be incomplete'); }
// entries in brackets, like "(.env)", are files that are deliberately NOT in git but matter to a beginner
for (const extra of Object.keys(descriptions)) if (extra.startsWith('(')) tracked.push(extra);

const groupKey = (file) => Object.keys(descriptions).find((k) => k.endsWith('*') && file.startsWith(k.slice(0, -1)));

html = html.replace(/<div data-filemap="([^"]+)"><\/div>/g, (all, groupsAttr) => {
  const groups = JSON.parse(unesc(groupsAttr)); // [[title, regex], ...]
  const used = new Set();
  let out = '';
  for (const [title, pattern] of groups) {
    const re = new RegExp(pattern);
    const files = tracked.filter((f) => !used.has(f) && re.test(f));
    if (!files.length) continue;
    out += '<h4 class="map-group">' + esc(title) + '</h4><table class="filemap"><tbody>';
    const groupsShown = new Set();
    for (const f of files) {
      used.add(f);
      const key = descriptions[f] ? null : groupKey(f);
      if (key) {
        if (groupsShown.has(key)) continue;
        groupsShown.add(key);
        const n = tracked.filter((t) => t.startsWith(key.slice(0, -1))).length;
        out += '<tr><td class="fm-path">' + esc(key) + ' <span class="loc">(' + n + ' files)</span></td><td>' + descriptions[key] + '</td></tr>';
        continue;
      }
      if (!descriptions[f]) problems.push('No description for ' + f + ' (add it to filemap.json)');
      out += '<tr><td class="fm-path">' + esc(f) + '</td><td>' + (descriptions[f] || '(no description yet)') + '</td></tr>';
    }
    out += '</tbody></table>';
  }
  const left = tracked.filter((f) => !used.has(f));
  if (left.length) problems.push('Files not placed in any file-map group: ' + left.join(', '));
  return out;
});
for (const key of Object.keys(descriptions)) {
  if (!key.endsWith('*') && !key.startsWith('(') && !tracked.includes(key)) problems.push('filemap.json describes a file that is not in the project: ' + key);
}

// ---------- 4. highlight code ----------
const KEYWORDS = new Set(('const let var function return if else for of in while async await new require module exports ' +
  'try catch throw import from export default class extends this true false null undefined typeof').split(' '));

function highlightJs(code) {
  // code is already HTML-escaped. Tokenise comments, strings, numbers, keywords.
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;
  return code.replace(re, (m, com, str, num, word) => {
    if (com) return '<span class="tk-c">' + com + '</span>';
    if (str) return '<span class="tk-s">' + str + '</span>';
    if (num) return '<span class="tk-n">' + num + '</span>';
    if (word && KEYWORDS.has(word)) return '<span class="tk-k">' + word + '</span>';
    return m;
  });
}

function highlightHtml(text) {
  return text.replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="tk-tag">$2</span>')
    .replace(/\s([a-zA-Z-:]+)=("[^"\n]*")/g, ' <span class="tk-attr">$1</span>=<span class="tk-s">$2</span>');
}

function highlightEjs(code) {
  // EJS tags (escaped as &lt;% ... %&gt;) get their own colour; JS inside is highlighted; HTML tags too.
  const parts = code.split(/(&lt;%[#=\-_]?[\s\S]*?[\-_]?%&gt;)/);
  return parts.map((p) => {
    const m = p.match(/^(&lt;%[#=\-_]?)([\s\S]*?)([\-_]?%&gt;)$/);
    if (m) {
      if (m[1] === '&lt;%#') return '<span class="tk-c">' + p + '</span>';
      return '<span class="tk-ejs">' + m[1] + '</span>' + highlightJs(m[2]) + '<span class="tk-ejs">' + m[3] + '</span>';
    }
    return highlightHtml(p);
  }).join('');
}

function highlightCss(code) {
  return code.replace(/(\/\*[\s\S]*?\*\/)|(@[a-z-]+)|(--[a-z0-9-]+)|(#[0-9a-fA-F]{3,8}\b)/g, (m, c, at, v, hex) =>
    c ? '<span class="tk-c">' + c + '</span>' : at ? '<span class="tk-k">' + at + '</span>' : v ? '<span class="tk-attr">' + v + '</span>' : '<span class="tk-n">' + hex + '</span>');
}

function highlightShell(code) {
  return code.split('\n').map((l) => {
    if (/^\s*(#|REM |::)/.test(l)) return '<span class="tk-c">' + l + '</span>';
    return l.replace(/^(\s*)(npm|node|git|cd|npx|psql|copy|cp|del|rm|where|call|if|echo|set)\b/, '$1<span class="tk-k">$2</span>')
      .replace(/(\s#\s[^\n]*)$/, '<span class="tk-c">$1</span>');
  }).join('\n');
}

html = html.replace(/<pre class="code" data-lang="([a-z]+)">([\s\S]*?)<\/pre>/g, (all, lang, body) => {
  const fn = { js: highlightJs, ejs: highlightEjs, html: highlightEjs, css: highlightCss, shell: highlightShell, json: highlightJs }[lang];
  return '<pre class="code" data-lang="' + lang + '">' + (fn ? fn(body) : body) + '</pre>';
});

// ---------- 5. headings, ids and the table of contents ----------
const headings = [];
const usedIds = new Set();
html = html.replace(/<(h[1-3])(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (all, tag, attrs = '', inner) => {
  let id = (attrs.match(/id="([^"]+)"/) || [])[1];
  if (!id) {
    const base = slug(inner) || 'section';
    id = base;
    let n = 2;
    while (usedIds.has(id)) id = base + '-' + n++;
    attrs += ' id="' + id + '"';
  }
  usedIds.add(id);
  if (!/data-no-toc/.test(attrs)) headings.push({ level: Number(tag[1]), id, text: inner.replace(/<[^>]+>/g, '').trim() });
  return '<' + tag + attrs + '>' + inner + '</' + tag + '>';
});

function tocHtml(pages) {
  let out = '<ol class="toc">';
  for (const h of headings.filter((x) => x.level <= 2)) {
    const page = pages[h.id] || '';
    out += '<li class="toc-l' + h.level + '"><a href="#' + h.id + '"><span class="toc-text">' + esc(unesc(h.text)) +
      '</span><span class="toc-dots"></span><span class="toc-page">' + page + '</span></a></li>';
  }
  return out + '</ol>';
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_HTML = path.join(OUT_DIR, 'guide.html');
// pictures are referenced relative to guide-source/, and the built page sits one folder down
const withToc = (pages) => html.replace('<!--TOC-->', () => tocHtml(pages)).replace(/(src|href)="assets\//g, '$1="../assets/');
// "000" keeps the contents the same width in both passes, so nothing moves when the real numbers go in
const placeholder = Object.fromEntries(headings.map((h) => [h.id, '000']));
fs.writeFileSync(OUT_HTML, withToc(placeholder));

if (problems.length) {
  console.log('\nThings to fix in the guide source:');
  for (const p of problems) console.log('  - ' + p);
  if (problems.some((p) => p.startsWith('Text not found') || p.startsWith('Missing file'))) {
    console.log('\nStopped: a code snippet no longer matches the project. Update the chapter, then build again.');
    process.exit(1);
  }
}
console.log('Wrote ' + path.relative(ROOT, OUT_HTML) + ' (' + headings.length + ' headings)');
if (htmlOnly) process.exit(0);

// ---------- 6. print with Edge / Chrome (DevTools protocol, no packages) ----------
function findBrowser() {
  const candidates = [
    process.env.GUIDE_BROWSER,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'
  ].filter(Boolean);
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) throw new Error('Could not find Edge or Chrome. Set GUIDE_BROWSER to the browser program path.');
  return found;
}

async function withBrowser(fn) {
  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-guide-'));
  const proc = spawn(findBrowser(), ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
  try {
    let wsUrl;
    for (let i = 0; i < 75 && !wsUrl; i++) {
      await new Promise((r) => setTimeout(r, 200));
      try {
        const list = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
        const page = list.find((t) => t.type === 'page');
        if (page) wsUrl = page.webSocketDebuggerUrl;
      } catch { /* not ready yet */ }
    }
    if (!wsUrl) throw new Error('The browser did not start.');
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let nextId = 1;
    const waiting = new Map();
    const listeners = [];
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id && waiting.has(data.id)) {
        const { resolve, reject } = waiting.get(data.id);
        waiting.delete(data.id);
        data.error ? reject(new Error(data.error.message)) : resolve(data.result);
      } else if (data.method) listeners.forEach((l) => l(data));
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = nextId++;
      waiting.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const once = (method) => new Promise((resolve) => listeners.push((d) => d.method === method && resolve(d.params)));
    const result = await fn({ send, once });
    ws.close();
    return result;
  } finally {
    proc.kill();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* still locked */ } }, 1500);
  }
}

async function printPdf(htmlFile) {
  return withBrowser(async ({ send, once }) => {
    await send('Page.enable');
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url: pathToFileURL(htmlFile).href });
    await loaded;
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
    const { data } = await send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      generateDocumentOutline: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-family:Segoe UI,Arial,sans-serif;font-size:8.5px;color:#6b6585;padding:0 16mm;display:flex;justify-content:space-between">' +
        '<span>SeniorPadi: Beginner\'s Project Guide</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'
    });
    return Buffer.from(data, 'base64');
  });
}

// Reads the PDF's bookmarks (Edge/Chrome make one per heading) and returns their page numbers in reading order.
function outlinePages(pdf) {
  const text = pdf.toString('latin1');
  const objects = new Map();
  const objRe = /(\d+) 0 obj\s*([\s\S]*?)endobj/g;
  let m;
  while ((m = objRe.exec(text))) objects.set(Number(m[1]), m[2]);
  const catalog = [...objects.values()].find((o) => /\/Type\s*\/Catalog/.test(o));
  if (!catalog) throw new Error('Could not read the PDF structure.');
  const pageOrder = [];
  (function walk(id) {
    const o = objects.get(id) || '';
    if (/\/Type\s*\/Pages/.test(o)) {
      const kids = (o.match(/\/Kids\s*\[([^\]]*)\]/) || [])[1] || '';
      for (const k of kids.matchAll(/(\d+) 0 R/g)) walk(Number(k[1]));
    } else pageOrder.push(id);
  })(Number(catalog.match(/\/Pages\s+(\d+) 0 R/)[1]));
  const pageOf = new Map(pageOrder.map((id, i) => [id, i + 1]));
  const items = [];
  const outlinesId = Number((catalog.match(/\/Outlines\s+(\d+) 0 R/) || [])[1] || 0);
  (function walk(id) {
    while (id) {
      const o = objects.get(id) || '';
      const dest = o.match(/\/Dest\s*\[\s*(\d+) 0 R/);
      items.push(dest ? pageOf.get(Number(dest[1])) : null);
      const first = o.match(/\/First\s+(\d+) 0 R/);
      if (first) walk(Number(first[1]));
      const next = o.match(/\/Next\s+(\d+) 0 R/);
      id = next ? Number(next[1]) : 0;
    }
  })(Number(((objects.get(outlinesId) || '').match(/\/First\s+(\d+) 0 R/) || [])[1] || 0));
  return { items, pages: pageOrder.length };
}

(async () => {
  console.log('Printing (first pass, to find page numbers)...');
  const first = await printPdf(OUT_HTML);
  const { items, pages } = outlinePages(first);
  // bookmarks come from every h1..h6 in page order, so line them up with the headings in the built page
  const built = fs.readFileSync(OUT_HTML, 'utf8');
  const order = [...built.matchAll(/<h([1-6])(\s[^>]*)?>/g)].map((x) => ((x[2] || '').match(/id="([^"]+)"/) || [])[1] || null);
  if (items.length !== order.length) {
    console.log('  ! The PDF has ' + items.length + ' bookmarks for ' + order.length + ' headings, so page numbers may be off.');
  }
  const pageMap = {};
  order.forEach((id, i) => { if (id && items[i]) pageMap[id] = items[i]; });
  fs.writeFileSync(OUT_HTML, withToc(pageMap));
  console.log('Printing (second pass, with page numbers in the contents)...');
  const second = await printPdf(OUT_HTML);
  fs.writeFileSync(PDF_FILE, second);
  const check = outlinePages(second);
  console.log('Wrote ' + path.relative(ROOT, PDF_FILE) + ': ' + check.pages + ' pages, ' + (second.length / 1024 / 1024).toFixed(1) + ' MB');
  if (check.pages !== pages) console.log('  ! The page count changed between passes (' + pages + ' -> ' + check.pages + '). Build again.');
})().catch((err) => { console.error('\nCould not build the PDF: ' + err.message); process.exit(1); });
