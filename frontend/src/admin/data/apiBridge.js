/**
 * Thin resolver over your existing data layer (src/admin/data/adminApi.js).
 *
 * Why this exists: your adminApi.js may export functions as named exports, as a
 * default object, or both. The admin pages call through `api.<fn>` so they work
 * with either shape and degrade gracefully (returning null) when a mutation stub
 * is not present yet. No API logic lives here — only resolution + response
 * normalisation.
 */
import * as mod from "./adminApi";

const resolved = { ...(mod?.default ?? {}), ...mod };

export const api = new Proxy(
  {},
  {
    get(_t, key) {
      const fn = resolved[key];
      if (typeof fn === "function") return fn;
      return async () => {
        console.warn(`[adminApi] "${String(key)}" is not implemented in adminApi.js`);
        return null;
      };
    },
    has(_t, key) {
      return typeof resolved[key] === "function";
    },
  },
);

/** True when adminApi.js actually exports the given function. */
export function hasApi(name) {
  return typeof resolved[name] === "function";
}

/** Unwrap `{ data: {...} }` style envelopes. */
export function unwrap(res) {
  if (!res) return null;
  if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) return res.data;
  return res;
}

/** Pull a list out of a paginated response, whatever the key is named. */
export function listOf(payload, ...keys) {
  const data = unwrap(payload) ?? {};
  for (const key of [...keys, "items", "results", "data", "rows"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  return Array.isArray(data) ? data : [];
}

/** Normalise pagination metadata. */
export function paginationOf(payload, fallbackTotal = 0) {
  const data = unwrap(payload) ?? {};
  const p = data.pagination ?? data.meta ?? {};
  return {
    currentPage: p.currentPage ?? p.page ?? 1,
    totalPages: p.totalPages ?? p.pages ?? 1,
    totalItems:
      p.totalItems ?? p.total ?? p.totalBlogs ?? p.totalUsers ?? p.totalReports ?? fallbackTotal,
  };
}
