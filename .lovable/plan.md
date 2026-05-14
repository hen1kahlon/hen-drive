## Premium Redesign — חן כחלון

Inspired by the reference (cinematic dark hero, orange/blue glows, product-style cards on black, glassy nav, gradient CTAs) — but original execution.

### 1. New cinematic hero image
Generate a fresh hero with `imagegen` (premium): realistic young driving instructor + female student inside a modern car interior, warm cinematic key-light from the left window, deep teal/blue rim light, shallow DOF, dashboard glow visible. Replace `src/assets/hero-driving.jpg`.

Add a second generated portrait of the instructor (standalone, urban dusk backdrop with motorcycle silhouette) for the About section.

### 2. Hero section redesign
- Two-column layout (image left edge-bleed, text right) — desktop
- Mobile: full-bleed image with strong gradient scrim, text below
- Massive Hebrew display headline (font weight 900, tighter tracking) with the word "בביטחון" in gradient + handwritten-style "עד ההצלחה!" accent in orange below
- Three pill-style CTAs: orange-gradient primary "התחל ללמוד עכשיו", green WhatsApp, glass "התקשר עכשיו"
- Glass trust-bar UNDER the CTAs with 4 inline icons+labels (יחס אישי / כלים חדשים / ליווי עד הטסט / מאות תלמידים)
- Animated speedometer/gauge visual element bottom-left as decorative accent (CSS/SVG, not image)
- Stronger orange + blue radial glows behind the image, subtle grid overlay

### 3. Categories — product-card style
- Each card: dark elevated panel with thin orange ring on icon, large product image (car/bike) center-stage, title + short desc, ghost-style "אני מעוניין בפרטים" pill button at bottom
- Generate 4 product images: sedan (B), sport bike A2, scooter A1, naked bike A — all on transparent/dark studio background, dramatic underlight
- Hover: lift + cyan-to-orange border gradient + glow

### 4. About section
- Left: portrait card with dramatic city dusk background (new generated image)
- Right: heading "קצת עליי" (blue accent eyebrow), bio paragraph, then a horizontal stat strip: **350+ תלמידים** · **5 שנות ניסיון** · **98% הצלחה** with gradient numbers
- Below stats: 7 checklist items in two columns with cyan checkmark chips
- Faint lightning/grid texture in section background

### 5. Why-Me grid
- 6 compact cards in 3-col grid
- Each: large outline icon (alternating blue/orange), bold title, one-line desc
- Subtle inner border glow on hover

### 6. Reviews + Gallery
- 3 testimonial cards in a horizontal scroller with arrow controls (mobile swipe)
- Each card: 5 stars, quote, name + small avatar
- "גלריית תלמידים מרוצים" — 5-image horizontal strip with parallax-style hover scale (use placeholder gradient cards, user can swap real photos later)

### 7. Areas + Lead Form combo section
- Split layout on desktop: left = "אזורי לימוד / אשקלון והסביבה" with stylized map illustration + 3 "הבטחות" mini-list (חזרה מהירה / ללא התחייבות / התאמה אישית); right = lead form on raised card
- Form unchanged in logic (mailto), restyled with floating labels and orange gradient submit button

### 8. Final CTA band
- Full-width gradient (deep blue → black → orange highlight) with centered "מתחילים את הדרך לרישיון?" + 2 large CTAs (WhatsApp green + phone orange-gradient)

### 9. Footer
- 3-column on desktop / stacked on mobile
- Logo + tagline | contact info (phone, email, area) | social icons (Instagram, Facebook, TikTok) as glass circles with hover glow
- Bottom row: copyright + small print

### 10. Sticky mobile bar
- Keep, restyle: 3 equal segments with icons (WhatsApp / Phone / Form) on a glass background

### Design tokens (update `src/styles.css`)
- Slightly deeper background (`oklch(0.06 0.012 250)`) for more luxe feel
- Add `--glow-orange` and `--glow-blue` tokens
- New utility `.ring-glow` for soft outer rings on cards
- Add `.text-display` utility (font-weight 900, letter-spacing -0.03em, line-height 0.95) for hero
- Optional Hebrew display font: add `Assistant` or keep `Heebo` 900 — keep Heebo for consistency

### Files to change
- `src/assets/hero-driving.jpg` — regenerate cinematic
- `src/assets/about-portrait.jpg` — new
- `src/assets/vehicles/{sedan,bike-a2,scooter-a1,bike-a}.png` — 4 new product images (transparent PNG)
- `src/styles.css` — token tweaks, new utilities
- `src/routes/index.tsx` — full restructure of all sections per above
- `src/routes/__root.tsx` — minor: keep meta, possibly add JSON-LD LocalBusiness

### Out of scope (intentionally)
- No backend/Cloud setup (form stays mailto)
- No new routes (single landing page)
- No payment, auth, or DB

After approval I'll execute in this order: generate images → update tokens → rebuild `index.tsx` section by section → verify in preview at the mobile viewport.
