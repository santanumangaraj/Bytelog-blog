# Deployment Guide — Render

The process for deploying ByteLog to **Render** (backend) + **Vercel**
(frontend), using your existing Aiven MySQL and a free Upstash Redis.

## Where each piece lives

| Piece | Platform | Why |
| --- | --- | --- |
| Backend (API + both workers) | **Render**, free Web Service | Render's free tier only covers Web Services, not Background Workers — see below for how this app is structured to fit that |
| MySQL | **Aiven** (your existing instance) | Already provisioned and configured in `backend/.env` — no change needed |
| Redis | **Upstash**, free tier | BullMQ needs a real Redis TCP connection (not just a REST API) — Upstash's free tier provides that; Render's own Redis/Key-Value offering is a fine alternative if you'd rather keep one dashboard, just confirm its current free-tier terms at signup since these change |
| Frontend | **Vercel** | `vercel.json` is already in the repo for SPA routing |

## The real constraint this deployment works around

Render's free tier is built for one HTTP-facing service that can sleep
when idle — it has no free tier for standalone background workers. This
app has 3 logical processes (API, blog-image worker, like worker). Rather
than pay for 2 extra paid worker services, **all three now run inside one
process** via a new entrypoint:

- **`backend/render-entry.js`** — imports the API (`app.js`) and both
  workers (`workers/blog.worker.js`, `workers/like.worker.js`). Each of
  those files already starts its own server/BullMQ workers as a side
  effect of being imported — nothing about their actual logic changed.
- `app.js` and both worker files were updated so their `SIGTERM`/`SIGINT`
  handlers only self-register when run standalone (`node app.js` directly,
  as still happens in the Docker/`docker-compose.yml` path). When combined
  via `render-entry.js`, that file owns shutdown instead, coordinating all
  three cleanups together — otherwise three independent handlers would
  race to exit the process before each other finished closing connections.
- New script: `npm run start:render` → `node render-entry.js`.

**Known tradeoff, be upfront with yourself about this**: Render's free
tier sleeps the whole process after ~15 minutes of no HTTP traffic — which
means the workers sleep too, mid-queue if necessary. A like or a blog
cover-image upload triggered right before the app sleeps just sits in
Redis until the next HTTP request wakes the process back up, then
processes normally. Fine for a low-traffic/portfolio deployment; not
real-time processing under real load.

---

## Prerequisites

