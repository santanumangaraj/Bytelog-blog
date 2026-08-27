# Admin Panel — contracts & what's still a stub

This documents exactly what `src/admin/` assumes so wiring it to the real
ByteLog backend is a mechanical swap, not a re-read of every page.

## Architecture

```
Admin Page  →  src/admin/data/apiBridge.js  →  src/admin/data/adminApi.js  →  (future) backend API
```

**There is no mock data anywhere in this panel.** Most of `adminApi.js` is
still stub functions that return `null`; `getAdminBlogs`/`getAdminUsers` are
wired to real (not-yet-existing) backend routes — see "Current state" below
for exactly which is which. Either way, every admin page shows its loading
state briefly, then its real empty/error state, honestly reflecting "not
connected yet" rather than displaying fabricated numbers. Pages call through
`api.<fnName>(...)` from `apiBridge.js`, which:
- resolves `adminApi.js`'s exports (named or default, doesn't matter),
- degrades to the same `null` result (with a console warning) if a function
  is missing entirely, instead of throwing and crashing a page — so a stub
  returning `null` and a function that doesn't exist yet behave identically,
- exposes `unwrap()`, `listOf()`, `paginationOf()` helpers so pages don't
  care whether a response is `{ data: {...} }`-wrapped or bare, once real
  data starts flowing.

**To connect the real backend:** replace the body of each stub in
`adminApi.js` with a real `API.get/post/patch/delete(...)` call (the
project's existing `axios` instance is `src/routes/api.js`'s `API` export) —
each stub's comment already states its expected param/return shape, matching
the contracts below. Nothing in any page needs to change as long as the
shapes hold.

## Authentication

`src/admin/auth/useAdminAuth.js` is wired to the project's real
`AuthContext` (`src/context/AuthContext.jsx`) — `isAdmin` is
`user?.role === "ADMIN"`. `ADMIN_AUTH_BYPASS` is `false`; the gate in
`AdminRoute.jsx` is live: unauthenticated → `/login`, authenticated
non-admin → `/`, admin → renders the panel.

This is a **frontend convenience only**. Every admin mutation must be
independently re-checked server-side (`req.user.role === "ADMIN"`) — the
backend already does this for the two admin capabilities that exist today
(delete-any-blog, tag create/delete; see `backend/middlewares/auth.middleware.js`'s
`verifyAdmin` and `backend/routes/tags.route.js`). The rest of this panel
(users, reports, settings) has **no backend counterpart yet** — see "Stubs"
below.

## Data contracts

### Dashboard — `getAdminDashboard({ growthRange })`
```js
{
  stats: {
    totalUsers, usersChange,       // usersChange etc. are % deltas, may be negative
    totalBlogs, blogsChange,
    publishedBlogs, publishedChange,
    draftBlogs, draftChange,
  },
  userGrowth: [{ label, date, users }],       // matches `growthRange`
  publishingActivity: [{ label, published, draft }],
  statusDistribution: [{ status, count }],    // status: "Published"|"Draft"|"Archived"|"Pending"
  recentBlogs: [...Blog],                     // shape below, first 5
  recentUsers: [...User],                     // shape below, first 5
}
```
`getAdminUserGrowth(range)` → `[{ label, date, users }]`, used when the
dashboard's range selector changes to something other than the initial load.

### Blogs — `getAdminBlogs({ page, limit, query, status, author, sort })` — **wired**
```js
{
  rows: [{
    id, title, slug, author,          // author: display name (string), not an id
    status,                           // "published" | "draft" | "archived"
    views, likes, coverImageUrl,      // coverImageUrl may be null
    createdAt,                        // ISO string
  }],
  pagination: { page, limit, totalItems, totalPages },
  stats: { total, published, draft, archived },
  authors: [string],                  // distinct author names, for the filter dropdown
}
```
`adminApi.js`'s `getAdminBlogs` calls `GET /api/v2/admin/blogs` — **live**
(`backend/routes/admin.route.js`, `verifyJWT` + `verifyAdmin`, any
status/any author, unlike the public `GET /blogs` which is published-only).
`status`/`author` are only sent when actually filtering (not the literal
string `"all"`). `likes` is a real per-blog count (`backend/repository/admin.repository.js#countLikesPerBlog`).

`updateAdminBlogStatus(id, status)` and `deleteAdminBlog(id)` — still
**stubs** (`null`). "View"/"Edit" actions navigate to the real, already-working
public routes (`/blog/:slug`, `/blog/:slug/edit`) — those already work
against real data once `getAdminBlogs` returns real rows with real slugs.

### Users — `getAdminUsers({ page, limit, query, role, status, sort })` — **wired**
```js
{
  rows: [{
    id, name, email, avatarUrl,       // avatarUrl may be null
    role,                             // "ADMIN" | "READER"
    status,                           // "active" | "suspended" — see caveat below
    blogsCount, joinedAt,
  }],
  pagination: { page, limit, totalItems, totalPages },
  stats: { total, admins, active, suspended },
}
```
`adminApi.js`'s `getAdminUsers` calls `GET /api/v2/admin/users` — **live**
(`backend/routes/admin.route.js`). `role`/`status` are only sent when
actually filtering.

**Caveat, resolved pragmatically rather than fixed:** the `user` model
(`backend/models/user.js`) has no `status` column — only `role`,
`failedLoginAttempts`, `lockUntil`. There's no real "active/suspended"
concept on the backend. `getAdminUsersList` (`admin.service.js`) reports
every user as `status: "active"`, `stats.active = stats.total`,
`stats.suspended = 0`, and short-circuits `status=suspended` to an empty
result rather than pretending to filter. `updateAdminUserStatus` (the
suspend/reactivate mutation) is still a stub — wiring it for real requires
actually adding that column first.

