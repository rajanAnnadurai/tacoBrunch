# Mother's Day Taco Brunch Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a 9-page public GitHub Pages site for a Mother's Day taco brunch on 2026-05-10, with a moms-facing "the plan + menu (with photos)" half and a helpers-facing "your station (recipes with step photos)" half.

**Architecture:** Hand-rolled static HTML + a single CSS file with a design system. No JS framework, no build tooling. Photos sourced from Unsplash, downloaded and self-hosted under `assets/img/`. Mobile-first layout with a print stylesheet for kitchen station sheets. Deploys via GitHub Pages from `main` branch root.

**Tech Stack:** HTML5 · CSS3 (custom properties + grid/flex, no preprocessor) · Git · GitHub · GitHub Pages · Python `http.server` for local preview · `curl` for image fetches · macOS `sips` for image optimization.

**Spec:** `docs/superpowers/specs/2026-05-09-mothers-day-brunch-design.md`

---

## File Structure

```
/
  README.md                      ← repo description (1 paragraph)
  .gitignore                     ← .DS_Store, .superpowers/, etc.
  index.html                     ← Home (the plan)
  menu.html                      ← Menu with photos
  helpers.html                   ← Station index + master timeline + shopping link
  shopping.html                  ← Shopping list grouped by aisle
  helpers/
    station-1-eggs.html
    station-2-chicken.html
    station-3-prawns.html
    station-4-veg-sides.html
    station-5-bar-toppings.html
  assets/
    css/
      site.css                   ← single design-system + page styles + print stylesheet
    img/
      menu/                      ← 1 photo per menu item (~12 files)
      recipes/                   ← step photos per station (~25-35 files)
  docs/superpowers/
    specs/2026-05-09-mothers-day-brunch-design.md   (already exists)
    plans/2026-05-09-mothers-day-brunch.md           (this file)
```

**File responsibilities:**

- **`index.html`** — landing page for moms/guests: hero, day timeline, menu preview grid (links to `menu.html`), a quiet link at the bottom for helpers.
- **`menu.html`** — full menu, organized as Fillings · Sides · Toppings · Drinks · Dessert. Each item is a card with photo + 1-line description.
- **`helpers.html`** — station picker (5 cards → individual station pages), master timeline showing all 5 stations on a unified hour-by-hour chart, and a link to `shopping.html`.
- **`helpers/station-N-*.html`** — per-station: assigned cook (placeholder text the host fills in), personal timeline, ingredients list with quantities for 15 people, equipment list, step-by-step instructions with one photo per step where possible, troubleshooting "Help! something's wrong" panel, final checklist.
- **`shopping.html`** — single-page shopping list grouped by store section (Produce, Meat/Seafood, Pantry, Dairy/Eggs, Drinks, Bakery), with quantities for 15.
- **`assets/css/site.css`** — design tokens (colors, typography, spacing), base typography, components (hero, card, timeline, station card, recipe step), per-page sections, print stylesheet.

Per the design spec: warm terracotta + cream + soft greens · one display face for headings + one neutral sans for body · big tap targets · mobile-first · print-friendly.

---

## Verification Approach (Adapted from TDD)

Static HTML doesn't have unit tests, but each task has a **verification step** before commit:

1. Run `python3 -m http.server 8000 --directory <repo>` from a separate terminal (or background process).
2. Open `http://localhost:8000/<page>` in a browser.
3. Toggle device toolbar to "iPhone 14 Pro" width (~393px) — verify no horizontal scroll, big tap targets, readable type.
4. Toggle device toolbar back to desktop — verify layout still looks good.
5. For station/menu pages: `Cmd+P` to open print preview — verify it produces a usable kitchen sheet.

A "Verification passes" check means: all four of the above pass without visual breakage.

---

## Photo Strategy

