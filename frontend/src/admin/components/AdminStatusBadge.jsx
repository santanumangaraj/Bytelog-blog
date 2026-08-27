/**
 * AdminStatusBadge — generic status/role pill used across Blogs, Users, and
 * Reports tables. Covers every status vocabulary the admin panel deals with:
 *   blogs:   published | draft | archived
 *   users:   active | suspended
 *   roles:   ADMIN | READER
 *   reports: pending | resolved | dismissed
 * Falls back to a neutral badge for anything unrecognized instead of hiding it.
 */
const TONE = {
  published: "badge-success",
  active: "badge-success",
  resolved: "badge-success",
  admin: "badge-primary",

  draft: "badge-warning",
  pending: "badge-warning",

  archived: "badge-ghost",
  dismissed: "badge-ghost",
  reader: "badge-ghost",
  user: "badge-ghost",

  suspended: "badge-error",
};

const AdminStatusBadge = ({ status, className = "" }) => {
  const normalized = String(status ?? "").toLowerCase();
  if (!normalized) return null;

  const tone = TONE[normalized] ?? "badge-ghost";

  return (
    <span
      className={`badge badge-sm ${tone} border-0 text-[10px] font-semibold tracking-wide uppercase ${className}`}
    >
      {status}
    </span>
  );
};

export default AdminStatusBadge;
