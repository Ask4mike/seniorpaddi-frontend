// Browser-side page checker for the SeniorPadi preview (Phase 3 to 6). Served by the preview server at /__qa.js.
//
// In the browser console on http://localhost:4100/__pages :
//   const s = document.createElement('script'); s.src = '/__qa.js'; document.head.appendChild(s);   // once
//   await qa.run(['/', '/login'], 320, true)       // urls, viewport width in px, run the axe engine too
//   qa.summary(await qa.run(['/', '/login'], 320, false))
//
// For every page it measures, inside a hidden iframe of the given width:
//   minFont          smallest rendered text size (px). The design floor is 16.6
//   smallTargets     links, buttons and fields smaller than 48 x 48 px (inline links inside a sentence are skipped,
//                    a check box or radio is measured by its whole label row)
//   overflowX        how many px the page is wider than the screen (must be 0)
//   looping          elements with an endless animation (must be 0)
//   brokenImages     images that did not load
//   notoLoaded       whether the Noto Sans file is in use
//   axe              violations found by axe-core 4.10 (loaded from cdnjs): WCAG 2.0 / 2.1 / 2.2 A and AA, plus best practice
window.qa = {
  async frame(url, width) {
    const f = document.createElement('iframe');
    f.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:900px;border:0;visibility:hidden`;
    document.body.appendChild(f);
    await new Promise((r) => { f.onload = r; f.src = url; });
    await f.contentWindow.document.fonts.ready;
    await new Promise((r) => setTimeout(r, 250));
    return f;
  },
  metrics(f) {
    const w = f.contentWindow, d = f.contentDocument, out = {};
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = w.getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    let min = 99; const small = {};
    const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode; if (!n.nodeValue.trim()) continue;
      const el = n.parentElement; if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName) || !vis(el) || el.closest('.sr-only')) continue;
      const fs = parseFloat(w.getComputedStyle(el).fontSize); if (fs < min) min = fs;
      if (fs < 16.5) small[n.nodeValue.trim().slice(0, 28)] = +fs.toFixed(1);
    }
    out.minFont = +min.toFixed(1); out.smallText = Object.entries(small).slice(0, 4);
    const bad = [];
    d.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button]').forEach((el) => {
      if (!vis(el) || el.closest('.sr-only') || el.classList.contains('sr-only') || el.classList.contains('skip-link')) return; // the skip link is off-screen until focused
      let t = el; if ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) t = el.closest('label');
      if (t.tagName === 'A' && w.getComputedStyle(t).display === 'inline') { const p = t.parentElement; if (p && p.textContent.trim().length > t.textContent.trim().length + 3) return; }
      const r = t.getBoundingClientRect();
      if (r.height < 47.5 || r.width < 47.5) bad.push(`${t.tagName.toLowerCase()}:${(t.textContent || t.getAttribute('aria-label') || t.name || '').trim().slice(0, 22)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    out.smallTargetCount = bad.length; out.smallTargets = bad.slice(0, 5);
    out.overflowX = d.documentElement.scrollWidth - d.documentElement.clientWidth;
    out.looping = [...d.querySelectorAll('*')].filter((e) => { const cs = w.getComputedStyle(e); return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite'; }).length;
    out.brokenImages = [...d.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')).slice(0, 3);
    out.font = w.getComputedStyle(d.body).fontFamily.split(',')[0].replace(/"/g, '');
    out.notoLoaded = [...w.document.fonts].some((x) => x.family.includes('Noto') && x.status === 'loaded');
    out.h1 = d.querySelectorAll('h1').length;
    return out;
  },
  async axe(f) {
    const d = f.contentDocument, w = f.contentWindow;
    if (!w.axe) await new Promise((res, rej) => { const s = d.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; s.onload = res; s.onerror = () => rej(new Error('axe failed to load')); d.head.appendChild(s); });
    const r = await w.axe.run(d, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes[0].html.replace(/\s+/g, ' ').slice(0, 120) }));
  },
  async run(urls, width, withAxe) {
    const res = {};
    for (const u of urls) {
      try { const f = await this.frame(u, width); const m = this.metrics(f); if (withAxe) m.axe = await this.axe(f); res[u] = m; f.remove(); }
      catch (e) { res[u] = { error: String(e.message || e) }; }
    }
    return res;
  },
  // totals over a whole run, so the original and the revamped site can be compared like for like
  aggregate(res) {
    const a = { pages: 0, smallestText: 99, pagesWithTextUnder16: 0, controlsUnder48: 0, pagesWithControlsUnder48: 0, pagesWithSidewaysScroll: 0, pagesWithLoopingMotion: 0, brokenImages: 0, axePagesWithViolations: 0, axeViolatingElements: 0, axeRules: {} };
    for (const m of Object.values(res)) {
      if (m.error) continue;
      a.pages++; if (m.minFont < a.smallestText) a.smallestText = m.minFont; if (m.minFont < 16.5) a.pagesWithTextUnder16++;
      a.controlsUnder48 += m.smallTargetCount; if (m.smallTargetCount) a.pagesWithControlsUnder48++;
      if (m.overflowX > 0) a.pagesWithSidewaysScroll++; if (m.looping) a.pagesWithLoopingMotion++; a.brokenImages += m.brokenImages.length;
      if (m.axe && m.axe.length) { a.axePagesWithViolations++; for (const v of m.axe) { a.axeViolatingElements += v.n; a.axeRules[v.id] = (a.axeRules[v.id] || 0) + v.n; } }
    }
    return a;
  },
  // one line per page that has a problem (or a line saying all is well)
  summary(res) {
    const lines = [];
    for (const [u, m] of Object.entries(res)) {
      if (m.error) { lines.push(`${u} ERROR ${m.error}`); continue; }
      const flags = [];
      if (m.overflowX > 0) flags.push('OVERFLOW ' + m.overflowX + 'px');
      if (m.smallTargetCount) flags.push('targets ' + JSON.stringify(m.smallTargets));
      if (m.minFont < 16.5) flags.push('font ' + m.minFont + ' ' + JSON.stringify(m.smallText));
      if (m.looping) flags.push('looping ' + m.looping);
      if (m.brokenImages.length) flags.push('broken images ' + m.brokenImages.join(','));
      if (!m.notoLoaded) flags.push('Noto Sans not loaded');
      if (m.axe && m.axe.length) flags.push('axe: ' + m.axe.map((v) => `${v.id}x${v.n}`).join(', '));
      if (flags.length) lines.push(`${u.padEnd(28)} ${flags.join(' ; ')}`);
    }
    return lines.length ? lines.join('\n') : `All ${Object.keys(res).length} pages pass.`;
  }
};
