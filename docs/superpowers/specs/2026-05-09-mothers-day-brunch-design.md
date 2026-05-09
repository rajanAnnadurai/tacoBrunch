# Mother's Day Taco Brunch — Site Design Spec

**Date:** 2026-05-09
**Event date:** Sunday, 2026-05-10
**Owner:** Rajan
**Output:** A public GitHub Pages site that (a) presents the day's plan and menu beautifully for moms and guests, and (b) gives 5 beginner cooks clear, photo-illustrated instructions to execute the meal.

---

## 1. The Event

- **15 guests total** — 5 moms (being celebrated), 5 helpers (cooks), 5 others (3 kids aged 13+, 2 adults). All eat the same food; no kid menu needed. 4 of the 15 are vegetarian.
- **Location:** Host's backyard with outdoor grill and cast iron griddle, plus an ADU and indoor kitchen as backup. Music + space for moms to hang out.
- **Diet:** No red meat. Chicken, fish/seafood, eggs, all vegetables OK. No allergies.
- **Style:** Lunch-style taco bar with a beloved Austin breakfast-taco station included.
- **Drinks:** Alcohol welcome — margaritas, palomas, Mexican lagers; watermelon agua fresca for kids and non-drinkers.
- **Dessert:** Bought tres leches + fresh berries (no Sunday-morning baking).

---

## 2. Day-of Schedule

| Time | Front of house (moms/guests) | Back of house (helpers) |
|---|---|---|
| 10:30 AM | Everyone arrives. Moms greeted with a drink, head to backyard/ADU with music. | Cooks gather in kitchen, claim stations, start prep. |
| 10:30–11:30 | Hangout: drinks, music, conversation in the backyard/ADU. | Marinades, chopping, sides started, chicken into marinade. |
| 11:30–12:25 | Continued hangout; aroma builds. | Grill lit, proteins cook in sequence. Toppings plated. |
| 12:30 PM | **Brunch served** — taco bar opens. | Eggs cooked à la minute; griddle warming tortillas. |
| ~1:30 PM | Toast to the moms. Tres leches + berries. | Cooks join the table. |

---

## 3. Menu (Locked)

### Fillings (4)
1. **Austin egg + cheese + potato breakfast tacos** — eggs scrambled with cheese on flour tortillas, with crispy potatoes folded in.
2. **Achiote grilled chicken** — boneless thighs, achiote/lime/garlic marinade, grilled and sliced.
3. **Chipotle-garlic prawns** + cabbage-lime slaw — large shrimp, seared on the cast iron griddle.
4. **Mushroom + poblano** (vegetarian) — cremini mushrooms, roasted poblano, onion, smoky and savory.

### Sides
- Esquites (Mexican street corn salad)
- Cilantro-lime rice
- Black beans (canned, doctored with onion + spice)
- Chips + bought salsa (one mild, one spicy)

### Toppings bar
Pico de gallo, guacamole, queso fresco, shredded lettuce, sour cream, lime wedges, cilantro, pickled red onions, salsa verde, hot sauce. Corn + flour tortillas warmed on griddle.

### Drinks
Pitcher classic margaritas · palomas · watermelon agua fresca · Mexican lagers.

### Dessert
Bought tres leches cake + fresh berries.

---

## 4. Cook Stations (5 — one per helper)

| # | Station | Active hours | Outputs |
|---|---|---|---|
| 1 | **Egg Tacos** | 11:45–12:30 | Scrambled eggs + cheese, crispy potatoes, warm flour tortillas |
| 2 | **Grilled Chicken** | 10:30 marinate → 12:00 grill | Sliced achiote chicken |
| 3 | **Prawns** | 12:10–12:25 | Chipotle-garlic shrimp + cabbage slaw |
| 4 | **Veg + Sides** | 11:00–12:25 | Mushroom-poblano filling, esquites, rice, beans |
| 5 | **Bar + Toppings** | 11:00–12:30 | Pico, guac, all toppings plated, drinks station, tortilla warming |

Station assignments to specific people are filled in by the host before sharing the link.

---

## 5. Site Structure

The site is **two halves** with a clear navigation switch between them.

