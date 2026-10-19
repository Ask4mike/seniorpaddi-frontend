// Run from the project root: node docs/ui-revamp/tools/make-illustrations.mjs public/images/illustrations
// Writes SeniorPadi's original flat illustrations (no text inside, palette colours only) into public/images/illustrations/.
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

const SKIN_A = '#6b3e26';
const SKIN_B = '#8a5236';
const INK = '#1f1b2e';
const face = (x, y, r = 1.6, w = 4.5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + w * 2}" cy="${y}" r="${r}" fill="${INK}"/>` +
  `<path d="M${x} ${y + 5}q${w} ${w * 0.8} ${w * 2} 0" stroke="${INK}" stroke-width="${r + 0.2}" fill="none" stroke-linecap="round"/>`;
const wrap = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" aria-hidden="true" focusable="false"><!-- SeniorPadi original illustration: ${title}. No text inside. -->${body}</svg>\n`;

const files = {
  'elders-exercise.svg': wrap('two elders stretching outdoors', `
<path d="M14 142c0-14 10-22 20-22s14 10 14 22z" fill="#2f9e7e" opacity=".35"/><path d="M128 142c0-12 8-20 16-20s10 8 10 20z" fill="#2f9e7e" opacity=".35"/>
<ellipse cx="80" cy="146" rx="62" ry="6" fill="#4a3fb0" opacity=".12"/>
<path d="M38 72L24 44M66 72l12-28" stroke="${SKIN_A}" stroke-width="7" stroke-linecap="round"/>
<path d="M36 68h34l8 52H28z" fill="#1f7a5f"/><path d="M40 84h26M38 98h30" stroke="#ddf3ea" stroke-width="3" stroke-linecap="round" opacity=".7"/>
<path d="M36 120h14l-2 22H38zM56 120h14l-2 22H58z" fill="#3b3290"/>
<circle cx="52" cy="54" r="13" fill="${SKIN_A}"/><path d="M38 48c2-12 26-14 30-2 4 2 6 6 2 8-8-6-22-6-32-6z" fill="#f5b82e"/><path d="M60 40c8-4 14 0 12 6l-6 2z" fill="#e5a417"/>
${face(47.5, 56)}
<path d="M100 76L88 50M126 76l12-26" stroke="${SKIN_B}" stroke-width="7" stroke-linecap="round"/>
<path d="M98 72h30l6 48H92z" fill="#c2410c"/><path d="M113 74v46" stroke="#fde8dd" stroke-width="3" opacity=".6"/>
<path d="M96 120h14l-1 22H98zM116 120h14l-2 22h-11z" fill="${INK}"/>
<circle cx="113" cy="56" r="13" fill="${SKIN_B}"/><path d="M100 50c0-10 26-12 27-1l-3 3H101z" fill="#3b3290"/><path d="M104 64q9 9 18 0v4q-9 7-18 0z" fill="#d9d6e0"/>
${face(108.5, 57, 1.6, 4)}`),

  'elders-chat.svg': wrap('two elders chatting on a bench', `
<rect x="62" y="12" width="44" height="28" rx="12" fill="#fff" stroke="#4a3fb0" stroke-width="3"/><path d="M76 39l-6 10 12-9" fill="#fff" stroke="#4a3fb0" stroke-width="3" stroke-linejoin="round"/>
<circle cx="74" cy="26" r="3" fill="#4a3fb0"/><circle cx="84" cy="26" r="3" fill="#4a3fb0"/><circle cx="94" cy="26" r="3" fill="#4a3fb0"/>
<rect x="16" y="112" width="128" height="10" rx="5" fill="${SKIN_B}"/><path d="M26 122v20M134 122v20" stroke="${SKIN_A}" stroke-width="6" stroke-linecap="round"/>
<path d="M30 78h34l4 40H26z" fill="#5b51c9"/><path d="M60 90l14 8" stroke="${SKIN_A}" stroke-width="7" stroke-linecap="round"/>
<circle cx="47" cy="62" r="13" fill="${SKIN_A}"/><path d="M32 56c2-14 28-14 30-2 3 2 4 6 1 8-8-6-21-6-31-6z" fill="#c2410c"/><path d="M54 46c8-3 12 2 10 7l-5 1z" fill="#a8380a"/>
${face(46.5, 64)}
<path d="M96 78h36l6 40H90z" fill="#1f7a5f"/><path d="M100 90l-12 8" stroke="${SKIN_B}" stroke-width="7" stroke-linecap="round"/>
<circle cx="114" cy="62" r="13" fill="${SKIN_B}"/><path d="M101 57c0-11 26-12 27-1l-3 2h-23z" fill="#e5a417"/><path d="M102 60c-2 4-1 8 1 9M126 60c2 4 1 8-1 9" stroke="#d9d6e0" stroke-width="3" fill="none" stroke-linecap="round"/>
${face(107, 64, 1.6, 4)}`),

  'phone-call.svg': wrap('an elder woman on a phone call', `
<path d="M118 30a24 24 0 0 1 18 18M118 18a36 36 0 0 1 30 30" stroke="#4a3fb0" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M44 94h60l10 52H34z" fill="#4a3fb0"/><path d="M58 94l16 18 16-18" stroke="#e0dcf7" stroke-width="3" fill="none"/>
<circle cx="74" cy="70" r="20" fill="${SKIN_A}"/>
<path d="M50 62c2-22 46-24 50-4 4 3 5 9 1 12-12-9-36-9-51-8z" fill="#f5b82e"/><path d="M84 42c12-6 22 0 18 10l-9 2z" fill="#e5a417"/>
${face(66, 72, 2.2, 6.5)}
<path d="M104 112l-8-22" stroke="${SKIN_A}" stroke-width="9" stroke-linecap="round"/>
<g transform="rotate(12 100 75)"><rect x="92" y="60" width="16" height="30" rx="4" fill="${INK}"/><rect x="95" y="64" width="10" height="18" rx="2" fill="#2f9e7e"/></g>`),

  'shield-id.svg': wrap('a shield with an ID card', `
<circle cx="80" cy="80" r="70" fill="#f4f2fc"/>
<path d="M80 20l46 16v36c0 30-20 52-46 64-26-12-46-34-46-64V36z" fill="#4a3fb0"/>
<path d="M80 32l34 12v28c0 23-15 40-34 50-19-10-34-27-34-50V44z" fill="#5b51c9"/>
<rect x="44" y="84" width="72" height="48" rx="8" fill="#fff" stroke="#3b3290" stroke-width="3"/>
<circle cx="64" cy="102" r="9" fill="${SKIN_A}"/><path d="M53 124c2-9 20-9 22 0z" fill="#2f9e7e"/>
<rect x="80" y="98" width="26" height="5" rx="2.5" fill="#e0dcf7"/><rect x="80" y="110" width="20" height="5" rx="2.5" fill="#e0dcf7"/>
<circle cx="116" cy="84" r="13" fill="#f5b82e"/><path d="M110 84l4 4 8-8" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),

  'success-check.svg': wrap('a calm success mark with leaves', `
<circle cx="80" cy="80" r="70" fill="#ddf3ea"/>
<path d="M30 114c10-22 30-24 36-18-8 14-24 22-36 18z" fill="#2f9e7e"/><path d="M130 114c-10-22-30-24-36-18 8 14 24 22 36 18z" fill="#2f9e7e"/>
<circle cx="80" cy="74" r="36" fill="#1f7a5f"/><path d="M62 75l12 12 24-26" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="36" cy="44" r="5" fill="#f5b82e"/><circle cx="126" cy="38" r="4" fill="#5b51c9"/><circle cx="122" cy="58" r="3" fill="#f5b82e"/>`),

  'welcome.svg': wrap('an elder man in fila and agbada waving hello', `
<circle cx="80" cy="84" r="66" fill="#f4f2fc"/>
<path d="M40 150c2-34 16-52 40-52s38 18 40 52z" fill="#1f7a5f"/><path d="M62 104l18 24 18-24M80 128v20" stroke="#ddf3ea" stroke-width="3" fill="none"/>
<path d="M114 114l12-40" stroke="${SKIN_B}" stroke-width="10" stroke-linecap="round"/><circle cx="127" cy="68" r="8" fill="${SKIN_B}"/>
<circle cx="80" cy="72" r="22" fill="${SKIN_B}"/>
<path d="M57 64c0-22 46-24 46-2l-4 4H60z" fill="#4a3fb0"/><path d="M96 46c6 2 8 8 6 14" stroke="#3b3290" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M68 84q12 12 24 0v5q-12 10-24 0z" fill="#d9d6e0"/>
${face(72, 74, 2.3, 8)}
<path d="M134 54a14 14 0 0 1 6 10M138 44a24 24 0 0 1 10 18" stroke="#f5b82e" stroke-width="4" fill="none" stroke-linecap="round"/>`),

  'calendar.svg': wrap('a friendly calendar with a plant', `
<circle cx="80" cy="80" r="70" fill="#f4f2fc"/>
<rect x="34" y="40" width="88" height="84" rx="14" fill="#fff" stroke="#4a3fb0" stroke-width="4"/>
<path d="M34 54a14 14 0 0 1 14-14h60a14 14 0 0 1 14 14v12H34z" fill="#4a3fb0"/>
<path d="M56 32v18M100 32v18" stroke="#3b3290" stroke-width="6" stroke-linecap="round"/>
<g fill="#e0dcf7"><rect x="46" y="76" width="14" height="12" rx="3"/><rect x="66" y="76" width="14" height="12" rx="3"/><rect x="46" y="96" width="14" height="12" rx="3"/><rect x="66" y="96" width="14" height="12" rx="3"/><rect x="86" y="96" width="14" height="12" rx="3"/></g>
<rect x="86" y="76" width="14" height="12" rx="3" fill="#f5b82e"/>
<path d="M128 132c-2-18 4-30 12-34-2 12-4 24-12 34z" fill="#2f9e7e"/><path d="M128 132c-8-12-18-16-24-14 4 8 14 14 24 14z" fill="#1f7a5f"/>`),

  'volunteer.svg': wrap('two hands holding a heart', `
<circle cx="80" cy="80" r="70" fill="#fde9dc"/>
<path d="M80 96c-22-14-32-26-32-40a16 16 0 0 1 32-4 16 16 0 0 1 32 4c0 14-10 26-32 40z" fill="#c2410c"/>
<path d="M22 108c14-4 28-2 40 8l18 6c6 2 6 10 0 10H54" stroke="${SKIN_A}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M138 108c-14-4-28-2-40 8l-18 6" stroke="${SKIN_B}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="40" cy="40" r="5" fill="#f5b82e"/><circle cx="124" cy="34" r="4" fill="#4a3fb0"/>`),

  'messages.svg': wrap('two speech bubbles', `
<circle cx="80" cy="80" r="70" fill="#f4f2fc"/>
<path d="M30 44h70a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12H58l-16 14V98H30a12 12 0 0 1-12-12V56a12 12 0 0 1 12-12z" fill="#4a3fb0"/>
<path d="M36 64h50M36 78h34" stroke="#e0dcf7" stroke-width="6" stroke-linecap="round"/>
<path d="M130 76H82a10 10 0 0 0-10 10v24a10 10 0 0 0 10 10h30l14 12v-12h4a10 10 0 0 0 10-10V86a10 10 0 0 0-10-10z" fill="#f5b82e"/>
<path d="M86 94h38M86 106h24" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`)
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), svg.replace(/\n/g, ''));
  console.log(name, svg.length, 'bytes');
}
