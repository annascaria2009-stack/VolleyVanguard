# VolleyVanguard Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free-hostable, statically-generated VolleyVanguard website with a non-technical visual editing dashboard, shipping with placeholder copy and free images.

**Architecture:** Astro generates static HTML for 8 pages from content collections (markdown) and JSON data files. Sveltia CMS at `/admin` edits that content via GitHub. Netlify hosts and auto-rebuilds on push; Netlify Forms powers the contact form. No backend, no database.

**Tech Stack:** Astro 5, TypeScript, plain CSS (custom properties), Sveltia CMS, Netlify (hosting + Forms), Google Fonts (Archivo/Anton + Inter).

**Verification model:** No unit-test framework — a static site's gate is a clean `npm run build` plus `grep` checks that expected content rendered into `dist/`. Each task ends by building and committing.

---

## File Structure

```
volleyvanguard/
├── package.json, astro.config.mjs, tsconfig.json
├── netlify.toml                     # build + Netlify Forms detection
├── public/
│   ├── admin/index.html             # Sveltia CMS entry point
│   ├── admin/config.yml             # CMS collections (the heart of editing)
│   ├── images/uploads/.gitkeep      # CMS media upload target
│   └── favicon.svg
├── src/
│   ├── styles/global.css            # theme tokens (navy/coral), typography, base
│   ├── layouts/BaseLayout.astro     # <html> shell, head, fonts, Nav + Footer
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── SectionLabel.astro       # small coral uppercase label
│   │   ├── Hero.astro
│   │   ├── CoachCard.astro
│   │   ├── ProgramCard.astro
│   │   └── GalleryGrid.astro
│   ├── content.config.ts            # collection schemas (coaches, programs, gallery, news)
│   ├── content/
│   │   ├── coaches/*.md             # one file per coach
│   │   ├── programs/*.md
│   │   ├── gallery/*.md
│   │   └── news/*.md
│   ├── data/
│   │   ├── site.json                # org name, contact, socials
│   │   ├── home.json                # hero text, intro, stats
│   │   ├── about.json
│   │   └── schedule.json            # schedule rows
│   └── pages/
│       ├── index.astro  about.astro  coaches.astro  programs.astro
│       ├── schedule.astro  gallery.astro  contact.astro
│       └── news/index.astro
```

**Design tokens (used everywhere):** `--navy:#0b1f3a; --navy-2:#13315c; --navy-deep:#07152b; --coral:#ff5a3c; --surface:#f1f5fb; --ink:#0b1f3a; --muted:#5a6b85; --radius:10px`. Display font Archivo Black / Anton; body font Inter. Photos are large and prominent per spec.

---

## Task 1: Scaffold Astro project

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (temporary).

- [ ] **Step 1: Initialize project non-interactively**

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
```
Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`. (If the dir-not-empty prompt blocks, scaffold in a temp dir and move files in.)

- [ ] **Step 2: Install dependencies**

