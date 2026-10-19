#!/usr/bin/env node
// SeniorPadi preview server: look at the real pages WITHOUT a database. Node 20+, no installs beyond the project's own `npm install`.
//
//   node docs/ui-revamp/tools/preview-server.mjs            then open  http://localhost:4100/__pages
//   node docs/ui-revamp/tools/preview-server.mjs --port 4200
//   node docs/ui-revamp/tools/preview-server.mjs --check    render every page once and report any that fail (no server)
//
// What this is: the project's real EJS templates, real stylesheet (public/css/main.css), real fonts, images and scripts,
//   filled with MADE-UP sample data (invented names, phone numbers and events; nothing real).
// What this is NOT: the app. There is no login, nothing is saved, forms do not submit, live chat is off, and uploads do nothing.
//
// Handy switches on any page address:  ?lang=yo (Yoruba)   ?as=guest | senior | admin (who is "logged in")
//   events: ?login=1  (sign-up pop-up)   ?login=1&mode=login   find seniors: ?as=pending | ?as=guest
//   thread: ?incoming=1 (the request pop-up)     any page: ?flash=success|error|info
// After editing a template or src/styles/input.css (run `npm run build:css`), just reload the page.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const PORT = Number(args.includes('--port') ? args[args.indexOf('--port') + 1] : 4100);
const CHECK = args.includes('--check');
const require = createRequire(path.join(ROOT, 'package.json'));
let ejs;
try { ejs = require('ejs'); } catch { console.error('The project needs its packages first. Run "npm install" in the project folder, then try again.'); process.exit(1); }
const { t } = require(path.join(ROOT, 'src/services/i18n.js'));
const dates = require(path.join(ROOT, 'src/services/dates.js'));

// ---------- made-up sample data ----------
const DAY = 86400000;
const when = (days, hour, minutes = 0) => { const d = new Date(Date.now() + days * DAY); d.setUTCHours(hour - 1, minutes, 0, 0); return d; };
const person = (o) => ({
  id: 11, fullName: 'Adunni Balogun', firstName() { return this.fullName.split(' ')[0]; }, localPhone() { return '0803 111 1111'; },
  phone: '+2348031111111', email: 'adunni@example.com', role: 'senior', preferredLanguage: 'en', profilePictureUrl: null,
  remindersEnabled: true, reminderDaysBefore: 1, verificationStatus: 'approved', verificationRejectionReason: null,
  phoneVerifiedAt: new Date(), emailVerifiedAt: null, contactVerified() { return true; }, mustChangePassword: false,
  bio: 'Grandmother of five. I sew, I cook, and I enjoy a good gist. I would love someone to go to the Saturday walks with.',
  area: 'Challenge', tBio: null, createdAt: when(-30, 10), updatedAt: when(-2, 10), ...o
});
const USERS = {
  senior: person({}),
  admin: person({ id: 1, fullName: 'Folake Ojo (staff)', role: 'admin' }),
  pending: person({ verificationStatus: 'pending' }),
  guest: null
};
const OTHER = person({ id: 12, fullName: 'Babatunde Adeyemi', bio: 'Retired teacher. I like chess, draughts and a long walk after church.', area: 'Bodija' });
const OTHER2 = person({ id: 13, fullName: 'Iyabo Ogunleye', profilePictureUrl: null, area: 'Mokola' });
const org = { id: 1, name: 'Bodija Elders Club', contactName: 'Mrs Bello', contactPhone: '0803 222 2222', contactEmail: 'club@example.com', address: 'Bodija Community Centre', notes: '' };
const mkEvent = (o) => ({
  id: 1, title: 'Cook & Paint afternoon', tTitle: null, description: 'Cook a simple jollof together, then paint what you made. All materials are provided.', tDescription: null,
  startsAt: when(3, 14), endsAt: when(3, 16), registrationDeadline: when(2, 12), locationText: 'Bodija Community Centre', locationMapsUrl: 'https://maps.example.com/?q=Bodija',
  category: 'skills', hostedBySenior: false, imageUrl: null, Organization: org, organizationId: 1, capacity: 20, volunteerEnabled: true, volunteerCapacity: 3,
  status: 'published', taken: 12, volunteersTaken: 1, Registrations: [], ...o
});
const EVENTS = [
  mkEvent({}),
  mkEvent({ id: 2, title: 'Morning walk and stretch', description: 'A gentle 40 minute walk around the park, with stretching and a cold drink after.', category: 'fitness', hostedBySenior: true, startsAt: when(5, 7), endsAt: when(5, 9), registrationDeadline: when(4, 7), locationText: 'Liberty Park, Ibadan', taken: 8 }),
  mkEvent({ id: 3, title: 'Folktales afternoon', description: 'Come and share stories you grew up with.', category: 'social', startsAt: when(9, 15), endsAt: when(9, 17), registrationDeadline: when(8, 12), locationText: 'Mokola Library', taken: 5 })
];
const openState = { isOpen: true, isPast: false, isCancelled: false, attendeeFull: false, volunteerEnabled: true, volunteerFull: false, closesSoon: true, daysToDeadline: 2, attendeeTaken: 12, volunteerTaken: 1 };
const registration = (o) => ({ id: 21, type: 'attendee', status: 'registered', ticketNumber: 'SP-7K3QX9', createdAt: when(-1, 10), Event: EVENTS[0], event: EVENTS[0], Senior: USERS.senior, senior: USERS.senior, seniorId: 11, eventId: 1, ...o });
const QR_SVG = '<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h8v8H0z" fill="#fff"/><path d="M1 1h3v1H1zM5 1h2v2H5zM1 3h1v2H1zM3 3h2v1H3zM6 4h1v3H6zM2 6h3v1H2zM4 5h1v1H4z" fill="#000"/></svg>';
const message = (id, senderId, body, days) => ({ id, senderId, body, createdAt: when(days, 10 + id) });

