Outfit (self-hosted). The only typeface in SeniorPadi.

File:     outfit-variable.woff2  (one variable font file, weights 400 to 700, 41,184 bytes)
Licence:  SIL Open Font License 1.1 (OFL). Outfit is by Rodrigo Fuenzalida and Smartsheet.
          https://openfontlicense.org/   https://fonts.google.com/specimen/Outfit
Source:   Google Fonts CSS API, downloaded 15 Oct 2026 with the "text" option, so that ONE merged file holds every
          character the site asks for (Latin, Latin Extended, tone-marked vowels, punctuation). Loaded by
          src/styles/input.css (@font-face) and preloaded in views/partials/header.ejs.

YORUBA GLYPH TEST (15 Oct 2026, Chromium, canvas width test: a glyph is "in Outfit" when it measures the same with a
monospace and a serif fallback behind it):
  In Outfit:      a e i o u n m with grave and acute (à á è é ì í ò ó ù ú ǹ ń ḿ), capitals À É Ò, curly quotes, dashes.
  NOT in Outfit:  ẹ ọ ṣ Ẹ Ọ Ṣ, and therefore ẹ̀ ẹ́ ọ̀ ọ́ Ẹ̀ Ọ́ (the dot-below letters, with or without tone marks), and ₦.
                  Outfit has no Vietnamese subset and no dot-below letters at all: Google's own latin and latin-ext
                  files were tested too and also lack them. This is a gap in the font, not in the download.
  What happens:   those letters are drawn from the next font in the stack (system-ui: Roboto/Noto on Android,
                  Segoe UI on Windows, San Francisco on iPhone). They are always readable; they look slightly different
                  from the Outfit letters around them. Details and options: DESIGN-NOTES.md, section 6.

To rebuild (for example to add characters): request this address in a browser with a modern user agent, copy the
woff2 address from the returned CSS, and save the file over this one:
  https://fonts.googleapis.com/css2?family=Outfit:wght@400..700&display=swap&text=<URL-encoded characters>
