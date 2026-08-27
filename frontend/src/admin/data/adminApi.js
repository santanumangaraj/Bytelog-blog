/* ---------------------------------------------------------------------------
   Admin data layer.

   Every admin page talks ONLY to this module — never to fixtures or the
   axios instance directly. Functions still without a real backend route are
   left as `async () => null` stubs; apiBridge.js's proxy degrades a
   genuinely-missing function the same way, but these are kept as named
   stubs (rather than deleted) so the exact signature/shape for each one is
   documented right where it'll be implemented, instead of only in
   MISSING.md.

   getAdminBlogs / getAdminUsers are wired below — see the comment on each
   for the exact backend route/contract they expect. Every other function
   still returns null until its backend route exists; every admin page
   already handles that by showing its empty/error state rather than
   fabricated data.
--------------------------------------------------------------------------- */
import API from "../../routes/api.js";

// Drops "all"/"" filter values before sending — so the backend only ever
// sees a query param when it should actually filter by it, instead of
// having to special-case the literal string "all" for every filter.
const stripUnfiltered = (params = {}) => {
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === "all" || value === "" || value == null) continue;
    out[key] = value;
  }
  return out;
};

/* ---------------- dashboard ---------------- */

// -> { stats, userGrowth, publishingActivity, statusDistribution, recentBlogs, recentUsers }
export const getAdminDashboard = async (/* { growthRange } */) => null;

// -> [{ label, date, users }]
export const getAdminUserGrowth = async (/* range */) => null;

/* ---------------- blogs ---------------- */

/**
 * Backend contract to build:
 *   GET /api/v2/admin/blogs?page&limit&query&status&author&sort
 *   Auth: verifyJWT, verifyAdmin (backend/middlewares/auth.middleware.js)
 *   - status/author only present when filtering (not "all")
 *   - status: "published" | "draft" | "archived"
 *   - sort: "newest" | "oldest"
 * Response body (ApiResponse.data):
 *   {
 *     rows: [{ id, title, slug, author, status, views, likes, coverImageUrl, createdAt }],
 *     pagination: { page, limit, totalItems, totalPages },
 *     stats: { total, published, draft, archived },
 *     authors: [string],   // distinct author display names, for the filter dropdown
 *   }
 */
export const getAdminBlogs = async (params = {}) =>
  (await API.get("/admin/blogs", { params: stripUnfiltered(params) })).data.data;

export const updateAdminBlogStatus = async (/* id, status */) => null;
export const deleteAdminBlog = async (/* id */) => null;

/* ---------------- users ---------------- */

/**
 * Backend contract to build:
 *   GET /api/v2/admin/users?page&limit&query&role&status&sort
 *   Auth: verifyJWT, verifyAdmin
 *   - role/status only present when filtering (not "all")
 *   - role: "ADMIN" | "READER"   status: "active" | "suspended"
 *   - "status" has no backend column yet (see MISSING.md / user model) —
 *     either add one, or omit `status`/`suspended` from the response until
 *     it exists; AdminStatusBadge and the Users page tolerate a missing value.
 * Response body (ApiResponse.data):
 *   {
 *     rows: [{ id, name, email, avatarUrl, role, status, blogsCount, joinedAt }],
 *     pagination: { page, limit, totalItems, totalPages },
 *     stats: { total, admins, active, suspended },
 *   }
 */
export const getAdminUsers = async (params = {}) =>
  (await API.get("/admin/users", { params: stripUnfiltered(params) })).data.data;

export const updateAdminUserRole = async (/* id, role */) => null;
export const updateAdminUserStatus = async (/* id, status */) => null;
export const deleteAdminUser = async (/* id */) => null;

/* ---------------- reports ---------------- */

// -> { rows, pagination, counts }
export const getAdminReports = async (/* { page, limit, status } */) => null;

export const updateAdminReportStatus = async (/* id, status */) => null;

/* ---------------- settings / profile ---------------- */

// -> { general, security, moderation, notifications }
export const getAdminSettings = async () => null;

export const updateAdminSettings = async (/* section, values */) => null;

// -> { id, fullName, username, email, role, status, avatarUrl, joinedAt }
export const getAdminProfile = async () => null;
