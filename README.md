# HAIR5S — Unisex Salon website

Light, editorial site for **HAIR5S Unisex Salon**, Mumbai.
Same architecture as the `glow-by-parveen` reference project (React + Express + MongoDB, JWT admin,
WhatsApp ordering) with a completely different brand, palette, layout, a chrome 3D hero and a photo slider.

Primary conversion: browse the menu → build an appointment → **confirm on WhatsApp**. No payment gateway.

> **Data policy:** every photo on the site is real work downloaded from the salon's public Instagram grid,
> and the reviews and prices that were never published are not invented. Services without a published price
> show **"On request"** and are quoted in the chair. The WhatsApp number and street address are left blank
> until the client supplies them — they are set from the admin panel, never hardcoded.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite 6 + TypeScript, Tailwind CSS 3, React Router 6, react-helmet-async |
| 3D hero | three.js + @react-three/fiber — chrome torus knot lit by a generated `RoomEnvironment` (no HDR download), lazy-loaded, respects `prefers-reduced-motion` |
| Backend | Node.js + Express 4 + TypeScript, Zod validation |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT bearer tokens + bcrypt (12 rounds), all `/api/admin/*` routes guarded |
| Security | Helmet, CORS allow-list, rate limits (login 10 / 15 min), central error handler |
| Hosting | GitHub Pages (client) + Render (API) + MongoDB Atlas — `render.yaml` included |

## Project structure

```
├── client/                     React SPA
│   ├── public/
│   │   ├── brand/mark.svg      favicon mark (the wordmark itself is drawn in BrandLogo.tsx)
│   │   └── instagram/          real salon photography from @hair5s
│   └── src/
│       ├── admin/              protected panel (lazy route, JWT guarded)
│       ├── api/                fetch client, typed endpoint helpers, shared types
│       ├── components/         Hero3D/HeroScene, Slider, Marquee, cards, cart drawer, layout
│       ├── context/            Cart / Settings / Toast / Admin auth providers
│       ├── hooks/              useResource data loader
│       ├── lib/                WhatsApp message builder, INR formatting
│       └── pages/              Home, Services, Service detail, About, Visit, 404
├── server/
│   ├── scripts/dev-db.mjs      local mongod launcher (data in server/.data/mongo)
│   └── src/
│       ├── config/             env validation + Mongo connection
│       ├── controllers/        public + admin handlers
│       ├── middleware/         auth, errors, rate limits
│       ├── models/             AdminUser, Category, Product, Review, GalleryItem, Settings, PageView
│       ├── routes/             /api and /api/admin routers
│       ├── seed/               idempotent bootstrap (admin + settings + real menu + photos)
│       ├── utils/              asyncHandler, slug helpers
│       └── validation/         Zod schemas for every write
├── render.yaml                 Render blueprint for the API
└── .env.example                server environment template
```

## Quick start

Prerequisite: **Node 20+** (`node -v`). MongoDB is optional locally — see step 3.

```shell
# 1 — install both workspaces
npm install

# 2 — configure the API
cp .env.example server/.env     # Windows: copy .env.example server\.env
# edit server/.env → set JWT_SECRET, and ADMIN_EMAIL / ADMIN_PASSWORD

# 3 — start a database (skip if you already run MongoDB or use Atlas)
npm run dev:db                  # bundled mongod, data persisted in server/.data/mongo

# 4 — bootstrap (admin account + settings + the service menu + photos)
npm run seed

# 5 — run API + client
npm run dev
# client: http://localhost:5173      API: http://localhost:4000/api/health
```

**Admin panel:** `http://localhost:5173/admin`, signed in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from
`server/.env`. The first sign-in forces a password change before the panel unlocks. A discreet "Admin"
link sits in the footer.

### Admin functionality

- Dashboard — page views with 7 / 30 / 90-day ranges, catalogue counts, moderation queue count
- Services — create/edit/delete, category, price, compare-at price, duration, images, variants, SEO,
  "most booked" / "featured on home" / "unavailable" flags, sort order
- Categories — create/edit/delete + reorder (drives the menu, homepage chips and the bento grid)
- Reviews — moderation queue; nothing appears publicly until approved
- Gallery & slider — add images, toggle which ones appear in the homepage slider, reorder, delete
- Settings — brand name, tagline, hero copy, announcement bar, WhatsApp number, phone, email, Instagram,
  address, Maps URL, hours, and the WhatsApp message template
- Change password (forced on first login)

## Brand assets

| What | Where |
| --- | --- |
| **Wordmark** | drawn in `client/src/components/BrandLogo.tsx` (scissors disc + "HAIR5S"), so it stays crisp and inherits the palette. Replace the component body with an `<img>` to use a supplied logo file. |
| **Favicon** | `client/public/brand/mark.svg` |
| **Palette** | `client/tailwind.config.js` — `bone` / `paper` / `char` / `wine`; the old dark tokens (`onyx`, `coal`, `champagne`, `copper`, `ash`) are remapped onto the light theme so every screen, including admin, follows. Gradients in `client/src/index.css`. |
| **Photography** | `client/public/instagram/work-*.jpg`, downloaded from the public @hair5s grid. Add or replace images from Admin → Services / Gallery. |

## Environment variables

Copy `.env.example` to `server/.env` (never committed):

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (4000) |
| `MONGODB_URI` | Mongo connection string (local or Atlas) |
| `JWT_SECRET` | Long random secret for signing admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (12h) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `PUBLIC_SITE_URL` | Frontend URL for canonical links |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin, created by `npm run seed` only |

Client build-time variables: `VITE_API_URL` (API origin; leave empty when using the dev proxy),
`VITE_BASE` (sub-path for GitHub Pages), `VITE_PUBLIC_SITE_URL`.

## Deployment (free tiers)

1. **MongoDB Atlas** — create a free cluster, a database user, allow `0.0.0.0/0`, copy the connection string.
2. **Render** — new Blueprint from this repo (uses `render.yaml`), or a Web Service with:
   build `npm install && npm run build --workspace server`, start `node server/dist/index.js`,
   health check `/api/health`. Set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, `PUBLIC_SITE_URL`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Run `npm run seed` once from the Render shell.
3. **Frontend** — GitHub Pages (or any static host): build `npm run build --workspace client` with
   `VITE_API_URL` pointing at the Render URL, then serve `client/dist`.
4. Update `client/public/robots.txt`, `sitemap.xml` and `VITE_PUBLIC_SITE_URL` with the real domain.

The client is static; the API is a normal long-running Node process. Freebuff Sites hosting cannot run
Express + MongoDB, so the API lives on Render with Atlas.

## Content that is deliberately not faked

- **Prices** — only Hair Extensions has a published starting price (₹3,999, from the salon's own post).
  Everything else is "On request" until the client confirms a menu.
- **WhatsApp number / address / hours** — not published on the Instagram profile, so they are empty and the
  WhatsApp buttons stay inert until set in Admin → Settings.
- **Reviews** — none are seeded; guest reviews appear only after approval.

## Security notes

- Passwords hashed with bcrypt (12 rounds); never logged or returned by the API.
- Every `/api/admin/*` request requires a valid JWT; tokens for deleted admins are rejected.
- Login rate-limited (10 attempts / 15 min); review submissions limited to 5 / hour per IP.
- Zod validation on all writes, with Mongoose validation as a second layer.
- Central error handler never leaks stack traces; CORS is restricted to `CORS_ORIGINS` in production.
- The admin UI is route-guarded, but **security is enforced server-side only**.
