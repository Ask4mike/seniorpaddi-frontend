# Image credits and image shopping list

## Who the pictures are for

SeniorPadi is a free website for people aged 60 and over in Ibadan, Nigeria. It helps them find nearby community events (exercise groups, church programmes, skills classes), register or volunteer, and, once staff have checked their ID, chat with other seniors. The problem it solves is isolation and not knowing what is on nearby; the people using it often have cheap phones, slow data and sometimes a family member helping. The tone is warm, dignified and calm: real older Nigerians enjoying ordinary, active lives together, never pity, never "cute old people" stock clichés.

## What the images folder held

`docs/images/` holds 7 screenshots: the "Welcome Back" login, the "Create your account" screen, the Xefag product page, the two Sophie Bennett profile cards and the Gozney product grid (plus a card study). **They are design references from other brands, so none of them is used in the app**, and none was copied into `public/`.

## Images used in the app

| File | Used where | Why it fits | Source and licence |
|---|---|---|---|
| `public/images/events/fitness.webp` (+ `.jpg` fallback), 720 x 540 | Home hero subject (arch crop), Exercise event covers | Two older Black women smiling while stretching outdoors: active, joyful, dignified | **Unknown, please verify.** It was already in the project; no source or licence is recorded |
| `public/images/events/skills.webp` / `.jpg`, 800 x 600 | Skills event covers | Beadwork by older hands, a local craft | **Unknown, please verify** |
| `public/images/events/learning.webp` / `.jpg`, 800 x 600 | Learning event covers | Older men learning together | **Unknown, please verify** |
| `public/images/events/social.webp` / `.jpg`, 500 x 375 | Social event covers | Older women hugging and laughing | **Unknown, please verify** |
| `public/images/events/faith.webp` / `.jpg`, 480 x 360 | Faith event covers | Cover for the faith category (content not re-checked in this pass) | **Unknown, please verify** |
| `public/images/events/health.webp` / `.jpg`, 800 x 600 | Health event covers | Cover for the health category (content not re-checked in this pass) | **Unknown, please verify** |
| `public/images/illustrations/*.svg` | Create-account art panel (elders chatting), tiles, empty states | Original flat illustrations of Nigerian elders, made for SeniorPadi | Original work for this project (generator: `docs/ui-revamp/tools/make-illustrations.mjs`) |
| Glass orb, mesh gradient, leaf shapes | Log-in art panel, Home hero background | Soft, modern, calm; nothing to download | Pure CSS and inline SVG, original |

The WebP files were made from the JPGs with the browser's own encoder (quality 0.8): 10% to 36% smaller. The JPGs stay as fallbacks. **All six photos are below the size you asked for** (the hero needs 1600px+ on the long edge, event cards 1000px+ on the short edge), so they look soft on large and high-density screens.

## Why nothing new was downloaded

- **Magnific (Freepik):** search works from here, but every download needs a signed-in account, and I cannot sign in or create accounts on your behalf.
- **Pinterest:** pins are other people's images with no reuse licence, so downloading them would not be legitimate, and hotlinking is ruled out.

So every slot below is a request for you to source. The app keeps working with the current images until then.

## Shopping list

Save each file in `docs/images/` (originals) and tell me; I will compress it, make WebP/AVIF versions and wire it in. Minimum sizes are for the original download.

| Slot | Save as | Orientation, minimum size | Cut-out? | Magnific search phrases | Pinterest search phrases |
|---|---|---|---|---|---|
| Home hero subject | `hero-subject.png` | portrait, 1600px long edge | **yes, transparent background** preferred (to sit on the yolk stage like the product bottle) | "senior african couple laughing isolated", "elderly nigerian woman gele smiling transparent", "happy black grandparents hugging png", "older african man agbada portrait isolated", "senior african friends walking cutout" | "Nigerian elders portrait editorial", "African grandparents joyful photography", "senior Black couple studio portrait", "Yoruba elders traditional attire portrait", "active older Africans lifestyle" |
| Hero background shapes | `hero-leaf-1.svg`, `hero-leaf-2.svg` | any, vector | yes (vector) | "leaf silhouette vector minimal", "monstera leaf shape flat", "abstract organic shape vector", "palm leaf outline minimal" | "minimal leaf silhouette", "organic shapes background", "abstract botanical shapes" |
| Log-in art panel (optional: the CSS orb works today) | `auth-login-art.png` | portrait, 1600px | optional | "3d glass orb pastel gradient", "soft 3d render community people", "pastel gradient abstract 3d sphere", "friendly 3d characters elderly together" | "pastel 3d orb render", "glassmorphism sphere gradient", "soft gradient 3d abstract", "cute 3d elderly characters" |
| Create-account art panel (optional: the illustration works today) | `auth-register-art.png` | square or portrait, 1600px | yes, transparent | "3d cartoon grandparents friendly", "soft 3d elderly character minimalist", "clay 3d old couple waving", "3d render senior friends chatting" | "3d clay grandma character", "minimal 3d elderly illustration", "soft 3d characters community" |
| Event: Exercise | `event-fitness.jpg` | portrait, 1000px short edge, calm area at the bottom | no | "elderly african women exercise park", "senior black group stretching outdoors", "older nigerian walking group" | "seniors exercising outdoors Africa", "older women walking group park", "senior aerobics class Black" |
| Event: Faith | `event-faith.jpg` | portrait, 1000px short edge | no | "elderly african church choir", "senior black women praying church", "older nigerian congregation singing" | "African church elders singing", "older women church choir Nigeria", "senior congregation worship Africa" |
| Event: Learning | `event-learning.jpg` | portrait, 1000px short edge | no | "senior african learning smartphone", "elderly black man reading class", "older people computer class africa" | "seniors learning phone lesson", "older adults classroom Africa", "grandmother learning tablet" |
| Event: Skills | `event-skills.jpg` | portrait, 1000px short edge | no | "african woman beading hands", "elderly nigerian sewing machine", "senior adire tie dye craft" | "beadwork hands African", "older woman sewing Nigeria", "adire making craft" |
| Event: Social | `event-social.jpg` | portrait, 1000px short edge | no | "elderly african men playing ayo game", "senior black friends laughing table", "older nigerian community gathering" | "ayo olopon game elders", "older African friends laughing", "community gathering seniors Nigeria" |
| Event: Health | `event-health.jpg` | portrait, 1000px short edge | no | "senior african blood pressure check", "elderly black woman nurse community", "older people health talk africa" | "community health check seniors Africa", "older adults health talk", "nurse with elderly patient Africa" |
| Event: Intergenerational (future) | `event-family.jpg` | portrait, 1000px short edge | no | "african grandparents grandchildren outdoors", "nigerian family three generations", "grandmother teaching child cooking africa" | "African grandparents with grandchildren", "three generations Nigerian family", "grandma cooking with grandkids" |

**Before launch:** for every downloaded file, add a row to the table above with the source link and the licence terms (Magnific's free licence requires visible attribution, "Image by &lt;author&gt; on Freepik", unless you have a premium licence). Also confirm where the six existing photos came from, or replace them.