Per menu item / per recipe step, the engineer will:
1. Search Unsplash via web (https://unsplash.com/s/photos/<keyword>) for the keyword listed in the task.
2. Pick the first photo that is **clearly the dish in question, well-lit, and not overly stylized**.
3. Right-click → "Save Image As" or use `curl -L` against the photo's image URL.
4. Save to the path specified in the task with the filename specified.
5. Optimize: `sips -Z 1200 <file>` to cap longest edge at 1200px (keeps file under ~200KB).

If no good photo is found in the first 12 results, log it in a comment and use a generic taco/food photo with appropriate alt text. Do not block the build for one missing photo.

**Acceptable license:** Unsplash photos are free for commercial and personal use; attribution is appreciated but not required (https://unsplash.com/license).

---

## Task 0: Repo + GitHub Pages Setup

**Files:**
- Create: `README.md`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git in the project root**

Run from `/Users/rajan.annadurai/Library/CloudStorage/Dropbox-Family/Rajan Annadurai/work/localProjects/tacoBrunch`:

```bash
git init
git branch -M main
```

Expected: "Initialized empty Git repository in …" and switched to `main`.

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
.superpowers/
node_modules/
.vscode/
.idea/
*.log
```

- [ ] **Step 3: Create `README.md`**

```markdown
# Mother's Day Taco Brunch

Public site for Mother's Day brunch on 2026-05-10.

- **Moms / guests:** start at `index.html`
- **Helpers / cooks:** go to `helpers.html` for your station

Built as a static site, deployed via GitHub Pages.
```

- [ ] **Step 4: First commit**

```bash
git add README.md .gitignore docs/
git commit -m "chore: initialize repo with spec and plan"
```

- [ ] **Step 5: Create the GitHub repo and push**

Use `gh` CLI if available, otherwise create via web UI. Repo name: `tacoBrunch` (or `mothers-day-brunch`). Visibility: **public**.

```bash
gh repo create tacoBrunch --public --source=. --remote=origin --push
```

If `gh` is not installed, create the repo at https://github.com/new (public, no README/license/gitignore — we already have those), then:

```bash
git remote add origin git@github.com:<user>/tacoBrunch.git
git push -u origin main
```

- [ ] **Step 6: Enable GitHub Pages**

Via web UI: repo → Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, Folder: `/ (root)` → Save.

Or via gh CLI:
```bash
gh api -X POST repos/<user>/tacoBrunch/pages -f source[branch]=main -f source[path]=/
```

Verify: the page-settings UI shows "Your site is being deployed" or a URL.

- [ ] **Step 7: Verification**

Wait ~1 min, then visit `https://<user>.github.io/tacoBrunch/`. Expect a 404 (no `index.html` yet) — that's fine; Pages is wired up. Note the URL for later.

---

## Task 1: Design System CSS

**Files:**
- Create: `assets/css/site.css`
- Create: `index.html` (placeholder, just to verify CSS loads)

This task delivers the entire design system in one CSS file: tokens, typography, layout primitives, components, and print rules. Subsequent page tasks just write HTML and reuse these classes.

- [ ] **Step 1: Create `assets/css/site.css`**

```css
/* =========================================================================
   DESIGN TOKENS
   ========================================================================= */
:root {
  /* Color */
  --color-cream: #fdf6ec;
  --color-cream-deep: #f5e6d3;
  --color-terracotta: #d4756f;
  --color-terracotta-deep: #b85850;
  --color-warm-orange: #e8a87c;
  --color-sage: #8aa680;
  --color-sage-deep: #5e8c4a;
  --color-charcoal: #2a2522;
  --color-ink: #1a1614;
  --color-muted: #7a6f66;
  --color-line: #e8d8c4;

  /* Type */
  --font-display: "Fraunces", "Cooper Black", Georgia, serif;
  --font-body: "Inter", -apple-system, "Helvetica Neue", system-ui, sans-serif;

  /* Type scale */
  --fs-12: 0.75rem;
  --fs-14: 0.875rem;
  --fs-16: 1rem;
  --fs-18: 1.125rem;
  --fs-22: 1.375rem;
  --fs-28: 1.75rem;
  --fs-36: 2.25rem;
  --fs-48: 3rem;

  /* Spacing */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;
  --sp-7: 48px;
  --sp-8: 64px;

  /* Radius */
  --r-sm: 6px;
  --r-md: 12px;
  --r-lg: 18px;
}

/* =========================================================================
   RESET (lightweight)
   ========================================================================= */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  font-size: var(--fs-16);
  line-height: 1.55;
  color: var(--color-ink);
  background: var(--color-cream);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: var(--color-terracotta-deep); text-decoration: none; }
a:hover { text-decoration: underline; }

h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; line-height: 1.15; margin: 0 0 var(--sp-4); }
h1 { font-size: var(--fs-48); }
h2 { font-size: var(--fs-36); }
h3 { font-size: var(--fs-22); }
p { margin: 0 0 var(--sp-4); }

/* =========================================================================
   LAYOUT PRIMITIVES
   ========================================================================= */
.container { width: 100%; max-width: 760px; margin: 0 auto; padding: 0 var(--sp-5); }
.container-wide { max-width: 1080px; }
.section { padding: var(--sp-7) 0; }
.eyebrow { font-size: var(--fs-12); letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-muted); }

/* =========================================================================
   HERO (home page)
   ========================================================================= */
.hero {
  background: linear-gradient(135deg, var(--color-terracotta) 0%, var(--color-warm-orange) 100%);
  color: white;
  padding: var(--sp-8) var(--sp-5) var(--sp-7);
  text-align: center;
}
.hero .eyebrow { color: rgba(255,255,255,0.9); }
.hero h1 { color: white; font-size: var(--fs-48); margin: var(--sp-3) 0 var(--sp-4); }
.hero .meta { font-size: var(--fs-18); opacity: 0.95; }

/* =========================================================================
   TIMELINE (the plan)
   ========================================================================= */
.timeline { display: flex; flex-direction: column; gap: var(--sp-4); }
.timeline-row { display: flex; gap: var(--sp-4); align-items: flex-start; }
.timeline-time {
  flex: 0 0 80px;
  background: var(--color-terracotta);
  color: white;
  border-radius: 999px;
  padding: var(--sp-1) var(--sp-3);
  font-size: var(--fs-14);
  font-weight: 600;
  text-align: center;
}
.timeline-text { flex: 1; padding-top: 2px; }

/* =========================================================================
   CARDS (menu, station, recipe step)
   ========================================================================= */
.card {
  background: white;
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(42, 37, 34, 0.08);
}
.card-img { aspect-ratio: 4/3; object-fit: cover; width: 100%; }
.card-body { padding: var(--sp-4); }
.card-body h3 { margin: 0 0 var(--sp-2); }
.card-body p { color: var(--color-muted); font-size: var(--fs-14); margin: 0; }

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
}
@media (min-width: 700px) {
  .menu-grid { grid-template-columns: repeat(3, 1fr); }
}

.station-card {
  display: block;
  background: white;
  border-radius: var(--r-md);
  border-left: 4px solid var(--color-terracotta);
  padding: var(--sp-4);
  text-decoration: none;
  color: var(--color-ink);
  margin-bottom: var(--sp-3);
  box-shadow: 0 1px 4px rgba(42,37,34,0.06);
}
.station-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(42,37,34,0.10); text-decoration: none; }
.station-card h3 { margin: 0 0 var(--sp-1); font-size: var(--fs-18); }
.station-card .meta { color: var(--color-muted); font-size: var(--fs-14); }

/* =========================================================================
   RECIPE STEPS (per station)
   ========================================================================= */
.recipe-step {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
  padding: var(--sp-5) 0;
  border-bottom: 1px solid var(--color-line);
}
@media (min-width: 600px) {
  .recipe-step { grid-template-columns: 220px 1fr; gap: var(--sp-5); align-items: start; }
}
.recipe-step .step-num {
  font-family: var(--font-display);
  font-size: var(--fs-28);
  color: var(--color-terracotta);
  margin-bottom: var(--sp-1);
}
.recipe-step img { border-radius: var(--r-sm); aspect-ratio: 4/3; object-fit: cover; }

.callout {
  background: var(--color-cream-deep);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  margin: var(--sp-5) 0;
}
.callout h4 { margin: 0 0 var(--sp-2); font-family: var(--font-body); font-weight: 700; font-size: var(--fs-14); letter-spacing: 0.08em; text-transform: uppercase; }
.callout ul, .callout ol { margin: 0; padding-left: var(--sp-5); }

.checklist { list-style: none; padding: 0; }
.checklist li { padding: var(--sp-2) 0; display: flex; align-items: flex-start; gap: var(--sp-3); }
.checklist li::before { content: "☐"; font-size: var(--fs-22); color: var(--color-terracotta); flex: 0 0 auto; }

/* =========================================================================
   NAV / FOOTER
   ========================================================================= */
.site-nav {
  display: flex; gap: var(--sp-4); justify-content: center;
  padding: var(--sp-4) var(--sp-5);
  font-size: var(--fs-14);
  border-bottom: 1px solid var(--color-line);
}
.site-nav a { color: var(--color-muted); }
.site-nav a.active { color: var(--color-ink); font-weight: 600; }

.site-footer {
  text-align: center;
  padding: var(--sp-7) var(--sp-5);
  font-size: var(--fs-14);
  color: var(--color-muted);
}

/* =========================================================================
   PRINT
   ========================================================================= */
@media print {
  body { background: white; color: black; font-size: 11pt; }
  .site-nav, .site-footer, .hero { background: white !important; color: black !important; }
  .hero { padding: 0 0 var(--sp-4); border-bottom: 2px solid black; }
  .hero h1 { color: black; }
  .station-card, .card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
  .recipe-step { break-inside: avoid; }
  a { color: black; text-decoration: none; }
  a::after { content: ""; }
  img { max-height: 200px; }
}
```

- [ ] **Step 2: Create a placeholder `index.html` to verify the CSS loads**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Design check</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
  <section class="hero">
    <div class="eyebrow">Sunday · May 10 · 2026</div>
    <h1>Design check</h1>
    <div class="meta">If you can read this in Fraunces + Inter, the system is wired up.</div>
  </section>
  <section class="section">
    <div class="container">
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>Body text. <a href="#">A link</a> styled.</p>
      <div class="menu-grid">
        <div class="card"><div class="card-body"><h3>Card</h3><p>Description.</p></div></div>
        <div class="card"><div class="card-body"><h3>Card</h3><p>Description.</p></div></div>
        <div class="card"><div class="card-body"><h3>Card</h3><p>Description.</p></div></div>
      </div>
    </div>
  </section>
</body>
</html>
```

- [ ] **Step 3: Verification**

```bash
python3 -m http.server 8000 &
```

Open `http://localhost:8000/`. Verify: warm terracotta hero, Fraunces serif heading, Inter body, three white cards in a 3-column grid on desktop, 2-column on mobile (resize window to verify). No console errors.

- [ ] **Step 4: Commit**

```bash
git add assets/css/site.css index.html
git commit -m "feat: add design system CSS and placeholder index"
```

---

## Task 2: Photo Sourcing — Menu Items

**Files:**
- Create: `assets/img/menu/egg-tacos.jpg`
- Create: `assets/img/menu/chicken.jpg`
- Create: `assets/img/menu/prawns.jpg`
- Create: `assets/img/menu/mushroom-poblano.jpg`
- Create: `assets/img/menu/esquites.jpg`
- Create: `assets/img/menu/rice.jpg`
- Create: `assets/img/menu/beans.jpg`
- Create: `assets/img/menu/chips-salsa.jpg`
- Create: `assets/img/menu/margarita.jpg`
- Create: `assets/img/menu/paloma.jpg`
- Create: `assets/img/menu/agua-fresca.jpg`
- Create: `assets/img/menu/lager.jpg`
- Create: `assets/img/menu/tres-leches.jpg`

- [ ] **Step 1: Create the menu image directory**

```bash
mkdir -p assets/img/menu
```

- [ ] **Step 2: Source 13 photos from Unsplash**

For each row in the table below: search `https://unsplash.com/s/photos/<keyword>`, pick the first photo that is unmistakably the item (well-lit, not over-stylized), download to the listed path, then run `sips -Z 1200 <path>`.

| File | Search keyword(s) | Notes |
|---|---|---|
| `egg-tacos.jpg` | "breakfast tacos" | scrambled egg + cheese in flour tortilla |
| `chicken.jpg` | "achiote chicken tacos" or "grilled chicken tacos" | sliced grilled chicken on tortilla |
| `prawns.jpg` | "shrimp tacos" | grilled shrimp w/ cabbage slaw |
| `mushroom-poblano.jpg` | "mushroom tacos" | dark mushroom filling |
| `esquites.jpg` | "esquites" or "mexican street corn salad" | cup of corn salad |
| `rice.jpg` | "cilantro lime rice" | green-flecked white rice |
| `beans.jpg` | "black beans bowl" | black beans in a small dish |
| `chips-salsa.jpg` | "chips and salsa" | tortilla chips with red salsa |
| `margarita.jpg` | "classic margarita" | salt-rimmed glass |
| `paloma.jpg` | "paloma cocktail" | grapefruit cocktail |
| `agua-fresca.jpg` | "watermelon agua fresca" | pink drink in pitcher/glass |
| `lager.jpg` | "mexican beer" | clear/amber bottle |
| `tres-leches.jpg` | "tres leches cake" | cake slice with cream |

- [ ] **Step 3: Verification**

```bash
ls -lh assets/img/menu/
```

Expect 13 JPG files, each well under 500KB. Open one in Preview to confirm it's the correct subject.

- [ ] **Step 4: Commit**

```bash
git add assets/img/menu/
git commit -m "feat: add menu photos from Unsplash"
```

---

## Task 3: Home Page (`index.html`)

**Files:**
- Modify: `index.html` (replace placeholder)

- [ ] **Step 1: Replace `index.html` with the home page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mother's Day Taco Brunch · May 10, 2026</title>
  <meta name="description" content="The plan and menu for Mother's Day brunch.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
  <header class="hero">
    <div class="eyebrow">Sunday · May 10 · 2026</div>
    <h1>Mother's Day Taco Brunch</h1>
    <div class="meta">Backyard · Brunch served at 12:30 pm</div>
  </header>

  <main>
    <section class="section">
      <div class="container">
        <h2>The Plan</h2>
        <div class="timeline">
          <div class="timeline-row">
            <div class="timeline-time">10:30</div>
            <div class="timeline-text">Everyone arrives. Drinks in hand. Music on in the backyard and ADU. Helpers gather in the kitchen.</div>
          </div>
          <div class="timeline-row">
            <div class="timeline-time">11:00</div>
            <div class="timeline-text">Hangout time. Sun, music, conversation. Aroma builds from the kitchen.</div>
          </div>
          <div class="timeline-row">
            <div class="timeline-time">12:30</div>
            <div class="timeline-text">Brunch served — taco bar opens. Build your perfect plate.</div>
          </div>
          <div class="timeline-row">
            <div class="timeline-time">1:30</div>
            <div class="timeline-text">Toast to the moms. Tres leches and berries.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--color-cream-deep);">
      <div class="container">
        <h2>The Menu</h2>
        <p style="color: var(--color-muted);">A taco bar with four fillings, sides, and a full toppings spread.</p>
        <div class="menu-grid">
          <div class="card">
            <img class="card-img" src="assets/img/menu/egg-tacos.jpg" alt="Austin breakfast taco with eggs and potato">
            <div class="card-body"><h3>Egg Tacos</h3><p>Eggs · cheese · crispy potato · flour tortilla</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/chicken.jpg" alt="Achiote grilled chicken tacos">
            <div class="card-body"><h3>Achiote Chicken</h3><p>Smoky · grilled · sliced thigh</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/prawns.jpg" alt="Chipotle garlic prawns">
            <div class="card-body"><h3>Chipotle Prawns</h3><p>Garlic · lime · cabbage slaw</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/mushroom-poblano.jpg" alt="Mushroom and poblano filling">
            <div class="card-body"><h3>Mushroom + Poblano</h3><p>Vegetarian · smoky · savory</p></div>
          </div>
        </div>
        <p style="text-align:center; margin-top: var(--sp-5);"><a href="menu.html">See the full menu →</a></p>
      </div>
    </section>

    <section class="section">
      <div class="container" style="text-align:center;">
        <p class="eyebrow">For the helpers</p>
        <p>If you're cooking on Sunday, your station, timeline, and recipe are ready for you.</p>
        <p><a href="helpers.html">Go to your station →</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>Made with love for the moms · May 10, 2026</p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification**

Visit `http://localhost:8000/`. Verify:
- Hero is warm terracotta with Sunday date and 12:30 pm time
- Plan timeline shows 4 rows with pill-shaped time tags
- Menu preview shows 4 photo cards, 2 columns on mobile, ≥3 columns on wider screens
- Bottom "For the helpers" section visible
- Resize to ~393px wide: no horizontal scroll, type still readable, cards stack to 2 columns

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: home page with plan timeline and menu preview"
```

---

## Task 4: Menu Page (`menu.html`)

**Files:**
- Create: `menu.html`

- [ ] **Step 1: Create `menu.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Menu · Mother's Day Brunch</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="index.html">The Plan</a>
    <a href="menu.html" class="active">Menu</a>
    <a href="helpers.html">Helpers</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">The Menu</div>
    <h1 style="font-size: var(--fs-36);">Taco Bar · 4 Fillings</h1>
  </header>

  <main>
    <section class="section">
      <div class="container">
        <h2>Fillings</h2>
        <div class="menu-grid">
          <div class="card">
            <img class="card-img" src="assets/img/menu/egg-tacos.jpg" alt="Austin breakfast taco">
            <div class="card-body"><h3>Egg Tacos (Austin style)</h3><p>Soft scrambled eggs with cheese and crispy potatoes on warm flour tortillas.</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/chicken.jpg" alt="Achiote chicken">
            <div class="card-body"><h3>Achiote Grilled Chicken</h3><p>Boneless thigh, marinated in achiote, lime, and garlic, grilled and sliced.</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/prawns.jpg" alt="Chipotle garlic prawns">
            <div class="card-body"><h3>Chipotle-Garlic Prawns</h3><p>Big shrimp, smoky and bright, with a cool cabbage-lime slaw.</p></div>
          </div>
          <div class="card">
            <img class="card-img" src="assets/img/menu/mushroom-poblano.jpg" alt="Mushroom and poblano">
            <div class="card-body"><h3>Mushroom + Poblano (vegetarian)</h3><p>Cremini mushrooms with charred poblano and onion. Meaty and savory.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--color-cream-deep);">
      <div class="container">
        <h2>Sides</h2>
        <div class="menu-grid">
          <div class="card"><img class="card-img" src="assets/img/menu/esquites.jpg" alt="Esquites"><div class="card-body"><h3>Esquites</h3><p>Mexican street corn salad with lime and cotija.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/rice.jpg" alt="Cilantro-lime rice"><div class="card-body"><h3>Cilantro-Lime Rice</h3><p>Fluffy long-grain rice with bright lime and herbs.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/beans.jpg" alt="Black beans"><div class="card-body"><h3>Black Beans</h3><p>Simmered with onion, garlic, and cumin.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/chips-salsa.jpg" alt="Chips and salsa"><div class="card-body"><h3>Chips + Salsa</h3><p>Two salsas — one mild, one with bite.</p></div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Toppings Bar</h2>
        <p>Build it your way: pico de gallo · guacamole · queso fresco · shredded lettuce · sour cream · lime wedges · cilantro · pickled red onions · salsa verde · hot sauce. Both corn and flour tortillas warmed on the griddle.</p>
      </div>
    </section>

    <section class="section" style="background: var(--color-cream-deep);">
      <div class="container">
        <h2>Drinks</h2>
        <div class="menu-grid">
          <div class="card"><img class="card-img" src="assets/img/menu/margarita.jpg" alt="Classic margarita"><div class="card-body"><h3>Pitcher Margaritas</h3><p>Classic, salted rim.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/paloma.jpg" alt="Paloma"><div class="card-body"><h3>Palomas</h3><p>Tequila with grapefruit and lime.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/agua-fresca.jpg" alt="Watermelon agua fresca"><div class="card-body"><h3>Watermelon Agua Fresca</h3><p>Cold, pink, no alcohol — for kids and the curious.</p></div></div>
          <div class="card"><img class="card-img" src="assets/img/menu/lager.jpg" alt="Mexican lager"><div class="card-body"><h3>Mexican Lagers</h3><p>Cooler full, ice cold.</p></div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Dessert</h2>
        <div class="menu-grid" style="grid-template-columns: 1fr;">
          <div class="card" style="display: grid; grid-template-columns: 200px 1fr; gap: 0;">
            <img class="card-img" src="assets/img/menu/tres-leches.jpg" alt="Tres leches cake" style="aspect-ratio: 1/1;">
            <div class="card-body"><h3>Tres Leches + Berries</h3><p>From the bakery. With fresh strawberries and blueberries.</p></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="index.html">← Back to the plan</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification**