```bash
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Verify build works**

Run: `npm run build`
Expected: PASS — "Complete!" with `dist/index.html` produced.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Global theme + BaseLayout

**Files:** Create `src/styles/global.css`, `src/layouts/BaseLayout.astro`.

- [ ] **Step 1: Write `src/styles/global.css`**

Define `:root` tokens listed above; CSS reset (`*{box-sizing:border-box;margin:0}`); `body{font-family:Inter,system-ui,sans-serif;color:var(--ink)}`; `h1,h2,h3{font-family:'Archivo Black',Inter,sans-serif;line-height:1.05}`; container class `.wrap{max-width:1100px;margin:0 auto;padding:0 20px}`; button `.btn{background:var(--coral);color:#fff;padding:12px 24px;border-radius:6px;font-weight:700;display:inline-block;text-decoration:none}`; responsive helpers (grid utilities). Mobile-first.

- [ ] **Step 2: Write `src/layouts/BaseLayout.astro`**

Props: `title`, `description`. Renders `<!doctype html>`, `<head>` with meta viewport, Google Fonts `<link>` for Archivo+Inter, `<title>`, imports `../styles/global.css`. Body renders `<Nav />`, `<slot />`, `<Footer />`. (Nav/Footer created next task — import them now; build will fail until Task 3, which is expected.)

- [ ] **Step 3: Point temp index at layout** — replace `src/pages/index.astro` with a minimal page using `BaseLayout` and an `<h1>VolleyVanguard</h1>`.

- [ ] **Step 4: Commit** (build deferred to Task 3)

```bash
git add -A && git commit -m "feat: add global theme and base layout"
```

---

## Task 3: Nav + Footer

**Files:** Create `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/SectionLabel.astro`, `src/data/site.json`.

- [ ] **Step 1: Write `src/data/site.json`**

```json
{
  "name": "VolleyVanguard",
  "tagline": "Train hard. Rise together.",
  "email": "hello@volleyvanguard.example",
  "whatsapp": "+10000000000",
  "instagram": "https://instagram.com/volleyvanguard",
  "footerNote": "© VolleyVanguard. Coaching with heart."
}
```

- [ ] **Step 2: Write `Nav.astro`** — imports `site.json`; navy bar, logo (coral square + "VOLLEY**VANGUARD**"), links to all 8 pages (Home, About, Coaches, Programs, Schedule, Gallery, News, Contact). Mobile: collapses to a CSS-only toggle (`<details>` or checkbox hamburger). Sticky top.

- [ ] **Step 3: Write `Footer.astro`** — imports `site.json`; deep-navy band with org name, footer note, and email/WhatsApp/Instagram links.

- [ ] **Step 4: Write `SectionLabel.astro`** — small coral uppercase label; props `text`; used as section eyebrow.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS. Then `grep -q "VOLLEY" dist/index.html` → exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add nav, footer, section label and site settings"
```

---

## Task 4: Content collection schemas + sample content

**Files:** Create `src/content.config.ts`; sample content in `src/content/coaches/`, `programs/`, `gallery/`, `news/`; `public/images/uploads/.gitkeep`.

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const coaches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/coaches' }),
  schema: z.object({
    name: z.string(), role: z.string(),
    photo: z.string(), order: z.number().default(0),
  }),
});
const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({ title: z.string(), image: z.string(), order: z.number().default(0) }),
});
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({ image: z.string(), caption: z.string().optional(),
    category: z.enum(['coach', 'event']).default('event'), order: z.number().default(0) }),
});
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({ title: z.string(), date: z.coerce.date(), cover: z.string().optional() }),
});
export const collections = { coaches, programs, gallery, news };
```

- [ ] **Step 2: Add 6 sample coaches** — `src/content/coaches/coach-1.md` … `coach-6.md`. Each frontmatter `name`, `role`, `photo: "https://picsum.photos/seed/coachN/600/700"`, `order`, with a 2-sentence placeholder bio in the body. Roles: Head Coach, Setter Coach, Defense Coach, Fitness Coach, Youth Coach, Assistant Coach.

- [ ] **Step 3: Add 3 sample programs** — `programs/*.md`: "Junior Development", "Competitive Team", "Skills Clinics"; `image: "https://picsum.photos/seed/progN/600/400"`; body = placeholder description.

- [ ] **Step 4: Add 6 sample gallery items** — `gallery/*.md`: `image: "https://picsum.photos/seed/galN/800/600"`, `caption`, `category` mix of coach/event.

- [ ] **Step 5: Add 3 sample news posts** — `news/*.md`: `title`, `date`, `cover`, placeholder body.

- [ ] **Step 6: Add media dir** — `mkdir -p public/images/uploads && touch public/images/uploads/.gitkeep`.

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: PASS (collections compile; no schema errors).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add content schemas and placeholder content"
```

---

## Task 5: Coaches page + CoachCard

**Files:** Create `src/components/CoachCard.astro`, `src/pages/coaches.astro`.

- [ ] **Step 1: Write `CoachCard.astro`** — props `name, role, photo`, slot for bio. **Large** photo (tall, ~`aspect-ratio:4/5`, `object-fit:cover`, full card width), name (display font), coral role label, bio text below.

- [ ] **Step 2: Write `coaches.astro`** — uses `BaseLayout`; `getCollection('coaches')` sorted by `order`; page heading + intro; responsive grid (`repeat(auto-fill,minmax(260px,1fr))`) of `CoachCard`, passing `entry.body` rendered as bio.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. Then `grep -q "Head Coach" dist/coaches/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add coaches page"
```

---

## Task 6: Programs page + ProgramCard

**Files:** Create `src/components/ProgramCard.astro`, `src/pages/programs.astro`.

- [ ] **Step 1: Write `ProgramCard.astro`** — props `title, image`, slot for description; large image top, title, text.

- [ ] **Step 2: Write `programs.astro`** — `BaseLayout`; `getCollection('programs')` sorted by `order`; heading + intro; responsive grid of `ProgramCard`. Each card ends with a "Contact us" link to `/contact`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `grep -q "Junior Development" dist/programs/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add programs page"
```

---

## Task 7: Gallery page + GalleryGrid

**Files:** Create `src/components/GalleryGrid.astro`, `src/pages/gallery.astro`.

- [ ] **Step 1: Write `GalleryGrid.astro`** — props `items` (array of `{image,caption}`); responsive masonry-ish grid (`repeat(auto-fill,minmax(280px,1fr))`, `gap:14px`), **large** tiles, image `object-fit:cover`, caption overlay on hover.

- [ ] **Step 2: Write `gallery.astro`** — `BaseLayout`; `getCollection('gallery')` sorted by `order`; heading + intro; renders `GalleryGrid`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `grep -qi "gallery" dist/gallery/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add gallery page"
```

---

## Task 8: News page

**Files:** Create `src/pages/news/index.astro`.

- [ ] **Step 1: Write `news/index.astro`** — `BaseLayout`; `getCollection('news')` sorted by `date` descending; heading; list of posts (cover image, title, formatted date, rendered body). Single-page feed (no per-post routes for v1 — YAGNI).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. `test -f dist/news/index.html` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add news page"
```

---

## Task 9: Home page

**Files:** Create `src/components/Hero.astro`, `src/data/home.json`, replace `src/pages/index.astro`.

- [ ] **Step 1: Write `src/data/home.json`**

```json
{
  "heroHeading": "TRAIN HARD. RISE TOGETHER.",
  "heroSubtext": "Elite volleyball coaching led by a team of dedicated coaches.",
  "heroImage": "https://picsum.photos/seed/volleyhero/1600/900",
  "intro": "VolleyVanguard was founded by a group of friends united by a love of the game. We coach players of every level with discipline, heart, and team spirit.",
  "stats": [
    { "value": "6", "label": "Expert Coaches" },
    { "value": "All", "label": "Skill Levels" },
    { "value": "100%", "label": "Team Spirit" }
  ]
}
```

- [ ] **Step 2: Write `Hero.astro`** — props `heading, subtext, image`; **full-width large** hero, navy gradient overlay over the image, display heading, subtext, coral CTA button → `/contact`.

- [ ] **Step 3: Write `index.astro`** — `BaseLayout`; sections in spec order: Hero; "Who we are" (`SectionLabel` + intro + 3 stat cards from `home.json`); "Meet the coaches" (`SectionLabel` + first 4 coaches via `CoachCard`, link to `/coaches`); "From the court" (`SectionLabel` + gallery strip of first 4 gallery items via `GalleryGrid`); CTA band ("Ready to join the Vanguard?" → `/schedule`).

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS. `grep -q "RISE TOGETHER" dist/index.html` → exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add home page"
```

---

## Task 10: About page

**Files:** Create `src/data/about.json`, `src/pages/about.astro`.

- [ ] **Step 1: Write `src/data/about.json`** — `{ "heading": "About VolleyVanguard", "image": "https://picsum.photos/seed/about/1200/700", "body": "<2-3 placeholder paragraphs about the org's founding and mission>" }`.

- [ ] **Step 2: Write `about.astro`** — `BaseLayout`; large image, heading, body paragraphs (render `body` allowing simple paragraph breaks).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `grep -qi "About VolleyVanguard" dist/about/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add about page"
```

---

## Task 11: Schedule page

**Files:** Create `src/data/schedule.json`, `src/pages/schedule.astro`.

- [ ] **Step 1: Write `src/data/schedule.json`**

```json
{
  "intro": "Here's our weekly training schedule. Contact us to register for any session.",
  "rows": [
    { "day": "Monday", "time": "6:00–8:00 PM", "program": "Junior Development", "level": "Beginner", "location": "Main Court" },
    { "day": "Wednesday", "time": "6:00–8:00 PM", "program": "Competitive Team", "level": "Advanced", "location": "Main Court" },
    { "day": "Saturday", "time": "10:00 AM–12:00 PM", "program": "Skills Clinic", "level": "All", "location": "Beach Courts" }
  ]
}
```

- [ ] **Step 2: Write `schedule.astro`** — `BaseLayout`; intro; responsive table (stacks to cards on mobile via CSS) of rows; prominent coral "Contact us to register" button → `/contact`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `grep -qi "register" dist/schedule/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add schedule page"
```

---

## Task 12: Contact page (Netlify Forms)

**Files:** Create `src/pages/contact.astro`.

- [ ] **Step 1: Write `contact.astro`** — `BaseLayout`; intro; a Netlify form: `<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">` with hidden `<input type="hidden" name="form-name" value="contact">`, honeypot field, and Name / Email / Phone / Message fields + coral submit button. Below the form: direct email link (`mailto:` from `site.json`), WhatsApp click-to-chat link (`https://wa.me/<number>`), and Instagram link.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. `grep -q 'data-netlify="true"' dist/contact/index.html` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add contact page with Netlify form"
```

---

## Task 13: Sveltia CMS admin dashboard

**Files:** Create `public/admin/index.html`, `public/admin/config.yml`.

- [ ] **Step 1: Write `public/admin/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>VolleyVanguard — Content Editor</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Write `public/admin/config.yml`** — backend GitHub, media in `public/images/uploads`, and collections mapping every editable surface:

```yaml
backend:
  name: github
  repo: suscaria/Volleyvanguard
  branch: main
media_folder: "public/images/uploads"
public_folder: "/images/uploads"
collections:
  - name: site
    label: "Site Settings"
    files:
      - name: site
        label: "Site Settings"
        file: "src/data/site.json"
        fields:
          - { name: name, label: "Org Name", widget: string }
          - { name: tagline, label: "Tagline", widget: string }
          - { name: email, label: "Email", widget: string }
          - { name: whatsapp, label: "WhatsApp Number", widget: string }
          - { name: instagram, label: "Instagram URL", widget: string }
          - { name: footerNote, label: "Footer Note", widget: string }
      - name: home
        label: "Home Page"
        file: "src/data/home.json"
        fields:
          - { name: heroHeading, label: "Hero Heading", widget: string }
          - { name: heroSubtext, label: "Hero Subtext", widget: text }
          - { name: heroImage, label: "Hero Image", widget: image }
          - { name: intro, label: "Intro", widget: text }
          - name: stats
            label: "Stats"
            widget: list
            fields:
              - { name: value, label: "Value", widget: string }
              - { name: label, label: "Label", widget: string }
      - name: about
        label: "About Page"
        file: "src/data/about.json"
        fields:
          - { name: heading, label: "Heading", widget: string }
          - { name: image, label: "Image", widget: image }
          - { name: body, label: "Body", widget: text }
      - name: schedule
        label: "Schedule"
        file: "src/data/schedule.json"
        fields:
          - { name: intro, label: "Intro", widget: text }
          - name: rows
            label: "Sessions"
            widget: list
            fields:
              - { name: day, label: Day, widget: string }
              - { name: time, label: Time, widget: string }
              - { name: program, label: Program, widget: string }
              - { name: level, label: Level, widget: string }
              - { name: location, label: Location, widget: string }
  - name: coaches
    label: "Coaches"
    folder: "src/content/coaches"
    create: true
    fields:
      - { name: name, label: Name, widget: string }
      - { name: role, label: Role, widget: string }
      - { name: photo, label: Photo, widget: image }
      - { name: order, label: Order, widget: number, default: 0 }
      - { name: body, label: Bio, widget: markdown }
  - name: programs
    label: "Programs"
    folder: "src/content/programs"
    create: true
    fields:
      - { name: title, label: Title, widget: string }
      - { name: image, label: Image, widget: image }
      - { name: order, label: Order, widget: number, default: 0 }
      - { name: body, label: Description, widget: markdown }
  - name: gallery
    label: "Gallery"
    folder: "src/content/gallery"
    create: true
    fields:
      - { name: image, label: Image, widget: image }
      - { name: caption, label: Caption, widget: string, required: false }
      - { name: category, label: Category, widget: select, options: ["coach", "event"], default: event }
      - { name: order, label: Order, widget: number, default: 0 }
  - name: news
    label: "News"
    folder: "src/content/news"
    create: true
    fields:
      - { name: title, label: Title, widget: string }
      - { name: date, label: Date, widget: datetime }
      - { name: cover, label: Cover Image, widget: image, required: false }
      - { name: body, label: Body, widget: markdown }
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `test -f dist/admin/config.yml && test -f dist/admin/index.html` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Sveltia CMS admin dashboard"
```

---

## Task 14: Netlify config + final verification

**Files:** Create `netlify.toml`.

- [ ] **Step 1: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 2: Full build + page presence check**

Run: `npm run build`
Then verify all routes exist:
```bash
for p in index about coaches programs schedule gallery contact news; do
  test -f dist/$p/index.html -o -f dist/$p.html && echo "OK $p" || echo "MISSING $p"
done
```
Expected: every line "OK".

- [ ] **Step 3: Local preview smoke test (optional manual)**

Run: `npm run preview` and confirm in browser that pages render, nav works, photos are large, layout is responsive (resize to mobile width).

- [ ] **Step 4: Commit + push dev**

```bash
git add -A && git commit -m "chore: add Netlify config"
git push origin dev
```

---

## Post-Plan: Handover (not a build task)

- Connect Netlify to the repo (publish dir `dist`), enable Forms, register a GitHub OAuth app so `/admin` login works. (Done at hosting time, with the user.)
- Write Anna a one-page picture guide for `/admin`.

---

## Self-Review Notes

- **Spec coverage:** all 8 pages (Tasks 5–12), coaches/programs/gallery/news collections (Task 4), all CMS-editable surfaces (Task 13), Bold Athletic theme + large photos (Task 2 + per-component notes), placeholder copy/images (Task 4 + data files), Netlify hosting + Forms (Tasks 12, 14). Out-of-scope items (payments/accounts/booking) intentionally absent.
- **Placeholders:** none — sample content is real text/URLs; CMS config and schemas are complete.
- **Type consistency:** field names in `content.config.ts` (name/role/photo/order; title/image/order; image/caption/category/order; title/date/cover) match the CMS `config.yml` fields and the data JSON keys used by pages.