- Code pushed to GitHub (already done)
- A Render account: [render.com](https://render.com) — sign up with GitHub
- A Vercel account: [vercel.com](https://vercel.com) — sign up with GitHub
- An Upstash account: [upstash.com](https://upstash.com) — sign up, free tier
- Your Aiven MySQL connection details (already in `backend/.env`)
- Your AWS S3 credentials

**Before you do anything else**: rotate your AWS access key/secret. They
were inadvertently printed to a terminal during an earlier debugging step
in this project's history — treat them as exposed regardless of whether
anything's actually gone wrong, and generate fresh ones in the AWS console.

---

## Part 1 — Redis on Upstash

1. Upstash dashboard → **Create Database** → Redis.
2. Pick a region close to where Render will run your service (Render defaults to Oregon, US-West, unless you pick otherwise).
3. Once created, copy the connection string that starts `rediss://...` (note the extra `s` — TLS). This is your `REDIS_URL`.

## Part 2 — Backend on Render

### 1. Create the Web Service

1. Render dashboard → **New** → **Web Service** → connect the `Bytelog-blog` repo.
2. **Root Directory**: `backend`.
3. **Runtime**: Node (no Docker needed for this path — Render's native Node runtime is simpler here; the Dockerfile stays as-is for the self-hosted/Docker path documented in the appendix).
4. **Build Command**: `npm install`
5. **Start Command**: `npm run start:render`
6. **Health Check Path**: `/health`
7. **Instance Type**: Free

### 2. Set environment variables

Render → your service → **Environment** → add each of these:

```
NODE_ENV=production
TRUST_PROXY=true
IS_DOCKER=false

DB_HOST=<from your Aiven dashboard / existing backend/.env>
DB_PORT=<from Aiven>
DB_USER=<from Aiven>
DB_PASS=<from Aiven>
DB_NAME=<from Aiven>

CORS_ORIGIN=https://your-frontend-domain.vercel.app

AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=<your ROTATED key>
AWS_SECRET_ACCESS_KEY=<your ROTATED secret>
AWS_BUCKET_NAME=your-bucket-name

REDIS_URL=<the rediss://... URL from Upstash>

JWT_ACCESS_SECRET=<generate — see below>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=<generate a DIFFERENT one — see below>
JWT_REFRESH_EXPIRY=7d

LOGIN_MAX_FAILED_ATTEMPTS=5
LOGIN_LOCK_DURATION_MS=900000
```

Generate each JWT secret locally:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run it twice — two different values, never reuse one for both.

`PORT` doesn't need to be set — Render provides its own `PORT` env var and
`app.js` already reads `process.env.PORT` with a fallback, so it adapts
automatically.

### 3. Deploy

Save the environment variables and trigger the first deploy (Render does
this automatically after connecting the repo, or click **Manual Deploy**).
Watch the logs — you should see the same startup sequence as running
`node render-entry.js` locally: DB connected, Redis connected, server
listening, both BullMQ workers initialized with no errors.

### 4. Run migrations (if not already applied to Aiven)

From your own machine:
```
cd backend
# ensure your local .env's DB_* values point at the same Aiven instance
npx sequelize-cli db:migrate
```

### 5. Verify

```
curl https://your-service-name.onrender.com/health
```
Expected: `{"status":"ok","db":"up","redis":"up"}`. On a cold free-tier
instance, the first request after idling can take 30–50 seconds while
Render wakes the container — that's expected, not a bug.

---

## Part 3 — Frontend on Vercel

1. Vercel → **Add New** → **Project** → select the repo, **Root Directory**: `frontend`.
2. **Settings** → **Environment Variables**:
   ```
   VITE_API_URL=/api/v2
   ```
   **A relative path, not the full Render URL.** `vercel.json` rewrites
   `/api/v2/*` to the Render backend server-side, so the browser only ever
   talks to your Vercel domain — this makes the auth cookies first-party
   instead of cross-site. (This was added after confirming `NODE_ENV`,
   `TRUST_PROXY`, and `CORS_ORIGIN` were all already correct on Render and
   login still bounced back to `/login` — that combination means the
   browser was blocking the cookie as third-party regardless of correct
   flags, which only this same-origin approach actually fixes.) Must be
   set before the build runs — Vite bakes it into the static bundle — and
   changing it requires a rebuild, not just a redeploy of an old build.
3. **Deploy**. `vercel.json` also handles SPA routing so deep links don't 404.
4. (Optional) **Settings** → **Domains** → add a custom domain.

---

## Part 4 — Close the loop

### 1. Fix CORS

Back in Render → **Environment**, update `CORS_ORIGIN` to your real Vercel
URL (or custom domain). Render redeploys automatically when an env var
changes.

### 2. Full smoke test

- [ ] Register a new account, confirm avatar upload works
- [ ] Log in, refresh — session persists (cookie-based auth)
- [ ] Publish a blog with a cover image, confirm it appears (proves the blog worker actually ran, inside the same process)
- [ ] Like it, confirm the count updates (proves the like worker ran)
- [ ] Direct-navigate to a blog's URL (paste it fresh, don't click a link) — confirms the SPA rewrite works
- [ ] 6 wrong-password logins on one account — confirm it locks (HTTP 423)
- [ ] Log out, refresh — confirm you're actually logged out
- [ ] Visit the site after it's been idle 20+ minutes — confirm the cold start eventually loads rather than erroring out

---

## After launch

- **Cross-site cookies (login bounces back to `/login`) — resolved via the Vercel rewrite.** Vercel and Render are different domains, so the auth cookie was technically "third-party" from the browser's point of view even with correct `SameSite=None; Secure` (`backend/utils/cookieOptions.js`) — confirmed as the actual cause here after `NODE_ENV`, `TRUST_PROXY`, and `CORS_ORIGIN` were all already correct on Render and it still happened. The fix in place now: `vercel.json` proxies `/api/v2/*` to Render server-side, and `VITE_API_URL=/api/v2` (Part 3) makes the browser treat the API as same-origin, so the cookie is no longer third-party at all. If this regresses after touching `vercel.json` or the env var again, that's the first thing to check.
- **Cold starts are the main UX cost of the free tier.** If this becomes annoying, Render's paid Starter plan ($7/mo) keeps the service always-on — worth it once this is more than a portfolio piece.
- **An external uptime monitor** (e.g. UptimeRobot's free tier) pinging `/health` every few minutes both tells you about real downtime and, as a side effect, tends to keep the free instance awake more often — not a guarantee against Render's sleep policy, but a common practice.
- **Confirm Aiven's plan status independently** — I can't verify from here whether your instance is on a free trial with an expiry or a sustained free tier; check the Aiven dashboard so the database doesn't disappear on you unexpectedly.
- **Rotate `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`** periodically, and immediately if either is ever suspected leaked.
- **Keep `npm audit` current** on both `backend/` and `frontend/`.

---

## Appendix: self-hosting alternative (Oracle Cloud free VM)

If you'd rather run everything (including MySQL and Redis) on infrastructure
you fully control instead of relying on Render/Aiven/Upstash's free tiers
staying free, this repo already has everything needed for that path:

- `docker-compose.yml` — defines `mysql`, `redis`, `backend`, `blog-worker`, `like-worker`, and `caddy` (automatic HTTPS) as separate containers, run with `docker compose -f docker-compose.yml up -d --build`.
- `Caddyfile` — reverse-proxies your domain to the backend container.
- `.env.example` (repo root) — the `DB_PASS`/`DB_NAME`/`DOMAIN` values `docker compose` itself needs.

This runs the API and workers as **3 separate always-on processes** (no
sleep, no cold starts, no combined-process tradeoff) on an Oracle Cloud
"Always Free" VM (a real permanent free tier, not a trial). More setup
work — provisioning the VM, firewall rules, DNS, SSH — in exchange for
full control and no sleep/cold-start behavior. Ask if you want the full
step-by-step for this path again.