Visit `http://localhost:8000/menu.html`. Verify all 12 photos load, sections (Fillings, Sides, Toppings Bar, Drinks, Dessert) read clearly, mobile view stacks 2-column.

- [ ] **Step 3: Commit**

```bash
git add menu.html
git commit -m "feat: menu page with photo cards for each dish"
```

---

## Task 5: Helpers Index Page (`helpers.html`)

**Files:**
- Create: `helpers.html`
- Create: `helpers/` directory

- [ ] **Step 1: Create `helpers/` directory**

```bash
mkdir -p helpers
```

- [ ] **Step 2: Create `helpers.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Helpers · Mother's Day Brunch</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="index.html">The Plan</a>
    <a href="menu.html">Menu</a>
    <a href="helpers.html" class="active">Helpers</a>
  </nav>

  <header class="hero" style="background: linear-gradient(135deg, var(--color-charcoal), var(--color-terracotta-deep));">
    <div class="eyebrow">For the cooks</div>
    <h1 style="font-size: var(--fs-36);">Pick Your Station</h1>
    <div class="meta">5 stations · arrive at 10:30 · brunch served 12:30</div>
  </header>

  <main>
    <section class="section">
      <div class="container">
        <a class="station-card" href="helpers/station-1-eggs.html">
          <h3>🍳 Station 1 — Egg Tacos</h3>
          <div class="meta">Active 11:45 – 12:30 · Easy · Cooked à la minute</div>
        </a>
        <a class="station-card" href="helpers/station-2-chicken.html">
          <h3>🔥 Station 2 — Achiote Grilled Chicken</h3>
          <div class="meta">Marinate 10:30 · Grill 12:00 · Slice 12:20</div>
        </a>
        <a class="station-card" href="helpers/station-3-prawns.html">
          <h3>🍤 Station 3 — Chipotle-Garlic Prawns</h3>
          <div class="meta">Active 12:10 – 12:25 · Fast · Last to cook</div>
        </a>
        <a class="station-card" href="helpers/station-4-veg-sides.html">
          <h3>🍄 Station 4 — Mushroom + Veg Sides</h3>
          <div class="meta">Active 11:00 – 12:25 · Mushroom filling, esquites, rice, beans</div>
        </a>
        <a class="station-card" href="helpers/station-5-bar-toppings.html">
          <h3>🍹 Station 5 — Bar + Toppings</h3>
          <div class="meta">Active 11:00 – 12:30 · Pico, guac, drinks, tortilla warming</div>
        </a>
      </div>
    </section>

    <section class="section" style="background: var(--color-cream-deep);">
      <div class="container">
        <h2>Master Timeline</h2>
        <p style="color: var(--color-muted);">When each station is active across the morning.</p>
        <table style="width:100%; border-collapse: collapse; margin-top: var(--sp-4); font-size: var(--fs-14);">
          <thead>
            <tr style="border-bottom: 2px solid var(--color-line);">
              <th style="text-align:left; padding: var(--sp-2);">Time</th>
              <th style="text-align:left; padding: var(--sp-2);">What's happening</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">10:30</td><td style="padding: var(--sp-2);">All cooks arrive. Stations 2, 4, 5 begin prep. Chicken into marinade.</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">11:00</td><td style="padding: var(--sp-2);">Station 4: start mushroom + sides. Station 5: pico, guac, drinks setup.</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">11:30</td><td style="padding: var(--sp-2);">Light the grill. Tortilla warming station ready.</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">11:45</td><td style="padding: var(--sp-2);">Station 1: eggs prep starts (cook just before serving).</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">12:00</td><td style="padding: var(--sp-2);">Chicken on the grill (~6 min/side).</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">12:10</td><td style="padding: var(--sp-2);">Station 3: prawns on the griddle (2 min/side).</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line);"><td style="padding: var(--sp-2); font-weight:600;">12:20</td><td style="padding: var(--sp-2);">Chicken rests, gets sliced. Toppings bar plated.</td></tr>
            <tr style="border-bottom: 1px solid var(--color-line); background: var(--color-cream);"><td style="padding: var(--sp-2); font-weight:700; color: var(--color-terracotta-deep);">12:30</td><td style="padding: var(--sp-2); font-weight:600;">Brunch served — taco bar opens.</td></tr>
            <tr><td style="padding: var(--sp-2); font-weight:600;">1:30</td><td style="padding: var(--sp-2);">Toast to the moms · tres leches + berries.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="container" style="text-align:center;">
        <p class="eyebrow">Before Sunday</p>
        <p>The full shopping list, grouped by store section.</p>
        <p><a href="shopping.html">→ Open the shopping list</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="index.html">← Back to the plan</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Verification**

Visit `http://localhost:8000/helpers.html`. Verify: 5 station cards with terracotta accent, master timeline table, link to shopping list. Mobile: cards stack, table is readable.

