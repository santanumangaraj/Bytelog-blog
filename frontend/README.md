# ByteLog Frontend

**Tech**: React, Vite, Tailwind CSS (+ DaisyUI), react-router-dom, axios.

## Local setup

```
npm install
cp .env.example .env   # set VITE_API_URL to your backend's URL
npm run dev
```

## Build

```
npm run build
```
Output goes to `dist/`.

**`VITE_API_URL` is a build-time value** — Vite inlines it into the static
bundle, so it must be set correctly in your hosting platform's build
environment *before* `npm run build` runs. Setting it only in a runtime
`.env` on a static host does nothing.

## Deployment

This is a client-side-routed single-page app — a static host needs a
rewrite rule so deep links (e.g. `/blogs/s/some-slug`) don't 404 on
refresh. Both are already included in this repo:
- `public/_redirects` — Netlify / Cloudflare Pages
- `vercel.json` — Vercel

If self-hosting behind nginx instead, add an equivalent `try_files $uri
/index.html;` rule.
