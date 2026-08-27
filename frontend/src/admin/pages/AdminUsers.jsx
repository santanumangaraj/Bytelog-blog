import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUsers,
  faUserShield,
  faUserCheck,
  faUserSlash,
  faEye,
  faFileLines,
  faUserGear,
  faBan,
  faCircleCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { api, listOf, paginationOf, unwrap } from "../data/apiBridge.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminStatCard from "../components/AdminStatCard.jsx";
import AdminTable from "../components/AdminTable.jsx";
import AdminStatusBadge from "../components/AdminStatusBadge.jsx";
import AdminActionMenu from "../components/AdminActionMenu.jsx";
import AdminConfirmModal from "../components/AdminConfirmModal.jsx";
import AdminSearch from "../components/AdminSearch.jsx";
import AdminFilters, { AdminSelect, AdminRefreshButton } from "../components/AdminFilters.jsx";
import AdminPagination from "../components/AdminPagination.jsx";
import AdminEmptyState from "../components/AdminEmptyState.jsx";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "READER", label: "Reader" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const INITIAL_FILTERS = { page: 1, limit: 8, query: "", role: "all", status: "all", sort: "newest" };

const AdminUsers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [result, setResult] = useState({ rows: [], pagination: {}, stats: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);

  const [roleTarget, setRoleTarget] = useState(null);
  const [nextRole, setNextRole] = useState("READER");
  const [roleSaving, setRoleSaving] = useState(false);

  const [statusTarget, setStatusTarget] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(false);
      try {
        const res = unwrap(await api.getAdminUsers(filters));
        if (!res) throw new Error("empty response");
        setResult({
          rows: listOf(res, "rows"),
          pagination: paginationOf(res, res.rows?.length ?? 0),
          stats: res.stats ?? {},
        });
      } catch {
        setError(true);
      } finally {
        isRefresh ? setRefreshing(false) : setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const setFilter = (patch) => setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));

  const openRoleModal = (row) => {
    setRoleTarget(row);
    setNextRole(row.role);
  };

  const confirmRoleChange = async () => {
    if (!roleTarget) return;
    setRoleSaving(true);
    try {
      await api.updateAdminUserRole(roleTarget.id, nextRole);
      setRoleTarget(null);
      load(true);
    } finally {
      setRoleSaving(false);
    }
  };

  const confirmStatusToggle = async () => {
    if (!statusTarget) return;
    setStatusSaving(true);
    try {
      const next = statusTarget.status === "active" ? "suspended" : "active";
      await api.updateAdminUserStatus(statusTarget.id, next);
      setStatusTarget(null);
      load(true);
    } finally {
      setStatusSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteAdminUser(deleteTarget.id);
      setDeleteTarget(null);
      load(true);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="avatar placeholder">
            <div className="size-8 rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {row.avatarUrl ? (
                <img src={row.avatarUrl} alt="" className="rounded-full" />
              ) : (
                <span>{row.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>
          <span className="truncate font-medium text-base-content">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", className: "text-base-content/70" },
    { key: "role", label: "Role", render: (row) => <AdminStatusBadge status={row.role} /> },
    { key: "blogsCount", label: "Blogs", align: "right" },
    { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
    { key: "joinedAt", label: "Joined", render: (row) => new Date(row.joinedAt).toLocaleDateString() },
    {
      key: "actions",
      label: "",
      align: "right",
      width: "w-12",
      render: (row) => (
        <AdminActionMenu
          actions={[
            { label: "View Profile", icon: faEye, onClick: () => setViewTarget(row) },
            { label: "View Blogs", icon: faFileLines, onClick: () => navigate(`/admin/blogs?author=${encodeURIComponent(row.name)}`) },
            { label: "Change Role", icon: faUserGear, onClick: () => openRoleModal(row) },
            {
              label: row.status === "active" ? "Suspend" : "Reactivate",
              icon: row.status === "active" ? faBan : faCircleCheck,
              danger: row.status === "active",
              onClick: () => setStatusTarget(row),
            },
            { label: "Delete", icon: faTrashCan, danger: true, onClick: () => setDeleteTarget(row) },
          ]}
        />
      ),
    },
  ];

  if (error) {
    return (
      <AdminEmptyState
        title="Couldn't load users"
        description="Something went wrong fetching user data."
        icon={faUsers}
        action={
          <button type="button" onClick={() => load()} className="btn btn-sm rounded-full">
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div>
      <AdminPageHeader title="User Management" subtitle="Manage ByteLog users and administrators" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard icon={faUsers} label="Total" value={result.stats.total ?? 0} accent="#55DDE0" loading={loading} />
        <AdminStatCard icon={faUserShield} label="Admins" value={result.stats.admins ?? 0} accent="#FF2DAA" loading={loading} />
        <AdminStatCard icon={faUserCheck} label="Active" value={result.stats.active ?? 0} accent="#4ADE80" loading={loading} />
        <AdminStatCard icon={faUserSlash} label="Suspended" value={result.stats.suspended ?? 0} accent="#F87171" loading={loading} />
      </div>

      <div className="mt-6">
        <AdminFilters>
          <AdminSearch
            value={filters.query}
            onChange={(query) => setFilter({ query })}
            placeholder="Search by name or email..."
            className="sm:w-72"
          />
          <AdminSelect label="Role" value={filters.role} onChange={(role) => setFilter({ role })} options={ROLE_OPTIONS} className="sm:w-40" />
          <AdminSelect label="Status" value={filters.status} onChange={(status) => setFilter({ status })} options={STATUS_OPTIONS} className="sm:w-40" />
          <AdminRefreshButton onClick={() => load(true)} loading={refreshing} />
        </AdminFilters>

        <AdminTable columns={columns} data={result.rows} loading={loading} rowKey="id" emptyMessage="No users match these filters." />

        <AdminPagination
          page={result.pagination.currentPage ?? 1}
          totalPages={result.pagination.totalPages ?? 1}
          totalItems={result.pagination.totalItems ?? 0}
          limit={filters.limit}
          onPageChange={(page) => setFilter({ page })}
        />
      </div>

      {/* Read-only profile preview */}
      {viewTarget && (
        <div className="modal modal-open" role="presentation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewTarget(null)} aria-hidden="true" />
          <div className="modal-box relative z-10 max-w-sm border border-base-300 bg-base-100 text-center">
            <div className="avatar placeholder mx-auto">
              <div className="size-16 rounded-full bg-primary/15 text-lg font-semibold text-primary">
                {viewTarget.avatarUrl ? (
                  <img src={viewTarget.avatarUrl} alt="" className="rounded-full" />
                ) : (
                  <span>{viewTarget.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>
            <h3 className="mt-3 text-base font-semibold text-base-content">{viewTarget.name}</h3>
            <p className="text-sm text-base-content/60">{viewTarget.email}</p>
            <div className="mt-4 flex justify-center gap-2">
              <AdminStatusBadge status={viewTarget.role} />
              <AdminStatusBadge status={viewTarget.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-xl bg-base-200 p-3">
                <p className="text-xs text-base-content/50">Blogs</p>
                <p className="font-semibold text-base-content">{viewTarget.blogsCount}</p>
              </div>
              <div className="rounded-xl bg-base-200 p-3">
                <p className="text-xs text-base-content/50">Joined</p>
                <p className="font-semibold text-base-content">{new Date(viewTarget.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="modal-action mt-6 justify-center">
              <button type="button" className="btn btn-sm rounded-full" onClick={() => setViewTarget(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmModal
        open={Boolean(roleTarget)}
        title="Change user role"
        description={roleTarget ? `Update the role for ${roleTarget.name}.` : ""}
        confirmLabel="Save"
        variant="default"
        loading={roleSaving}
        onCancel={() => setRoleTarget(null)}
        onConfirm={confirmRoleChange}
      >
        <select value={nextRole} onChange={(e) => setNextRole(e.target.value)} className="select select-sm select-bordered w-full rounded-xl">
          {ROLE_OPTIONS.filter((o) => o.value !== "all").map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </AdminConfirmModal>

      <AdminConfirmModal
        open={Boolean(statusTarget)}
        title={statusTarget?.status === "active" ? "Suspend this user?" : "Reactivate this user?"}
        description={
          statusTarget
            ? statusTarget.status === "active"
              ? `${statusTarget.name} will lose access until reactivated.`
              : `${statusTarget.name} will regain access immediately.`
            : ""
        }
        confirmLabel={statusTarget?.status === "active" ? "Suspend" : "Reactivate"}
        variant={statusTarget?.status === "active" ? "danger" : "default"}
        loading={statusSaving}
        onCancel={() => setStatusTarget(null)}
        onConfirm={confirmStatusToggle}
      />

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this user?"
        description={deleteTarget ? `${deleteTarget.name}'s account will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminUsers;