- [ ] **Step 4: Commit**

```bash
git add helpers.html
git commit -m "feat: helpers index with stations and master timeline"
```

---

## Task 6: Shopping List Page (`shopping.html`)

**Files:**
- Create: `shopping.html`

- [ ] **Step 1: Create `shopping.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shopping List · Mother's Day Brunch</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="index.html">The Plan</a>
    <a href="menu.html">Menu</a>
    <a href="helpers.html">Helpers</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">For the host</div>
    <h1 style="font-size: var(--fs-36);">Shopping List</h1>
    <div class="meta">For 15 people · Sunday morning prep</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <h2>Produce</h2>
        <ul class="checklist">
          <li>4 large limes (zest + juice across recipes)</li>
          <li>2 lb yellow onions (~3 medium)</li>
          <li>1 lb red onions (~2 medium, for pickling + pico)</li>
          <li>3 large poblano peppers</li>
          <li>1 jalapeño</li>
          <li>1.5 lb roma tomatoes (~6, for pico)</li>
          <li>2 large bunches cilantro</li>
          <li>1 head iceberg or romaine (shredded lettuce)</li>
          <li>1 small head red cabbage (slaw for prawns)</li>
          <li>1 lb cremini or baby bella mushrooms</li>
          <li>1.5 lb yukon gold potatoes (for egg tacos)</li>
          <li>2 garlic heads (~12 cloves used)</li>
          <li>3 ripe avocados (for guacamole)</li>
          <li>1 small watermelon (~4 lb, for agua fresca)</li>
          <li>1 lb strawberries</li>
          <li>1 pint blueberries</li>
          <li>2 ears corn OR 1 lb frozen corn (esquites)</li>
          <li>1 pink grapefruit OR 6-pack grapefruit soda (palomas)</li>
        </ul>

        <h2>Meat / Seafood</h2>
        <ul class="checklist">
          <li>2 lb boneless skinless chicken thighs</li>
          <li>1.5 lb large peeled, deveined shrimp (16/20 count)</li>
        </ul>

        <h2>Dairy / Eggs</h2>
        <ul class="checklist">
          <li>2 dozen eggs</li>
          <li>1 lb shredded Monterey Jack or Oaxaca cheese</li>
          <li>8 oz queso fresco</li>
          <li>16 oz sour cream or Mexican crema</li>
          <li>1 stick butter</li>
        </ul>

        <h2>Pantry</h2>
        <ul class="checklist">
          <li>Achiote paste (3 oz pack — for chicken marinade)</li>
          <li>Chipotles in adobo (small can — for prawns)</li>
          <li>2 cans (15 oz) black beans</li>
          <li>2 lb long-grain white rice</li>
          <li>Olive oil</li>
          <li>Kosher salt, black pepper</li>
          <li>Smoked paprika, cumin, dried oregano</li>
          <li>White vinegar (for pickled onions)</li>
          <li>2 large bags tortilla chips</li>
          <li>2 jars salsa (one mild, one hot) OR roja + verde</li>
          <li>1 jar salsa verde for the toppings bar</li>
          <li>Hot sauce (2-3 bottles, variety)</li>
          <li>Cotija cheese (for esquites)</li>
        </ul>

        <h2>Tortillas</h2>
        <ul class="checklist">
          <li>30 corn tortillas (small)</li>
          <li>20 flour tortillas (small/medium — for egg tacos)</li>
        </ul>

        <h2>Drinks / Bar</h2>
        <ul class="checklist">
          <li>1 bottle blanco tequila (750ml or 1L)</li>
          <li>1 bottle triple sec / orange liqueur</li>
          <li>1 large bottle margarita mix OR fresh lime + simple syrup</li>
          <li>4-pack grapefruit soda (Squirt or Jarritos) for palomas</li>
          <li>1 case Mexican lager (Modelo, Pacifico, or similar)</li>
          <li>Coarse salt for margarita rims</li>
          <li>Extra ice (2 bags)</li>
        </ul>

        <h2>Bakery / Bought</h2>
        <ul class="checklist">
          <li>Tres leches cake — serves 15 (call the bakery in advance)</li>
        </ul>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="helpers.html">← Back to helpers</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification**

Visit `http://localhost:8000/shopping.html`. Verify: 8 sections each with checkbox list, prints cleanly (Cmd+P → preview should be ~1-2 pages).

- [ ] **Step 3: Commit**

```bash
git add shopping.html
git commit -m "feat: shopping list grouped by aisle for 15"
```

---

## Task 7: Photo Sourcing — Recipe Steps

The 5 station pages each need photos for their recipe steps. Source them all in one task to amortize the search overhead.

**Files:**
- Create: `assets/img/recipes/eggs-*.jpg` (4 photos)
- Create: `assets/img/recipes/chicken-*.jpg` (5 photos)
- Create: `assets/img/recipes/prawns-*.jpg` (4 photos)
- Create: `assets/img/recipes/mushroom-*.jpg` (4 photos)
- Create: `assets/img/recipes/sides-*.jpg` (4 photos for esquites/rice/beans/pico/guac etc.)
- Create: `assets/img/recipes/bar-*.jpg` (3 photos)

- [ ] **Step 1: Create the directory**

```bash
mkdir -p assets/img/recipes
```

- [ ] **Step 2: Source 24 step photos**

For each row: same Unsplash workflow as Task 2 — search, pick first clear match, download, run `sips -Z 1200 <path>`.

| File | Search keyword |
|---|---|
| `eggs-1-potatoes.jpg` | "diced potatoes pan" |
| `eggs-2-scramble.jpg` | "scrambled eggs pan" |
| `eggs-3-tortilla-griddle.jpg` | "warming tortillas griddle" |
| `eggs-4-final.jpg` | "breakfast tacos plated" |
| `chicken-1-marinade.jpg` | "marinade bowl chicken" |
| `chicken-2-coat.jpg` | "marinated chicken thighs" |
| `chicken-3-grill.jpg` | "chicken thighs grill" |
| `chicken-4-rest.jpg` | "grilled chicken resting" |
| `chicken-5-slice.jpg` | "sliced grilled chicken" |
| `prawns-1-marinade.jpg` | "shrimp in marinade bowl" |
| `prawns-2-griddle.jpg` | "shrimp on griddle" |
| `prawns-3-curl.jpg` | "cooked shrimp pan" |
| `prawns-4-slaw.jpg` | "cabbage lime slaw" |
| `mushroom-1-prep.jpg` | "sliced mushrooms onion" |
| `mushroom-2-poblano.jpg` | "charred poblano peppers" |
| `mushroom-3-saute.jpg` | "mushrooms sautéing" |
| `mushroom-4-final.jpg` | "mushroom taco filling" |
| `sides-pico.jpg` | "pico de gallo fresh" |
| `sides-guac.jpg` | "guacamole bowl" |
| `sides-rice.jpg` | "cilantro lime rice pot" |
| `sides-beans.jpg` | "black beans simmering" |
| `bar-margarita-pitcher.jpg` | "margarita pitcher" |
| `bar-tortilla-warming.jpg` | "tortilla warmer basket" |
| `bar-toppings-spread.jpg` | "taco bar toppings" |