`updateAdminUserRole(id, role)`, `updateAdminUserStatus(id, status)`,
`deleteAdminUser(id)` — still **stubs** (`null`).

### Reports — `getAdminReports({ page, limit, status })`
```js
{
  rows: [{
    id, targetType,                   // "blog" | "user"
    targetId, targetTitle,            // targetTitle: blog title or user name
    reportedBy, reason, details,
    status,                           // "pending" | "resolved" | "dismissed"
    createdAt,
  }],
  pagination: { page, limit, totalItems, totalPages },
  counts: { all, pending, resolved, dismissed },
}
```
`updateAdminReportStatus(id, status)` — **stub**.

### Settings — `getAdminSettings()`
```js
{
  general: { siteName, siteDescription, maintenanceMode },
  security: { requireEmailVerification, sessionTimeoutMinutes, maxLoginAttempts },
  moderation: { autoPublish, requireApprovalForNewAuthors, autoHideAfterReports },
  notifications: { emailOnNewReport, emailOnNewUser, weeklyDigest },
}
```
`updateAdminSettings(section, values)` — **stub**, called per-section (one
save button per card).

### Admin profile — `getAdminProfile()`
```js
{ id, fullName, username, email, role, status, avatarUrl, joinedAt }
```
`AdminProfile.jsx` is the one page that isn't fully blank right now — it
reads real `fullName`/`username`/`email`/`role`/`joinedAt` straight from
`useAdminAuth()` (the project's actual logged-in-user session, via
`AuthContext`), and only falls back to this stub for `status`, which has no
real equivalent yet. No `updateAdminProfile` mutation exists in `adminApi.js`,
so there's deliberately no edit form (per the brief: don't invent endpoints).

## Current state

**Live, real data, tested end-to-end** — `getAdminBlogs` → `GET
/api/v2/admin/blogs` and `getAdminUsers` → `GET /api/v2/admin/users`
(`backend/routes/admin.route.js`, `backend/services/admin.service.js`,
`backend/repository/admin.repository.js`). `AdminBlogs.jsx`/`AdminUsers.jsx`
show real rows, real pagination, real stats now.

**Still `async () => null` stubs** — `getAdminDashboard`, `getAdminUserGrowth`,
`getAdminReports`, `getAdminSettings`, `getAdminProfile`, and every mutation
(`updateAdminBlogStatus`, `deleteAdminBlog`, `updateAdminUserRole`,
`updateAdminUserStatus`, `deleteAdminUser`, `updateAdminReportStatus`,
`updateAdminSettings`). Their pages treat the `null`/falsy response as a
failure and show `AdminEmptyState`'s "not connected yet" view.

## What needs a real backend endpoint

Still needed: `getAdminDashboard`, `getAdminUserGrowth`, `getAdminReports`,
`getAdminSettings`, `getAdminProfile`, and every mutation listed above — none
have a backend route yet.

The two admin capabilities that are real end-to-end on the backend but not
yet *called from this panel*:
- **Delete any blog** — `DELETE /api/v2/blogs/delete-blog/:blogId`
  (`backend/services/blog.service.js#deleteABlog`, already allows
  `requester.role === "ADMIN"` regardless of ownership).
- **Tag management** — `POST /api/v2/tags`, `DELETE /api/v2/tags/:tagId`
  (`backend/routes/tags.route.js`, admin-only).

`AdminBlogs.jsx`'s delete/status actions still go through the `adminApi.js`
stub, not that real blog-delete endpoint. Wiring `deleteAdminBlog` to the
real `DELETE /blogs/delete-blog/:blogId` (via `src/routes/api.js`'s existing
`deleteBlog(blogId)`) is the natural next step — the read side (`GET
/admin/blogs`) is done, the delete side already works and is tested, only
the wiring between them is missing.

## Component/design notes for future maintainers

- Brand accents (cyan `#55DDE0` / pink `#FF2DAA`) are hardcoded hex, matching
  the same convention the public site uses (`src/components/blog/blogUi.jsx`).
  They are **not** bound to the `cupcake`/`night` DaisyUI theme tokens on
  purpose — a chart's "published" color should read as the same cyan in both
  themes. Chrome (grid lines, axis labels, borders) uses `currentColor` +
  `text-base-content/*` Tailwind classes instead, which *does* react to theme.
- The three chart components (`src/admin/components/charts/`) are
  dependency-free inline SVG, sized via `viewBox` + `width: 100%` for
  responsiveness — no chart library was added.
- Routing is `react-router-dom` (already the only router in this project).
  Two files from the earlier pass (`AdminRoute.jsx`, `AdminSidebar.jsx`) were
  originally written against `@tanstack/react-router`, which was never
  installed — they were rewritten for `react-router-dom` rather than adding a
  second router. `AdminLayout.jsx` uses a standard react-router-dom nested
  route + `<Outlet/>`.
- `AdminActionMenu.jsx` and `AdminEmptyState.jsx` were similarly rewritten —
  the earlier pass used `lucide-react` (never installed) and shadcn/ui-style
  utility classes (`bg-card`, `text-foreground`, `border-border`) that don't
  exist in this project's Tailwind config. Both now use FontAwesome + DaisyUI
  classes, matching every other file in `src/admin/`.
