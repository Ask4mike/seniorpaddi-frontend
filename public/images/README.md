# SeniorPadi images: sources and licences

Nothing in this folder comes from the design-inspiration screenshots in `docs/images/`. Those are reference material only and are never served.

## illustrations/ (original, made for SeniorPadi)

Flat SVG illustrations drawn for this redesign in the SeniorPadi palette, with no text inside (words stay in HTML, so Outfit and the Yorùbá translations apply). They are decorative: always used with `alt=""` next to visible words. Each file is under 2 KB.

| File | Shows | Used on |
|---|---|---|
| `elders-exercise.svg` | two elders (gele, fila) stretching outdoors | Home tile: Find events |
| `elders-chat.svg` | two elders chatting on a bench | Home tile: Find seniors, log-in side panel, About, Find seniors empty state |
| `phone-call.svg` | an elder woman in a gele on the phone | Home tile and family card, Call SeniorPadi |
| `shield-id.svg` | a shield with an ID card and a check | Find seniors (locked and pending) |
| `success-check.svg` | a calm eucalyptus check with leaves | Registered pop-up |
| `welcome.svg` | an elder man in fila and agbada waving | Log-in pop-up, error page |
| `calendar.svg` | a calendar with a plant | Find events empty state, Home "How it works" |
| `volunteer.svg` | two hands holding a heart | Registered pop-up volunteer offer, Home volunteer card |
| `messages.svg` | two speech bubbles | Messages empty state |

To change them, edit `docs/ui-revamp/tools/make-illustrations.mjs` and run `node docs/ui-revamp/tools/make-illustrations.mjs public/images/illustrations`, or edit an SVG directly.

## events/ (photographs, kept from before the redesign)

`faith.jpg`, `fitness.jpg`, `health.jpg`, `learning.jpg`, `skills.jpg`, `social.jpg`: the cover picture for each event category when an event has no uploaded photo. `fitness.jpg` is also the Home hero photo (arch-cropped, decorative, `alt=""`).

**Licence: not recorded.** These files were already in the project before the redesign and their source is not written down anywhere in the repo. Before launch, confirm where each came from (for example Unsplash or Pexels, both free for commercial use with no attribution required) and note it here. If a source cannot be confirmed, replace the photo using the brief below.

They are 720 px wide JPEGs (29 to 93 KB). They were not converted to WebP or AVIF: no image tool was available on this machine. That is a recommended follow-up (see DESIGN-NOTES.md).

## Placeholder brief: photos to source

If you replace or add photos, use authentic, candid-looking pictures of older Black African people (ideally Nigerian, in everyday or traditional clothing), never posed "jumpy" stock seniors.

| Slot | Size and format | What to look for | Alt text |
|---|---|---|---|
| Home hero (`events/fitness.jpg` today) | 960 x 1200 portrait, WebP under 80 KB, plus a 480 px version for `srcset` | one or two elders smiling outdoors in daylight, room at the top for the arch crop | empty (decorative), because the heading beside it carries the meaning |
| Category covers (`events/<category>.jpg`) | 800 x 600, WebP under 60 KB | faith: a church or mosque gathering; fitness: a gentle group walk or stretch; learning: a class or reading group; skills: sewing, beading or cooking; social: a group chatting or playing ayo; health: a friendly check-up | empty (decorative), because the event title is beside it |

`hero.png` (the old phone mock-up with text baked in) is no longer used by any page.