- [ ] **Step 3: Verification**

```bash
ls assets/img/recipes/ | wc -l
```

Expect 24. Spot-check a couple to confirm they match.

- [ ] **Step 4: Commit**

```bash
git add assets/img/recipes/
git commit -m "feat: add recipe step photos from Unsplash"
```

---

## Task 8: Station 1 — Egg Tacos (`helpers/station-1-eggs.html`)

**Files:**
- Create: `helpers/station-1-eggs.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Station 1: Egg Tacos · Helpers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="../index.html">The Plan</a>
    <a href="../menu.html">Menu</a>
    <a href="../helpers.html">All stations</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">Station 1 · Egg Tacos</div>
    <h1 style="font-size: var(--fs-36);">Austin Breakfast Tacos</h1>
    <div class="meta">Cook: ____________ · Active 11:45 – 12:30 · Cooked fresh as guests arrive</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <div class="callout">
          <h4>⏱ Your Timeline</h4>
          <ol>
            <li><strong>11:45</strong> — Wash and dice potatoes, start them frying</li>
            <li><strong>12:00</strong> — Crack and whisk eggs (don't cook yet)</li>
            <li><strong>12:15</strong> — Set out flour tortillas, warm cheese</li>
            <li><strong>12:25</strong> — Cook eggs in batches (15 at a time)</li>
            <li><strong>12:30</strong> — Plate and bring to the bar; cook fresh batches as needed</li>
          </ol>
        </div>

        <h2>Ingredients (for 15 people)</h2>
        <ul class="checklist">
          <li>2 dozen eggs (24)</li>
          <li>1.5 lb yukon gold potatoes, ¼-inch dice</li>
          <li>2 cups shredded Monterey Jack or Oaxaca cheese</li>
          <li>20 small flour tortillas (warm on griddle)</li>
          <li>4 tbsp butter</li>
          <li>2 tbsp olive oil</li>
          <li>Kosher salt, black pepper</li>
          <li>Optional: 1 tsp smoked paprika for the potatoes</li>
        </ul>

        <h2>Equipment</h2>
        <ul>
          <li>One large nonstick skillet (12-inch) for eggs</li>
          <li>One cast iron skillet or heavy pan for potatoes</li>
          <li>Whisk, large bowl</li>
          <li>Plates or warm tray for finished food</li>
        </ul>

        <h2>Steps</h2>

        <div class="recipe-step">
          <img src="../assets/img/recipes/eggs-1-potatoes.jpg" alt="Diced potatoes browning in a pan">
          <div>
            <div class="step-num">1</div>
            <h3>Crisp the potatoes</h3>
            <p>Heat 2 tbsp olive oil in the cast iron pan over medium-high. When it shimmers, add the diced potatoes in a single layer. Don't crowd — work in two batches if needed. Sprinkle with salt and (if using) smoked paprika.</p>
            <p>Cook undisturbed for 4 minutes — let them brown. Then toss and cook another 5-7 minutes until golden and crispy. Move to a paper-towel-lined plate.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/eggs-2-scramble.jpg" alt="Eggs scrambling in a pan">
          <div>
            <div class="step-num">2</div>
            <h3>Whisk the eggs</h3>
            <p>Crack all 24 eggs into a big bowl. Add 1 tsp salt and a few cracks of black pepper. Whisk until uniform yellow, no streaks. Don't cook them yet — wait until 12:25.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/eggs-3-tortilla-griddle.jpg" alt="Tortillas warming on a griddle">
          <div>
            <div class="step-num">3</div>
            <h3>Cook eggs in batches</h3>
            <p>Heat 1 tbsp butter in the big nonstick over <em>medium-low</em> (not high — that makes rubbery eggs). Pour in about ⅓ of the egg mixture. Let it set for 30 seconds, then gently push from the edges to the center with a spatula. Stop while still slightly wet — they'll finish cooking on the plate.</p>
            <p>Slide onto a plate, sprinkle with cheese and a handful of crispy potatoes. Repeat for batches 2 and 3 as guests arrive.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/eggs-4-final.jpg" alt="Finished egg tacos plated">
          <div>
            <div class="step-num">4</div>
            <h3>Bring it to the bar</h3>
            <p>Set warm flour tortillas next to the eggs and potatoes. Guests build their own (egg + potato + cheese, then to the toppings bar for salsa).</p>
          </div>
        </div>

        <div class="callout">
          <h4>🚨 Help! Something's wrong</h4>
          <ul>
            <li><strong>Eggs went rubbery.</strong> Heat too high or cooked too long. Lower heat next batch and pull off when still slightly wet.</li>
            <li><strong>Potatoes are soggy.</strong> Pan was too crowded or not hot enough. Spread out next batch, more oil, higher heat.</li>
            <li><strong>Tortillas are stiff.</strong> Wrap in a damp towel and microwave 30 sec, or warm on the griddle 15 sec/side.</li>
          </ul>
        </div>

        <div class="callout">
          <h4>✅ Final checklist</h4>
          <ul class="checklist">
            <li>Potatoes cooked and held warm</li>
            <li>Eggs cooked fresh (not held more than 5 min)</li>
            <li>Tortillas warmed and wrapped</li>
            <li>Cheese set out next to eggs</li>
          </ul>
        </div>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="../helpers.html">← All stations</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification**

Visit `http://localhost:8000/helpers/station-1-eggs.html`. Verify: hero shows station name + cook line, timeline callout, ingredients, 4 recipe steps with photos, troubleshooting callout, final checklist. Print preview is one usable sheet.

- [ ] **Step 3: Commit**

```bash
git add helpers/station-1-eggs.html
git commit -m "feat: station 1 (egg tacos) recipe page"
```

---

## Task 9: Station 2 — Achiote Chicken (`helpers/station-2-chicken.html`)

**Files:**
- Create: `helpers/station-2-chicken.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Station 2: Achiote Chicken · Helpers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="../index.html">The Plan</a>
    <a href="../menu.html">Menu</a>
    <a href="../helpers.html">All stations</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">Station 2 · Grilled Chicken</div>
    <h1 style="font-size: var(--fs-36);">Achiote Grilled Chicken</h1>
    <div class="meta">Cook: ____________ · Marinate 10:30 · Grill 12:00 · Slice 12:20</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <div class="callout">
          <h4>⏱ Your Timeline</h4>
          <ol>
            <li><strong>10:30</strong> — Mix marinade in a big bowl</li>
            <li><strong>10:40</strong> — Coat chicken thighs, refrigerate (75 min in marinade)</li>
            <li><strong>11:30</strong> — Light the grill, get it to medium-high</li>
            <li><strong>12:00</strong> — Grill chicken: ~6 min per side</li>
            <li><strong>12:15</strong> — Pull off, rest 5 min, slice against the grain</li>
            <li><strong>12:25</strong> — Plate on a warm platter, bring to the bar</li>
          </ol>
        </div>

        <h2>Ingredients (for 15 people)</h2>
        <ul class="checklist">
          <li>2 lb boneless skinless chicken thighs (≈ 8 thighs)</li>
          <li>3 tbsp achiote (annatto) paste</li>
          <li>Juice of 2 limes (~¼ cup)</li>
          <li>4 garlic cloves, minced or grated</li>
          <li>¼ cup olive oil</li>
          <li>1 tsp dried oregano</li>
          <li>½ tsp ground cumin</li>
          <li>1 tsp kosher salt</li>
          <li>½ tsp black pepper</li>
        </ul>

        <h2>Equipment</h2>
        <ul>
          <li>Outdoor grill</li>
          <li>Large mixing bowl + whisk</li>
          <li>Tongs</li>
          <li>Cutting board + sharp knife</li>
          <li>Warm platter for sliced chicken</li>
          <li>Instant-read thermometer (recommended)</li>
        </ul>

        <h2>Steps</h2>

        <div class="recipe-step">
          <img src="../assets/img/recipes/chicken-1-marinade.jpg" alt="Achiote marinade in a bowl">
          <div>
            <div class="step-num">1</div>
            <h3>Mix the marinade</h3>
            <p>In a big bowl, whisk together: achiote paste, lime juice, garlic, olive oil, oregano, cumin, salt, pepper. Mix until the paste fully dissolves into a smooth red-orange sauce. It will look like a thick vinaigrette.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/chicken-2-coat.jpg" alt="Marinated chicken thighs">
          <div>
            <div class="step-num">2</div>
            <h3>Coat the chicken</h3>
            <p>Pat thighs dry with paper towels (this helps the marinade stick). Add chicken to the bowl, toss with your hands or tongs until every piece is coated. Cover with plastic wrap and refrigerate. Aim for ≥ 60 minutes; longer is fine up to 4 hours.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/chicken-3-grill.jpg" alt="Chicken thighs on the grill">
          <div>
            <div class="step-num">3</div>
            <h3>Grill</h3>
            <p>Light the grill at 11:30. Grill should be medium-high — you can hold your hand 5 inches above the grate for about 3 seconds before pulling away.</p>
            <p>At 12:00, lay thighs on the grill, smooth side down. Don't move them for 6 minutes — let them get good grill marks. Flip with tongs, grill another 5-6 minutes.</p>
            <p><strong>Done temp:</strong> 165°F internal (or juices run clear when pierced at the thickest part).</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/chicken-4-rest.jpg" alt="Resting grilled chicken">
          <div>
            <div class="step-num">4</div>
            <h3>Rest</h3>
            <p>Move chicken to a cutting board. Tent loosely with foil. Walk away for 5 minutes — this is critical. If you cut now, all the juice runs out and the chicken dries out.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/chicken-5-slice.jpg" alt="Sliced grilled chicken">
          <div>
            <div class="step-num">5</div>
            <h3>Slice and plate</h3>
            <p>Slice each thigh across the grain (the lines of the meat) into ½-inch strips. Pile on a warm platter. Drizzle any board juices back over the meat. Bring to the bar.</p>
          </div>
        </div>

        <div class="callout">
          <h4>🚨 Help! Something's wrong</h4>
          <ul>
            <li><strong>Sticking to the grate.</strong> Don't try to move it yet. Wait another minute and it will release naturally when ready.</li>
            <li><strong>Outside burning before inside cooks.</strong> Move chicken to a cooler part of the grill (or close the lid with vents partially open) to finish slower.</li>
            <li><strong>Chicken looks dry.</strong> Slice a thicker piece in half — pink near the bone is bad, but a hint of pink throughout cooked meat is fine. Use the thermometer (165°F).</li>
            <li><strong>No achiote paste available.</strong> Substitute: 2 tbsp paprika + 1 tbsp tomato paste + ½ tsp turmeric. Same color, similar earthy flavor.</li>
          </ul>
        </div>

        <div class="callout">
          <h4>✅ Final checklist</h4>
          <ul class="checklist">
            <li>Chicken hit 165°F internal</li>
            <li>Rested 5 minutes minimum</li>
            <li>Sliced against the grain</li>
            <li>Plated on warm platter, juices over the top</li>
          </ul>
        </div>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="../helpers.html">← All stations</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification**

Visit `http://localhost:8000/helpers/station-2-chicken.html`. Verify timeline + 5 steps with photos + troubleshooting + checklist render. Print preview clean.