// ---------- pages: [view, locals(query, language, user), default user] ----------
const PAGES = {
  '/': ['home', () => ({ title: 'SeniorPadi', fullWidth: true, upcoming: EVENTS.slice(0, 2) }), 'guest'],
  '/about': ['about', () => ({ title: 'About', wide: true }), 'guest'],
  '/call': ['call', (q, l) => ({ title: t('call.title', l), hours: t('call.hours_default', l) }), 'guest'],
  '/login': ['auth/login', (q) => ({ title: 'Log in', error: q.error ? 'That phone number or password is not right.' : null, phone: '', after: { registerEventId: '', next: '' } }), 'guest'],
  '/signup': ['auth/signup', (q) => ({ title: 'Sign up', errors: q.errors ? { fullName: 'Please type your full name.', phone: 'This phone number is not valid.', password: 'Use at least 8 characters.', ageDeclared: 'Please tick the box.' } : {}, values: q.errors ? { fullName: '', phone: '0803' } : {}, after: { registerEventId: '', next: '' } }), 'guest'],
  '/forgot-password': ['auth/forgot', (q) => ({ title: 'Forgot password', sent: Boolean(q.sent) }), 'guest'],
  '/reset-password': ['auth/reset', (q) => ({ title: 'Reset password', error: q.error ? 'The two passwords do not match.' : null, action: '/reset-password' }), 'guest'],
  '/change-password': ['auth/change', (q) => ({ title: 'Change password', error: q.error ? 'Your old password is not right.' : null }), 'senior'],
  '/verify': ['auth/verify', (q) => ({ title: 'Verify', sent: q.sent || '', minutes: 15, needsEmail: true }), 'senior'],
  '/events': ['events/index', (q) => ({ title: 'Find events', wide: true, event: EVENTS[0], position: 1, total: 3, canStartAgain: false, nextEvent: EVENTS[1], loginFor: q.login ? 1 : null, modalMode: q.mode === 'login' ? 'login' : 'signup', category: q.category || '', categories: ['fitness', 'faith', 'learning', 'skills', 'social', 'health'] }), 'guest'],
  '/events/1': ['events/show', () => ({ title: EVENTS[0].title, wide: true, event: EVENTS[0], state: openState, mine: { attendee: null, volunteer: null }, interested: false }), 'senior'],
  '/events/1/registered': ['events/registered', () => ({ title: 'Registered', wide: true, event: EVENTS[0], ticket: 'SP-7K3QX9', canVolunteer: true }), 'senior'],
  '/events/1/confirmed': ['events/confirmed', () => ({ title: 'Confirmed', event: EVENTS[0], type: 'attendee', qr: QR_SVG }), 'senior'],
  '/find-seniors': ['social/find', (q, l, user) => ({ title: 'Find seniors', wide: true, next: user && user.verificationStatus === 'approved' ? OTHER : null, modalMode: 'login' }), 'senior'],
  '/messages': ['social/inbox', () => ({ title: 'Messages', conversations: [{ person: OTHER, last: message(3, 12, 'Yes o. Bring your grandchildren if you like.', -1) }, { person: OTHER2, last: message(4, 11, 'Thank you for the walk this morning!', -2) }], unreadIds: new Set([12]) }), 'senior'],
  '/messages/12': ['social/thread', (q) => ({ title: 'Babatunde', other: OTHER, exchange: null, incomingRequest: Boolean(q.incoming), messages: [message(1, 11, 'Good morning, are you going to the walk on Saturday?', -2), message(2, 12, 'Yes o. Bring your grandchildren if you like.', -1)], olderLink: null }), 'senior'],
  '/notifications': ['social/notifications', () => ({ title: 'Notifications', notifications: [{ id: 1, type: 'message.new', payload: { name: 'Babatunde' }, link: '/messages/12', createdAt: when(-1, 9), readAt: null }, { id: 2, type: 'id.approved', payload: {}, link: '/find-seniors', createdAt: when(-4, 9), readAt: when(-3, 9) }] }), 'senior'],
  '/report/12': ['social/report', () => ({ title: 'Report', other: OTHER }), 'senior'],
  '/block/12': ['social/block', () => ({ title: 'Block', other: OTHER }), 'senior'],
  '/account': ['account/account', () => ({ title: 'My account', wide: true, ticketCount: 2 }), 'senior'],
  '/settings': ['account/settings', (q) => ({ title: 'Settings', errors: q.errors ? { email: 'This email address is not valid.' } : {} }), 'senior'],
  '/history': ['account/history', () => ({ title: 'History', registrations: [registration({ status: 'attended', Event: EVENTS[1], event: EVENTS[1] })] }), 'senior'],
  '/registrations': ['account/registrations', () => ({ title: 'My tickets', wide: true, registrations: [registration({}), registration({ id: 22, type: 'volunteer', ticketNumber: 'SP-2M8ZD4', Event: EVENTS[1], event: EVENTS[1] })] }), 'senior'],
  '/delete-account': ['account/delete', (q) => ({ title: 'Delete account', error: q.error ? 'That password is not right.' : null }), 'senior'],
  '/onboarding': ['onboarding', () => ({ title: 'Welcome', videoSrc: null, transcript: 'Welcome to SeniorPadi. Here is how it works.\n\n1. Find an event you like.\n2. Press Register.\n3. Come along and enjoy it.', firstTime: true }), 'senior'],
  '/error-page': ['error', () => ({ title: 'Something went wrong', message: 'We could not find that page.' }), 'guest'],
  '/admin/events': ['admin/events', () => ({ title: 'Events', events: EVENTS }), 'admin'],
  '/admin/seniors': ['admin/seniors', () => ({ title: 'Seniors', seniors: [USERS.senior, OTHER, OTHER2], q: '', tempPassword: null }), 'admin'],
  '/admin/ids': ['admin/ids', () => ({ title: 'ID checks', pending: [person({ id: 14, fullName: 'Kehinde Salako', verificationStatus: 'pending', idPhotoUrl: null })] }), 'admin'],
  '/admin/attendance': ['admin/attendance', () => ({ title: 'Attendance', event: EVENTS[0], registrations: [registration({ id: 31 }), registration({ id: 32, Senior: OTHER, senior: OTHER, seniorId: 12, type: 'volunteer', ticketNumber: 'SP-4P9WQ1' })], hasStarted: false }), 'admin'],
  '/admin/organizations': ['admin/organizations', () => ({ title: 'Organizations', organizations: [org], error: null }), 'admin'],
  '/admin/staff': ['admin/staff', () => ({ title: 'Staff', staff: [USERS.admin], errors: {}, values: {} }), 'admin'],
  '/admin': ['admin/dashboard', () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({ key: '2026-10-' + (12 + i), label, total: [3, 5, 2, 8, 6, 4, 1][i] }));
    const stats = { totals: { events: 6, registrations: 48, attendees: 31, seniors: 120, volunteers: 9, attendanceRate: 78 }, days, categories: [{ category: 'fitness', total: 12 }, { category: 'faith', total: 9 }, { category: 'skills', total: 7 }, { category: 'social', total: 5 }] };
    return { title: 'Admin', stats, totals: stats.totals, upcoming: EVENTS, needsAttendance: [EVENTS[1]], seniorCount: 120, noShows: [], pendingIds: 2, openReports: 1, alerts: [{ id: 1, type: 'message.new', payload: { name: 'Babatunde' }, link: '/admin/ids', createdAt: when(-1, 9), readAt: null }], systemWarnings: [] };
  }, 'admin'],
  '/admin/system': ['admin/system', () => ({ title: 'System', dbOk: true, dbHost: 'localhost', migrations: { executed: ['20261003000001-events-tickets-attendance-verification.js'], pending: [] }, brevo: 'on', cloudinary: true, appUrl: 'http://localhost:3000', startedAt: when(-1, 8), warnings: [], lastRuns: { reminders: when(0, 8), remindersSent: 14 }, counts: { seniors: 120, upcomingEvents: 6, registrations: 48 } }), 'admin'],
  '/admin/events/new': ['admin/event-form', () => ({ title: 'New event', event: null, values: { category: 'social', capacity: 20, volunteerCapacity: 3 }, errors: {}, organizations: [org], categories: ['fitness', 'faith', 'learning', 'skills', 'social', 'health'], action: '/admin/events' }), 'admin'],
  '/admin/reports': ['admin/reports', () => ({ title: 'Reports', pending: [], recent: [] }), 'admin'],
  '/admin/scan': ['admin/scan', () => ({ title: 'Check in', registration: null }), 'admin'],
  '/admin/onboarding-video': ['admin/onboarding-video', () => ({ title: 'Welcome video', videos: [] }), 'admin'],
  '/admin/organizations/1': ['admin/organization-edit', () => ({ title: 'Edit organization', org, error: null }), 'admin']
};
const GROUPS = [['Public and sign-in', ['/', '/about', '/call', '/login', '/login?error=1', '/signup', '/signup?errors=1', '/forgot-password', '/reset-password', '/change-password', '/verify', '/error-page']],
  ['Events', ['/events', '/events?login=1', '/events?login=1&mode=login', '/events/1', '/events/1/registered', '/events/1/confirmed']],
  ['Find seniors and messages', ['/find-seniors', '/find-seniors?as=pending', '/find-seniors?as=guest', '/messages', '/messages/12', '/messages/12?incoming=1', '/notifications', '/report/12', '/block/12']],
  ['My account', ['/account', '/settings', '/settings?errors=1', '/history', '/registrations', '/delete-account', '/onboarding']],
  ['Staff area', ['/admin/events', '/admin/seniors', '/admin/ids', '/admin/attendance', '/admin/organizations', '/admin/staff']]];

