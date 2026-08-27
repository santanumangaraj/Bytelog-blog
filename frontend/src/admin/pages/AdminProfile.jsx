import { useEffect, useState } from "react";
import { api, unwrap } from "../data/apiBridge.js";
import { useAdminAuth } from "../auth/useAdminAuth.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminStatusBadge from "../components/AdminStatusBadge.jsx";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-base-300 py-3 last:border-0">
    <span className="text-sm text-base-content/60">{label}</span>
    <span className="text-sm font-medium text-base-content">{value ?? "—"}</span>
  </div>
);

/**
 * Real name/email/role/join-date already come from AuthContext (via
 * useAdminAuth) — no need to wait on the getAdminProfile() stub for those.
 * Only `status` has no real equivalent yet (getAdminProfile isn't wired to
 * a backend endpoint — see MISSING.md), so it's shown only when that stub
 * eventually returns something instead of blocking the whole page.
 */
const AdminProfile = () => {
  const { user: authUser, loading: authLoading } = useAdminAuth();
  const [extra, setExtra] = useState(null);

  useEffect(() => {
    api.getAdminProfile().then((res) => setExtra(unwrap(res)));
  }, []);

  if (authLoading) {
    return (
      <div>
        <AdminPageHeader title="Profile" subtitle="Your ByteLog administrator account" />
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="skeleton h-56 w-full rounded-2xl xl:col-span-1" />
          <div className="skeleton h-56 w-full rounded-2xl xl:col-span-2" />
        </div>
      </div>
    );
  }

  const fullName = extra?.fullName ?? authUser?.fullName ?? "Admin";
  const username = extra?.username ?? authUser?.username;
  const email = extra?.email ?? authUser?.email;
  const role = extra?.role ?? authUser?.role;
  const status = extra?.status; // no real endpoint yet
  const joinedAt = extra?.joinedAt ?? authUser?.createdAt;
  const avatarUrl = extra?.avatarUrl ?? authUser?.avatarImageUrl;

  return (
    <div>
      <AdminPageHeader title="Profile" subtitle="Your ByteLog administrator account" />

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
          <div className="avatar placeholder mx-auto">
            <div className="size-20 rounded-full bg-primary/15 text-2xl font-semibold text-primary">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="rounded-full" />
              ) : (
                <span>{fullName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-bold text-base-content">{fullName}</h2>
          {username && <p className="text-sm text-base-content/60">@{username}</p>}
          <div className="mt-3 flex justify-center gap-2">
            {role && <AdminStatusBadge status={role} />}
            {status && <AdminStatusBadge status={status} />}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:col-span-2">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-base-content">Profile Information</h3>
            <InfoRow label="Full name" value={fullName} />
            <InfoRow label="Username" value={username && `@${username}`} />
            <InfoRow label="Email" value={email} />
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-base-content">Account Information</h3>
            <InfoRow label="Role" value={role} />
            <InfoRow label="Status" value={status} />
            <InfoRow label="Joined" value={joinedAt && new Date(joinedAt).toLocaleDateString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