- [ ] **Step 3: Commit**

```bash
git add helpers/station-2-chicken.html
git commit -m "feat: station 2 (chicken) recipe page"
```

---

## Task 10: Station 3 — Prawns (`helpers/station-3-prawns.html`)

**Files:**
- Create: `helpers/station-3-prawns.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Station 3: Prawns · Helpers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="../index.html">The Plan</a>
    <a href="../menu.html">Menu</a>
    <a href="../helpers.html">All stations</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">Station 3 · Prawns</div>
    <h1 style="font-size: var(--fs-36);">Chipotle-Garlic Prawns</h1>
    <div class="meta">Cook: ____________ · Active 12:10 – 12:25 · Last protein on, fastest to cook</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <div class="callout">
          <h4>⏱ Your Timeline</h4>
          <ol>
            <li><strong>11:30</strong> — Make the cabbage slaw, refrigerate</li>
            <li><strong>11:45</strong> — Make the chipotle marinade, mix with shrimp, leave 15-20 min</li>
            <li><strong>12:10</strong> — Heat cast iron griddle (or skillet) screaming hot</li>
            <li><strong>12:15</strong> — Sear shrimp 2 min per side</li>
            <li><strong>12:25</strong> — Plate with slaw on the side</li>
          </ol>
        </div>

        <h2>Ingredients (for 15 people)</h2>
        <p><strong>Shrimp</strong></p>
        <ul class="checklist">
          <li>1.5 lb large peeled, deveined shrimp (16/20 count, tails on or off)</li>
          <li>1-2 chipotles in adobo (from a small can), finely minced + 1 tbsp adobo sauce</li>
          <li>4 garlic cloves, minced</li>
          <li>2 tbsp olive oil</li>
          <li>Juice of 1 lime</li>
          <li>1 tsp smoked paprika</li>
          <li>1 tsp kosher salt</li>
        </ul>
        <p><strong>Cabbage-lime slaw</strong></p>
        <ul class="checklist">
          <li>½ small head red cabbage, finely shredded (~4 cups)</li>
          <li>Juice of 1 lime</li>
          <li>2 tbsp olive oil</li>
          <li>½ tsp salt</li>
          <li>Handful chopped cilantro</li>
        </ul>

        <h2>Equipment</h2>
        <ul>
          <li>Cast iron griddle (preferred) or heavy skillet</li>
          <li>Two mixing bowls</li>
          <li>Tongs</li>
          <li>Sharp knife + cutting board</li>
        </ul>

        <h2>Steps</h2>

        <div class="recipe-step">
          <img src="../assets/img/recipes/prawns-4-slaw.jpg" alt="Cabbage lime slaw">
          <div>
            <div class="step-num">1</div>
            <h3>Make the slaw (11:30)</h3>
            <p>Toss shredded cabbage, lime juice, olive oil, salt, and cilantro in a bowl. Refrigerate. The acid softens the cabbage so it's not crunchy-stiff.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/prawns-1-marinade.jpg" alt="Shrimp in marinade">
          <div>
            <div class="step-num">2</div>
            <h3>Marinade the shrimp (11:45)</h3>
            <p>In a bowl, mix minced chipotle + adobo + garlic + olive oil + lime juice + smoked paprika + salt. Add shrimp, toss to coat. Set aside 15-20 minutes — not longer (the lime starts to "cook" the shrimp).</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/prawns-2-griddle.jpg" alt="Shrimp searing on a griddle">
          <div>
            <div class="step-num">3</div>
            <h3>Sear (12:15)</h3>
            <p>Heat the cast iron over high heat for 3-4 minutes — it should be seriously hot. A drop of water should evaporate instantly.</p>
            <p>Lay shrimp in a single layer (don't crowd — work in 2 batches if needed). Don't touch them for 2 minutes. They'll release naturally when ready. Flip, another 1.5-2 minutes.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/prawns-3-curl.jpg" alt="Cooked shrimp curled C-shape">
          <div>
            <div class="step-num">4</div>
            <h3>Watch the shape — your foolproof timer</h3>
            <p>Shrimp tells you when it's done. Raw shrimp is straight. <strong>"C" shape = done.</strong> <strong>"O" shape (tightly curled) = overcooked, will be rubbery.</strong> Pull them at the C, every time. They keep cooking on the plate from residual heat.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-pico.jpg" alt="Plated shrimp">
          <div>
            <div class="step-num">5</div>
            <h3>Plate</h3>
            <p>Pile shrimp on a platter, slaw next to (not on top of — stays crisp). Bring straight to the bar — shrimp don't reheat well.</p>
          </div>
        </div>

        <div class="callout">
          <h4>🚨 Help! Something's wrong</h4>
          <ul>
            <li><strong>Shrimp are tough/rubbery.</strong> Overcooked. Next batch: pull at the "C" not the "O". 90 seconds per side is plenty.</li>
            <li><strong>Marinated too long.</strong> If they look opaque before cooking (the lime "cooked" them), still grill briefly — they'll be fine.</li>
            <li><strong>Sticking to the griddle.</strong> Pan wasn't hot enough. Don't force the flip — wait 30 more seconds.</li>
          </ul>
        </div>

        <div class="callout">
          <h4>✅ Final checklist</h4>
          <ul class="checklist">
            <li>Slaw made and chilled</li>
            <li>Shrimp pulled at "C" shape (not over)</li>
            <li>Plated and brought out immediately</li>
          </ul>
        </div>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="../helpers.html">← All stations</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification + Commit**

```bash
# verify in browser at http://localhost:8000/helpers/station-3-prawns.html
git add helpers/station-3-prawns.html
git commit -m "feat: station 3 (prawns) recipe page"
```

---

## Task 11: Station 4 — Mushroom + Veg Sides (`helpers/station-4-veg-sides.html`)

This station handles the most items: mushroom filling + esquites + rice + beans. Recipe is longer.

**Files:**
- Create: `helpers/station-4-veg-sides.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Station 4: Mushroom + Veg Sides · Helpers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="../index.html">The Plan</a>
    <a href="../menu.html">Menu</a>
    <a href="../helpers.html">All stations</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">Station 4 · Veg + Sides</div>
    <h1 style="font-size: var(--fs-36);">Mushroom + Poblano · Esquites · Rice · Beans</h1>
    <div class="meta">Cook: ____________ · Active 11:00 – 12:25 · Most items, but each is short</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <div class="callout">
          <h4>⏱ Your Timeline</h4>
          <ol>
            <li><strong>10:45</strong> — Char poblanos on the grill (Station 2 cook can help with grill access)</li>
            <li><strong>11:00</strong> — Start rice (cooks itself for 18 min)</li>
            <li><strong>11:00</strong> — Slice mushrooms + onions, peel poblanos</li>
            <li><strong>11:30</strong> — Open + simmer black beans (15 min)</li>
            <li><strong>11:45</strong> — Make esquites (10 min)</li>
            <li><strong>12:00</strong> — Sauté mushrooms + poblano (15 min)</li>
            <li><strong>12:25</strong> — All sides plated, ready for taco bar</li>
          </ol>
        </div>

        <h2>1️⃣ Mushroom + Poblano Filling</h2>
        <ul class="checklist">
          <li>1 lb cremini mushrooms, sliced</li>
          <li>3 large poblano peppers (charred + peeled, then sliced)</li>
          <li>1 medium yellow onion, sliced</li>
          <li>2 garlic cloves, minced</li>
          <li>2 tbsp olive oil</li>
          <li>1 tsp ground cumin</li>
          <li>1 tsp smoked paprika</li>
          <li>1 tsp salt</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/mushroom-2-poblano.jpg" alt="Charred poblano peppers">
          <div>
            <div class="step-num">A</div>
            <h3>Char the poblanos (10:45)</h3>
            <p>Lay whole poblanos on the hot grill. Turn every 2 min until skin is blistered black on all sides (~8-10 min). Move to a bowl, cover with plastic wrap or a plate. Steam 10 min — this loosens the skin. Then peel the blackened skin off (it slips off), remove stem and seeds, slice into strips.</p>
          </div>
        </div>

        <div class="recipe-step">
          <img src="../assets/img/recipes/mushroom-3-saute.jpg" alt="Mushrooms sautéing">
          <div>
            <div class="step-num">B</div>
            <h3>Sauté (12:00)</h3>
            <p>Heat olive oil over medium-high in a large skillet. Add onion, sauté 3 min. Add mushrooms — don't stir for 4 min (let them brown). Then toss, sauté another 4 min. Add poblano strips, garlic, cumin, paprika, salt. Cook 3 more min. Taste and adjust salt. Move to a serving bowl.</p>
          </div>
        </div>

        <h2>2️⃣ Cilantro-Lime Rice</h2>
        <ul class="checklist">
          <li>2 cups long-grain white rice</li>
          <li>3 cups water + 1 tsp salt</li>
          <li>2 tbsp olive oil or butter</li>
          <li>Juice of 1 lime</li>
          <li>½ cup chopped cilantro</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-rice.jpg" alt="Cilantro lime rice in a pot">
          <div>
            <div class="step-num">C</div>
            <h3>Cook (11:00)</h3>
            <p>Rinse rice in cold water until water runs almost clear (helps fluffiness). Combine rice + water + salt + oil in a pot. Bring to a boil, cover, reduce to lowest heat. Cook 18 minutes — don't lift the lid. After 18 min, kill heat, leave covered another 5 min. Then fluff with a fork, stir in lime juice and cilantro.</p>
          </div>
        </div>

        <h2>3️⃣ Doctored Black Beans</h2>
        <ul class="checklist">
          <li>2 cans (15 oz) black beans (do not drain)</li>
          <li>½ medium onion, finely diced</li>
          <li>2 garlic cloves, minced</li>
          <li>1 tbsp olive oil</li>
          <li>1 tsp cumin</li>
          <li>½ tsp salt + pepper</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-beans.jpg" alt="Black beans simmering">
          <div>
            <div class="step-num">D</div>
            <h3>Simmer (11:30)</h3>
            <p>Heat olive oil in a saucepan over medium. Sauté onion 3 min, add garlic and cumin, 1 more min. Add beans (with their liquid). Simmer 12-15 min, stirring occasionally. Smash a few beans with a spoon to thicken. Salt and pepper to taste.</p>
          </div>
        </div>

        <h2>4️⃣ Esquites (Mexican Street Corn Salad)</h2>
        <ul class="checklist">
          <li>3 cups corn kernels (from 4 ears, or thawed frozen)</li>
          <li>2 tbsp butter</li>
          <li>¼ cup mayo</li>
          <li>¼ cup crumbled cotija (sub feta if needed)</li>
          <li>Juice of 1 lime</li>
          <li>2 tbsp chopped cilantro</li>
          <li>½ tsp chili powder + smoked paprika</li>
          <li>Pinch of salt</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-rice.jpg" alt="Esquites in a bowl">
          <div>
            <div class="step-num">E</div>
            <h3>Char and dress (11:45)</h3>
            <p>Heat butter in a skillet over high. Add corn in a single layer. Don't stir for 3-4 min — let kernels char. Toss, char another 2 min. Move to a bowl, cool 2 min.</p>
            <p>Stir in mayo, cotija, lime juice, cilantro, chili powder, paprika. Taste — needs salt? Add a pinch.</p>
          </div>
        </div>

        <div class="callout">
          <h4>🚨 Help! Something's wrong</h4>
          <ul>
            <li><strong>Rice is mushy.</strong> Too much water or lifted the lid. Spread on a sheet pan to cool/dry briefly, then re-fluff.</li>
            <li><strong>Mushrooms went soggy.</strong> Pan crowded or not hot enough. Drain off liquid, crank heat, char what's left.</li>
            <li><strong>Beans too dry.</strong> Add ¼ cup water or chicken stock, simmer 2 min.</li>
            <li><strong>Esquites too tangy.</strong> Add a pinch of sugar or extra cotija.</li>
          </ul>
        </div>

        <div class="callout">
          <h4>✅ Final checklist</h4>
          <ul class="checklist">
            <li>Mushroom + poblano filling, hot, in serving bowl</li>
            <li>Rice fluffed and dressed</li>
            <li>Beans simmered and seasoned</li>
            <li>Esquites in a bowl, cotija on top</li>
          </ul>
        </div>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="../helpers.html">← All stations</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification + Commit**