### Front of house — for moms and guests
- **`/` Home** — hero (date, time, vibe), the plan timeline, photo grid linking to menu items, "for helpers" link at bottom.
- **`/menu`** — full menu with a real photo + description for each filling, side, drink, dessert. Mobile-first card grid.

### Back of house — for helpers
- **`/helpers`** — station index. Five station cards, each linking to its own page. Includes the master timeline (combined view of all stations) and a shopping list.
- **`/helpers/station-1-eggs`**
- **`/helpers/station-2-chicken`**
- **`/helpers/station-3-prawns`**
- **`/helpers/station-4-veg-sides`**
- **`/helpers/station-5-bar-toppings`**

Each station page contains: assigned cook (filled in by host), personal timeline, ingredients list with quantities, equipment needed, **step-by-step instructions with photos** at every step (because cooks are beginners), troubleshooting tips, and a checklist.

### Shared pages
- **`/shopping`** — full shopping list grouped by store section (produce, meat/seafood, pantry, drinks, bakery), with quantities for 15 people.

---

## 6. Design Direction

**Visual style:** warm, celebratory, food-photography-forward. A Mother's Day brunch should feel inviting — not aggressively cute, not corporate. Think "warm terracotta + cream + soft greens, with hand-set type for headings and clean sans for body."

**Mobile-first:** cooks read on phones in the backyard while their hands are messy. Big tap targets, big type, lots of whitespace, no fiddly hover states.

**Print-friendly:** every station page has a print stylesheet so the host can print one sheet per cook. The home page also prints cleanly as a one-page menu.

**Photo strategy:** use Unsplash food photos for menu items and recipe steps. Photos must be cropped consistently (square for menu cards, 4:3 for recipe steps).

**Polish principles** (handed off to the implementation phase, which uses the `frontend-design` skill):
- Distinct, hand-built feel — avoid generic Bootstrap / Tailwind-default look.
- Considered typography (one display face for headings, one neutral sans for body, real type scale).
- Subtle texture or grain on warm backgrounds — not flat color.
- Clear visual rhythm — sections breathe, never crammed.

---

## 7. Tech Stack & Hosting

- **Static site, hand-rolled HTML/CSS** (no JS framework) — fastest path, no build server needed, easy GitHub Pages deploy.
- **Single CSS file** for the whole site, organized by component.
- **GitHub Pages** from the `main` branch root or `/docs` folder, with a custom domain optional later.
- **Repo structure:**
  ```
  /
    index.html              ← Home (the plan)
    menu.html               ← Menu with photos
    helpers.html            ← Station index + master timeline + shopping
    helpers/
      station-1-eggs.html
      station-2-chicken.html
      station-3-prawns.html
      station-4-veg-sides.html
      station-5-bar-toppings.html
    shopping.html
    assets/
      css/site.css
      img/                  ← downloaded Unsplash photos, optimized
    docs/superpowers/specs/  ← this spec
  ```

---

## 8. Out of Scope

- RSVP forms, login, comments — none.
- Recipe printing as PDF (CSS print is enough).
- Multi-language support.
- Analytics.
- Service worker / offline (the site is small; cooks have wifi or cellular).

---

## 9. Acceptance Criteria

The site is "done" when:
1. All 9 pages exist and render correctly on iPhone-sized viewports without horizontal scroll.
2. Every menu item has a real food photo (not a placeholder).
3. Every recipe step on every station page has a photo.
4. Print preview of any station page produces one usable kitchen sheet.
5. The site is published on GitHub Pages and the URL is shareable (public).
6. Host can hand the link to all 15 guests on Sunday morning and each can find what they need (moms: the plan; helpers: their station).

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Photo sourcing takes longer than expected | Pre-select 3-5 Unsplash candidates per item before implementation begins; have a fallback "no-photo" card style. |
| Site build runs past Sunday morning | Build front-of-house pages first (Home, Menu) — those are the moms-facing must-haves. Helpers' pages can be filled in last. |
| Beginner cooks still confused mid-cooking | Each station page has a "Help! Something's wrong" section with the most common failure modes for that recipe. |
| GitHub Pages takes time to propagate | Deploy at least 3 hours before brunch start (i.e., by 9:30 AM Sunday). Have a backup plan to print station sheets if site is unreachable. |
