Noto Sans (self-hosted)

File:     noto-sans-variable.woff2  (one variable font file, weights 400 to 700, 57,520 bytes)
Licence:  SIL Open Font License 1.1 (OFL). Noto Sans is by Google and the Noto project.
          https://openfontlicense.org/   https://fonts.google.com/noto/specimen/Noto+Sans
Source:   Google Fonts CSS API, downloaded 14 Oct 2026 with the "text" option so that ONE merged file holds
          every character the site needs. The base letters and the Yoruba tone marks must be in the same file,
          otherwise browsers draw the marks from a fallback font.

Characters included (456):
  Basic Latin U+20-7E, Latin-1 U+A0-FF, Latin Extended-A U+100-17F, U+1CD-1DC, U+1F8-1F9 (n with grave),
  U+1E3E-1E3F (m with acute), U+1E62-1E63 (s with dot below), U+1EA0-1EF9 (Vietnamese and e/o with dot below),
  combining marks U+300-304, 308, 30C, 323, 329, and punctuation: en and em dash, curly quotes, bullet,
  ellipsis, Naira sign U+20A6, euro, trademark, arrows, check marks.
  Anything else falls back to the system font (see --font-sans in src/styles/input.css).

To rebuild or extend (for example to add characters), request this URL in a browser with a modern user agent,
copy the woff2 address from the returned CSS, and save the file over this one:
  https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400..700&display=swap&text=<URL-encoded characters>

Tested 14 Oct 2026 in Chromium: all Yoruba test strings (e-dot, o-dot, s-dot with and without tone marks, n and m
with tone marks) render from this font at weights 400 and 700. Not tested on a real Android phone yet.