```bash
# visual check at http://localhost:8000/helpers/station-4-veg-sides.html
git add helpers/station-4-veg-sides.html
git commit -m "feat: station 4 (mushroom + sides) recipe page"
```

---

## Task 12: Station 5 — Bar + Toppings (`helpers/station-5-bar-toppings.html`)

**Files:**
- Create: `helpers/station-5-bar-toppings.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Station 5: Bar + Toppings · Helpers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <nav class="site-nav">
    <a href="../index.html">The Plan</a>
    <a href="../menu.html">Menu</a>
    <a href="../helpers.html">All stations</a>
  </nav>

  <header class="hero" style="padding: var(--sp-7) var(--sp-5);">
    <div class="eyebrow">Station 5 · Bar + Toppings</div>
    <h1 style="font-size: var(--fs-36);">Drinks · Pico · Guac · Toppings · Tortillas</h1>
    <div class="meta">Cook: ____________ · Active 11:00 – 12:30</div>
  </header>

  <main>
    <section class="section">
      <div class="container">

        <div class="callout">
          <h4>⏱ Your Timeline</h4>
          <ol>
            <li><strong>10:45</strong> — Pickled red onions (quick pickle)</li>
            <li><strong>11:00</strong> — Make pico de gallo</li>
            <li><strong>11:15</strong> — Watermelon agua fresca</li>
            <li><strong>11:30</strong> — Margarita pitcher + paloma setup</li>
            <li><strong>12:00</strong> — Make guacamole (last so it's freshest)</li>
            <li><strong>12:20</strong> — Plate all toppings, warm tortillas</li>
            <li><strong>12:30</strong> — Cooler with beer and ice ready</li>
          </ol>
        </div>

        <h2>1️⃣ Pickled Red Onions (10:45)</h2>
        <ul class="checklist">
          <li>1 medium red onion, thinly sliced</li>
          <li>½ cup white vinegar</li>
          <li>½ cup hot water</li>
          <li>1 tsp sugar</li>
          <li>1 tsp salt</li>
        </ul>
        <p>Combine vinegar, water, sugar, salt in a jar. Stir to dissolve. Add onion. Press down so all submerged. Sit for ≥ 30 min — actually gets better the longer it sits.</p>

        <h2>2️⃣ Pico de Gallo (11:00)</h2>
        <ul class="checklist">
          <li>6 roma tomatoes, small dice</li>
          <li>½ medium white or yellow onion, fine dice</li>
          <li>1 jalapeño, seeded + minced (taste — start with half)</li>
          <li>½ cup chopped cilantro</li>
          <li>Juice of 1 lime</li>
          <li>1 tsp salt</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-pico.jpg" alt="Pico de gallo">
          <div>
            <div class="step-num">A</div>
            <h3>Make it</h3>
            <p>Combine everything in a bowl, toss. Taste — needs salt? More lime? Adjust. Drain off some liquid before serving (pico shouldn't be soupy).</p>
          </div>
        </div>

        <h2>3️⃣ Watermelon Agua Fresca (11:15)</h2>
        <ul class="checklist">
          <li>4 cups cubed watermelon (~ ¼ small melon)</li>
          <li>2 cups cold water</li>
          <li>Juice of 1 lime</li>
          <li>2 tbsp sugar (or to taste)</li>
          <li>Pinch of salt</li>
          <li>Ice for serving</li>
        </ul>
        <p>Blend watermelon + water until smooth. Strain through a fine-mesh sieve into a pitcher (optional — leave un-strained for more texture). Stir in lime, sugar, salt. Chill in fridge until serving. Serve over ice.</p>

        <h2>4️⃣ Margarita Pitcher (11:30)</h2>
        <p><strong>For 1 pitcher (8 servings):</strong></p>
        <ul class="checklist">
          <li>1.5 cups blanco tequila</li>
          <li>1 cup fresh lime juice (~8 limes)</li>
          <li>¾ cup triple sec / orange liqueur</li>
          <li>½ cup simple syrup (or 3 tbsp agave)</li>
          <li>Coarse salt + lime wedge for rims</li>
          <li>Ice</li>
        </ul>
        <p>Combine tequila + lime + triple sec + syrup in a pitcher. Stir. Refrigerate. To serve: rub a lime wedge on the rim of each glass, dip in salt, fill with ice, pour. Make a second pitcher if needed (this serves ~8 generous glasses).</p>

        <h2>5️⃣ Palomas (set up at the bar)</h2>
        <p>Self-serve format. Set out:</p>
        <ul>
          <li>Bottle of blanco tequila</li>
          <li>4-pack grapefruit soda (Squirt, Jarritos)</li>
          <li>Lime wedges</li>
          <li>Salt for rims (optional)</li>
          <li>Glasses + ice</li>
        </ul>
        <p>Recipe card to set out: 2 oz tequila + grapefruit soda + squeeze of lime, over ice.</p>

        <h2>6️⃣ Guacamole (12:00)</h2>
        <ul class="checklist">
          <li>3 ripe avocados</li>
          <li>Juice of 1 lime</li>
          <li>¼ medium red onion, finely diced</li>
          <li>2 tbsp chopped cilantro</li>
          <li>½ tsp salt</li>
          <li>Optional: ½ jalapeño minced</li>
        </ul>

        <div class="recipe-step">
          <img src="../assets/img/recipes/sides-guac.jpg" alt="Guacamole bowl">
          <div>
            <div class="step-num">B</div>
            <h3>Make at the last moment</h3>
            <p>Halve avocados, pop pits out, scoop flesh into a bowl. Squeeze in lime <em>first</em> (prevents browning). Mash with a fork to chunky-creamy — leave some texture. Stir in onion, cilantro, salt, jalapeño. Taste — more lime/salt if needed. Press plastic wrap directly on the surface if not serving immediately.</p>
          </div>
        </div>

        <h2>7️⃣ Tortilla Warming (12:20)</h2>

        <div class="recipe-step">
          <img src="../assets/img/recipes/bar-tortilla-warming.jpg" alt="Tortillas warming on griddle">
          <div>
            <div class="step-num">C</div>
            <h3>Warm 'em right</h3>
            <p>Heat the cast iron griddle over medium. Lay tortillas flat, 30 seconds per side, until soft and slightly puffed. Stack into a tortilla warmer (or wrap in a clean kitchen towel). Keep them coming as guests build tacos.</p>
          </div>
        </div>

        <h2>8️⃣ Toppings Bar Layout (12:25)</h2>

        <div class="recipe-step">
          <img src="../assets/img/recipes/bar-toppings-spread.jpg" alt="Taco toppings spread">
          <div>
            <div class="step-num">D</div>
            <h3>Plate it pretty</h3>
            <p>Set up bar from left to right in build order: <strong>tortillas → fillings → toppings → drinks</strong>.</p>
            <p>Toppings in small bowls, each with a spoon: pico, guac, queso fresco, shredded lettuce, sour cream, lime wedges, cilantro, pickled red onions, salsa verde, hot sauce.</p>
            <p>Set out 15 plates, napkins, forks at the start of the line.</p>
          </div>
        </div>

        <div class="callout">
          <h4>🚨 Help! Something's wrong</h4>
          <ul>
            <li><strong>Margarita too sweet.</strong> Add more lime juice. Too tart? More syrup.</li>
            <li><strong>Guac browning.</strong> Squeeze fresh lime over top, press plastic wrap directly on surface.</li>
            <li><strong>Pico is watery.</strong> Drain off liquid through a strainer before serving.</li>
          </ul>
        </div>

        <div class="callout">
          <h4>✅ Final checklist</h4>
          <ul class="checklist">
            <li>Pickled onions ready</li>
            <li>Pico drained and bowled</li>
            <li>Guac fresh, plastic-wrapped if waiting</li>
            <li>Margarita pitcher chilling</li>
            <li>Paloma station self-serve set up</li>
            <li>Tortillas warmed and held</li>
            <li>All 10 toppings out with spoons</li>
            <li>Beer cooler iced</li>
            <li>Plates, forks, napkins at start of line</li>
          </ul>
        </div>

      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><a href="../helpers.html">← All stations</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verification + Commit**

```bash
# visual check at http://localhost:8000/helpers/station-5-bar-toppings.html
git add helpers/station-5-bar-toppings.html
git commit -m "feat: station 5 (bar + toppings) recipe page"
```

---

## Task 13: Cross-Page QA + Mobile Pass

A final sweep before deploy. No new files — just verify everything.

- [ ] **Step 1: Click every link from every page**

From `index.html`: clicks to `menu.html`, `helpers.html`. From `menu.html`: nav back to `index.html`, `helpers.html`. From `helpers.html`: each of 5 station pages, plus `shopping.html`. From every station page: nav back to `helpers.html`, `index.html`, `menu.html`.

Expected: every link resolves, no 404s. If any 404: fix the path and re-verify.

- [ ] **Step 2: iPhone-width pass**

Open Chrome DevTools → toggle device toolbar → "iPhone 14 Pro" (~393px). Visit each of: `/`, `/menu.html`, `/helpers.html`, `/shopping.html`, `/helpers/station-1-eggs.html` (and one other station). 

Verify on each: no horizontal scroll, type readable without zoom, tap targets ≥ 44px high, photos not cut off.

If anything breaks: identify the offending CSS rule, fix in `assets/css/site.css`, retest.

- [ ] **Step 3: Print preview pass**

Cmd+P on each of: `helpers.html`, all 5 station pages, `shopping.html`. Verify:
- Colors/backgrounds removed (or muted)
- Each page: 1-2 pages of paper, no orphaned headings, photos sized down
- Station pages cleanly print as a kitchen sheet (cook can hold it / tape to fridge)

If any print is broken: tweak the `@media print` block in `site.css`, retest.

- [ ] **Step 4: Image alt text audit**

```bash
grep -r 'alt=""' . --include="*.html"
```

Expected: zero results. If any: add descriptive alt text.

- [ ] **Step 5: Commit any QA fixes**

```bash
git add -A
git commit -m "fix: cross-page QA — links, mobile, print"
```

If no fixes needed, skip the commit.

---

## Task 14: Deploy to GitHub Pages

- [ ] **Step 1: Push final state**

```bash
git push origin main
```

- [ ] **Step 2: Confirm Pages deployment**

Wait 1-2 minutes. Visit `https://<user>.github.io/tacoBrunch/`. Verify the home page loads with all images and styling.