// ---------- rendering ----------
function render(pathname, q) {
  const page = PAGES[pathname]; if (!page) return null;
  const [view, make, defaultUser] = page;
  const lang = q.lang === 'yo' ? 'yo' : 'en';
  const asKey = q.as || defaultUser || 'senior';
  const base = USERS[asKey] === undefined ? USERS.senior : USERS[asKey];
  const user = base ? { ...base, preferredLanguage: lang } : null;
  const flash = q.flash ? { type: q.flash, message: q.flash === 'error' ? 'Something did not work. Please try again.' : 'Your changes have been saved.' } : null;
  const locals = {
    currentUser: user, unreadCount: user ? 2 : 0, lang, t: (key, vars) => t(key, lang, vars), formatDate: (d) => dates.formatDate(d, lang), formatTime: dates.formatTime,
    currentPath: pathname, supportPhone: '0800 000 0000', flash, csrfToken: 'preview-token', ...make(q, lang, user)
  };
  return ejs.renderFile(path.join(ROOT, 'views', view + '.ejs'), locals, { async: false });
}
const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };
const indexPage = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SeniorPadi preview</title>
<style>body{font:19px/1.6 "Segoe UI",Arial,sans-serif;max-width:56rem;margin:0 auto;padding:1.5rem;color:#16213e}h1{font-size:1.8rem}h2{font-size:1.3rem;margin-top:2rem}a{color:#22407a}li{margin:.35rem 0}.note{background:#fff1cc;border:2px solid #6b4200;border-radius:12px;padding:1rem}code{background:#eef2fa;padding:.1rem .35rem;border-radius:6px}</style></head><body>
<h1>SeniorPadi preview (no database)</h1>
<p class="note"><strong>This is a preview, not the real app.</strong> The pages use the project's real templates and styles with made-up sample people and events. Nothing is saved, forms do not submit, there is no login and no live chat.</p>
<p>Add <code>?lang=yo</code> to any address for Yorùbá, <code>?as=guest</code>, <code>?as=senior</code> or <code>?as=admin</code> to change who is "logged in", and <code>?flash=success</code> or <code>?flash=error</code> to see the message banner.</p>
${GROUPS.map(([title, links]) => `<h2>${title}</h2><ul>${links.map((l) => `<li><a href="${l}">${l}</a> &nbsp; <a href="${l}${l.includes('?') ? '&' : '?'}lang=yo">Yorùbá</a></li>`).join('')}</ul>`).join('')}</body></html>`;

if (CHECK) {
  let bad = 0;
  for (const p of Object.keys(PAGES)) {
    for (const lang of ['en', 'yo']) {
      try { const html = await render(p, { lang }); if (!html || html.length < 200) throw new Error('empty page'); }
      catch (e) { bad++; console.log(`FAIL ${p} (${lang}): ${String(e.message).split('\n').filter(Boolean).slice(-3).join(' | ').slice(0, 300)}`); break; }
    }
  }
  console.log(bad ? `${bad} of ${Object.keys(PAGES).length} pages failed` : `All ${Object.keys(PAGES).length} pages render in English and Yoruba.`);
  process.exit(bad ? 1 : 0);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'); const q = Object.fromEntries(url.searchParams);
  if (req.method === 'POST') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end('<p style="font:19px Arial;padding:2rem">This is the preview: forms are switched off here. <a href="javascript:history.back()">Go back</a></p>'); }
  if (url.pathname === '/__pages') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(indexPage()); }
  // the in-browser page checker (see page-checks.js)
  if (url.pathname === '/__qa.js') { res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' }); return fs.createReadStream(path.join(ROOT, 'docs/ui-revamp/tools/page-checks.js')).pipe(res); }
  if (/^\/(css|js|images|fonts)\//.test(url.pathname)) {
    const file = path.join(ROOT, 'public', url.pathname);
    if (file.startsWith(path.join(ROOT, 'public')) && fs.existsSync(file) && fs.statSync(file).isFile()) { res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' }); return fs.createReadStream(file).pipe(res); }
    res.writeHead(404); return res.end('not found');
  }
  if (url.pathname === '/socket.io/socket.io.js') { res.writeHead(404); return res.end(); }
  try {
    const html = await render(url.pathname, q);
    if (html === null) { res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); return res.end(`<p style="font:19px Arial;padding:2rem">No preview for ${url.pathname}. <a href="/__pages">All preview pages</a></p>`); }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
  } catch (e) { res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Preview error:\n' + e.message); }
}).listen(PORT, () => console.log(`SeniorPadi preview (no database) on http://localhost:${PORT}/__pages`));
