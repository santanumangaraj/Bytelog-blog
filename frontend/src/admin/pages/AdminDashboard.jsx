import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFileLines,
  faCircleCheck,
  faPenToSquare,
  faEye,
  faTrashCan,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { api, listOf, unwrap } from "../data/apiBridge.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminStatCard from "../components/AdminStatCard.jsx";
import AdminTable from "../components/AdminTable.jsx";
import AdminStatusBadge from "../components/AdminStatusBadge.jsx";
import AdminActionMenu from "../components/AdminActionMenu.jsx";
import AdminConfirmModal from "../components/AdminConfirmModal.jsx";
import AdminEmptyState from "../components/AdminEmptyState.jsx";
import { AdminCardSkeleton } from "../components/AdminLoadingState.jsx";
import { AdminSelect } from "../components/AdminFilters.jsx";
import UserGrowthChart from "../components/charts/UserGrowthChart.jsx";
import PublishingActivityChart from "../components/charts/PublishingActivityChart.jsx";
import StatusDistributionChart from "../components/charts/StatusDistributionChart.jsx";

const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [range, setRange] = useState("7d");
  const [growth, setGrowth] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = unwrap(await api.getAdminDashboard({ growthRange: range }));
      if (!res) throw new Error("empty response");
      setData(res);
      setGrowth(res.userGrowth ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!data) return;
    if (range === "7d") {
      setGrowth(data.userGrowth ?? []);
      return;
    }
    let alive = true;
    api.getAdminUserGrowth(range).then((res) => {
      if (alive) setGrowth(unwrap(res) ?? []);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const confirmDeleteBlog = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteAdminBlog(deleteTarget.id);
      setData((prev) => ({
        ...prev,
        recentBlogs: prev.recentBlogs.filter((b) => b.id !== deleteTarget.id),
      }));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const blogColumns = [
    {
      key: "title",
      label: "Blog",
      render: (row) => (
        <div className="min-w-0 max-w-[220px]">
          <p className="truncate font-medium text-base-content">{row.title}</p>
        </div>
      ),
    },
    { key: "author", label: "Author" },
    { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
    { key: "views", label: "Views", align: "right", render: (row) => row.views.toLocaleString() },
    { key: "likes", label: "Likes", align: "right" },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      align: "right",
      width: "w-12",
      render: (row) => (
        <AdminActionMenu
          actions={[
            { label: "View", icon: faEye, onClick: () => navigate(`/blog/${row.slug}`) },
            { label: "Edit", icon: faPenToSquare, onClick: () => navigate(`/blog/${row.slug}/edit`) },
            { label: "Delete", icon: faTrashCan, danger: true, onClick: () => setDeleteTarget(row) },
          ]}
        />
      ),
    },
  ];

  const userColumns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="avatar placeholder">
            <div className="size-8 rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              <span>{row.name.slice(0, 2).toUpperCase()}</span>
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
    {
      key: "joinedAt",
      label: "Joined",
      render: (row) => new Date(row.joinedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      align: "right",
      width: "w-12",
      render: () => (
        <AdminActionMenu
          actions={[{ label: "Manage users", icon: faUsers, onClick: () => navigate("/admin/users") }]}
        />
      ),
    },
  ];

  if (error) {
    return (
      <AdminEmptyState
        title="Couldn't load the dashboard"
        description="Something went wrong fetching admin stats."
        icon={faRotateRight}
        action={
          <button type="button" onClick={load} className="btn btn-sm rounded-full">
            Try again
          </button>
        }
      />
    );
  }

  const stats = data?.stats;

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Overview of your ByteLog platform" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard icon={faUsers} label="Total Users" value={stats?.totalUsers ?? 0} change={stats?.usersChange} accent="#55DDE0" loading={loading && !data} />
        <AdminStatCard icon={faFileLines} label="Total Blogs" value={stats?.totalBlogs ?? 0} change={stats?.blogsChange} accent="#FF2DAA" loading={loading && !data} />
        <AdminStatCard icon={faCircleCheck} label="Published Blogs" value={stats?.publishedBlogs ?? 0} change={stats?.publishedChange} accent="#4ADE80" loading={loading && !data} />
        <AdminStatCard icon={faPenToSquare} label="Draft Blogs" value={stats?.draftBlogs ?? 0} change={stats?.draftChange} accent="#F5B942" loading={loading && !data} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-base-content">User Growth</h2>
            <AdminSelect
              label="Range"
              value={range}
              onChange={setRange}
              options={RANGE_OPTIONS}
              className="w-40"
            />
          </div>
          {loading && !data ? <AdminCardSkeleton className="h-60" /> : <UserGrowthChart data={growth ?? []} />}
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-base-content">Blog Status Distribution</h2>
          {loading && !data ? (
            <AdminCardSkeleton className="h-60" />
          ) : (
            <StatusDistributionChart data={data?.statusDistribution ?? []} />
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-base-content">Publishing Activity</h2>
        {loading && !data ? (
          <AdminCardSkeleton className="h-60" />
        ) : (
          <PublishingActivityChart data={data?.publishingActivity ?? []} />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-base-content">Recent Blogs</h2>
          <AdminTable
            columns={blogColumns}
            data={listOf(data ?? {}, "recentBlogs")}
            loading={loading && !data}
            emptyMessage="No blogs yet."
            rowKey="id"
          />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-base-content">Recent Users</h2>
          <AdminTable
            columns={userColumns}
            data={listOf(data ?? {}, "recentUsers")}
            loading={loading && !data}
            emptyMessage="No users yet."
            rowKey="id"
          />
        </div>
      </div>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this blog?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBlog}
      />
    </div>
  );
};

export default AdminDashboard;