If 404: check Settings → Pages, confirm source branch = main, folder = / (root). The "deployed" message should appear with the URL.

If images missing: confirm `assets/img/...` was actually committed (`git log --stat`).

- [ ] **Step 3: Phone test**

Open the live URL on a real phone (iOS Safari or Android Chrome). Click through every page. Tap every link. Try to read a recipe page while pretending to cook (one-handed scroll, glance from across the kitchen).

- [ ] **Step 4: Get the share-ready URL**

```bash
echo "Share this with the moms and helpers:"
echo "https://<user>.github.io/tacoBrunch/"
echo ""
echo "Or directly to helpers:"
echo "https://<user>.github.io/tacoBrunch/helpers.html"
```

- [ ] **Step 5: Final commit (none needed) + done**

If everything renders correctly, no further commits needed.

---

## Self-Review

**Spec coverage:**
- ✓ 9 pages (index, menu, helpers, shopping, 5 station pages) — Tasks 3, 4, 5, 6, 8-12
- ✓ Mobile-first — addressed in Task 1 CSS + Task 13 QA
- ✓ Print-friendly — Task 1 print stylesheet + Task 13 verification
- ✓ Real Unsplash photos on every menu item and recipe step — Tasks 2 + 7
- ✓ Public GitHub Pages deploy — Tasks 0 + 14
- ✓ Two-half structure (moms / helpers) — Tasks 3-12
- ✓ Beginner-friendly recipes (timeline, ingredients, step-by-step photos, troubleshooting, checklist) — Tasks 8-12 all follow same template
- ✓ Risk mitigation: deploy before 9:30 AM Sunday — Task 14 (do this Saturday afternoon ideally)

**Placeholder scan:** No "TBD", no "TODO", no "see Task N", no "implement later". Every step has actual content.

**Type / naming consistency:** File paths consistent across tasks. CSS class names (`.hero`, `.timeline`, `.menu-grid`, `.card`, `.station-card`, `.recipe-step`, `.callout`, `.checklist`, `.site-nav`, `.site-footer`) defined in Task 1 and reused throughout.

**Risk: tight timeline.** Today is 2026-05-09; the brunch is 2026-05-10. Task ordering puts the highest-impact moms-facing pages first (home + menu) so even a partial site can ship if time runs out. Helper station pages can be filled in last.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-09-mothers-day-brunch.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task and review between tasks. Fast iteration, less of my context burned per task.

**2. Inline Execution** — I execute tasks in this session using the executing-plans skill, with batch checkpoints for your review.

**Which approach?**
