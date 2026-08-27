import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  faFileLines,
  faCircleCheck,
  faPenToSquare,
  faBoxArchive,
  faEye,
  faTrashCan,
  faArrowRightArrowLeft,
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
import { CYAN, PINK } from "../../components/blog/blogUi.jsx";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const INITIAL_FILTERS = { page: 1, limit: 8, query: "", status: "all", author: "all", sort: "newest" };

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    author: searchParams.get("author") || "all",
  }));
  const [result, setResult] = useState({ rows: [], pagination: {}, stats: {}, authors: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [statusTarget, setStatusTarget] = useState(null);
  const [nextStatus, setNextStatus] = useState("draft");
  const [statusSaving, setStatusSaving] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(false);
      try {
        const res = unwrap(await api.getAdminBlogs(filters));
        if (!res) throw new Error("empty response");
        setResult({
          rows: listOf(res, "rows"),
          pagination: paginationOf(res, res.rows?.length ?? 0),
          stats: res.stats ?? {},
          authors: res.authors ?? [],
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteAdminBlog(deleteTarget.id);
      setDeleteTarget(null);
      load(true);
    } finally {
      setDeleting(false);
    }
  };

  const openStatusModal = (row) => {
    setStatusTarget(row);
    setNextStatus(row.status);
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    setStatusSaving(true);
    try {
      await api.updateAdminBlogStatus(statusTarget.id, nextStatus);
      setStatusTarget(null);
      load(true);
    } finally {
      setStatusSaving(false);
    }
  };

  const columns = [
    {
      key: "cover",
      label: "Cover",
      width: "w-16",
      render: (row) =>
        row.coverImageUrl ? (
          <img src={row.coverImageUrl} alt="" className="size-10 rounded-lg object-cover" />
        ) : (
          <div
            className="size-10 rounded-lg"
            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
          />
        ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => <p className="max-w-[240px] truncate font-medium text-base-content">{row.title}</p>,
    },
    { key: "author", label: "Author" },
    { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
    { key: "views", label: "Views", align: "right", render: (row) => row.views.toLocaleString() },
    { key: "likes", label: "Likes", align: "right" },
    { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
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
            { label: "Change Status", icon: faArrowRightArrowLeft, onClick: () => openStatusModal(row) },
            { label: "Delete", icon: faTrashCan, danger: true, onClick: () => setDeleteTarget(row) },
          ]}
        />
      ),
    },
  ];

  const authorOptions = [
    { value: "all", label: "All authors" },
    ...result.authors.map((a) => ({ value: a, label: a })),
  ];

  if (error) {
    return (
      <AdminEmptyState
        title="Couldn't load blogs"
        description="Something went wrong fetching blog data."
        icon={faFileLines}
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
      <AdminPageHeader title="Blog Management" subtitle="Manage all blogs published on ByteLog" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard icon={faFileLines} label="Total" value={result.stats.total ?? 0} accent="#94A3B8" loading={loading} />
        <AdminStatCard icon={faCircleCheck} label="Published" value={result.stats.published ?? 0} accent="#4ADE80" loading={loading} />
        <AdminStatCard icon={faPenToSquare} label="Draft" value={result.stats.draft ?? 0} accent="#F5B942" loading={loading} />
        <AdminStatCard icon={faBoxArchive} label="Archived" value={result.stats.archived ?? 0} accent="#94A3B8" loading={loading} />
      </div>

      <div className="mt-6">
        <AdminFilters>
          <AdminSearch
            value={filters.query}
            onChange={(query) => setFilter({ query })}
            placeholder="Search by title or author..."
            className="sm:w-72"
          />
          <AdminSelect label="Status" value={filters.status} onChange={(status) => setFilter({ status })} options={STATUS_OPTIONS} className="sm:w-40" />
          <AdminSelect label="Author" value={filters.author} onChange={(author) => setFilter({ author })} options={authorOptions} className="sm:w-44" />
          <AdminSelect label="Sort" value={filters.sort} onChange={(sort) => setFilter({ sort })} options={SORT_OPTIONS} className="sm:w-40" />
          <AdminRefreshButton onClick={() => load(true)} loading={refreshing} />
        </AdminFilters>

        <AdminTable
          columns={columns}
          data={result.rows}
          loading={loading}
          rowKey="id"
          emptyMessage="No blogs match these filters."
        />

        <AdminPagination
          page={result.pagination.currentPage ?? 1}
          totalPages={result.pagination.totalPages ?? 1}
          totalItems={result.pagination.totalItems ?? 0}
          limit={filters.limit}
          onPageChange={(page) => setFilter({ page })}
        />
      </div>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this blog?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <AdminConfirmModal
        open={Boolean(statusTarget)}
        title="Change blog status"
        description={statusTarget ? `Update the status of "${statusTarget.title}".` : ""}
        confirmLabel="Save"
        variant="default"
        loading={statusSaving}
        onCancel={() => setStatusTarget(null)}
        onConfirm={confirmStatusChange}
      >
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="select select-sm select-bordered w-full rounded-xl"
        >
          {STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </AdminConfirmModal>
    </div>
  );
};

export default AdminBlogs;
