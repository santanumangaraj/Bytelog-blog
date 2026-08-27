import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faFileLines,
  faUser,
  faEye,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { PINK } from "../../components/blog/blogUi.jsx";
import { api, listOf, paginationOf, unwrap } from "../data/apiBridge.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminTable from "../components/AdminTable.jsx";
import AdminStatusBadge from "../components/AdminStatusBadge.jsx";
import AdminActionMenu from "../components/AdminActionMenu.jsx";
import AdminConfirmModal from "../components/AdminConfirmModal.jsx";
import AdminPagination from "../components/AdminPagination.jsx";
import AdminEmptyState from "../components/AdminEmptyState.jsx";

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "resolved", label: "Resolved" },
  { id: "dismissed", label: "Dismissed" },
];

const AdminReports = () => {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ rows: [], pagination: {}, counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reviewTarget, setReviewTarget] = useState(null);
  const [actionTarget, setActionTarget] = useState(null); // { row, status }
  const [actionSaving, setActionSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = unwrap(await api.getAdminReports({ page, limit: 8, status: tab }));
      if (!res) throw new Error("empty response");
      setResult({
        rows: listOf(res, "rows"),
        pagination: paginationOf(res, res.rows?.length ?? 0),
        counts: res.counts ?? {},
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    load();
  }, [load]);

  const changeTab = (id) => {
    setTab(id);
    setPage(1);
  };

  const confirmAction = async () => {
    if (!actionTarget) return;
    setActionSaving(true);
    try {
      await api.updateAdminReportStatus(actionTarget.row.id, actionTarget.status);
      setActionTarget(null);
      load();
    } finally {
      setActionSaving(false);
    }
  };

  const columns = [
    {
      key: "targetTitle",
      label: "Reported Item",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-base-200 text-base-content/50">
            <FontAwesomeIcon icon={row.targetType === "blog" ? faFileLines : faUser} className="text-xs" />
          </span>
          <span className="max-w-[200px] truncate font-medium text-base-content">{row.targetTitle}</span>
        </div>
      ),
    },
    { key: "targetType", label: "Type", render: (row) => <span className="capitalize">{row.targetType}</span> },
    { key: "reportedBy", label: "Reported By" },
    { key: "reason", label: "Reason", className: "max-w-[220px] truncate text-base-content/70" },
    { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
    { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      key: "actions",
      label: "",
      align: "right",
      width: "w-12",
      render: (row) => (
        <AdminActionMenu
          actions={[
            { label: "Review", icon: faEye, onClick: () => setReviewTarget(row) },
            { label: "Resolve", icon: faCircleCheck, onClick: () => setActionTarget({ row, status: "resolved" }) },
            { label: "Dismiss", icon: faCircleXmark, danger: true, onClick: () => setActionTarget({ row, status: "dismissed" }) },
          ]}
        />
      ),
    },
  ];

  if (error) {
    return (
      <AdminEmptyState
        title="Couldn't load reports"
        description="Something went wrong fetching reported content."
        icon={faFlag}
        action={
          <button type="button" onClick={load} className="btn btn-sm rounded-full">
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div>
      <AdminPageHeader title="Reports" subtitle="Review reported content and users" />

      <div className="mt-6 -mx-1 overflow-x-auto px-1">
        <div role="tablist" className="inline-flex min-w-full gap-1 rounded-full bg-base-100 p-1.5 shadow-sm sm:min-w-0">
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = t.id === "all" ? result.counts.all : result.counts[t.id];
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => changeTab(t.id)}
                className={`btn btn-sm gap-2 rounded-full border-0 px-4 font-semibold whitespace-nowrap ${
                  active ? "text-white" : "btn-ghost text-base-content/70"
                }`}
                style={active ? { backgroundColor: PINK } : undefined}
              >
                {t.label}
                {count != null && (
                  <span className={`badge badge-sm ${active ? "border-0 bg-white/25 text-white" : "badge-ghost"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <AdminTable columns={columns} data={result.rows} loading={loading} rowKey="id" emptyMessage="No reports in this view." />

        <AdminPagination
          page={result.pagination.currentPage ?? 1}
          totalPages={result.pagination.totalPages ?? 1}
          totalItems={result.pagination.totalItems ?? 0}
          limit={8}
          onPageChange={setPage}
        />
      </div>

      {/* Report details */}
      {reviewTarget && (
        <div className="modal modal-open" role="presentation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setReviewTarget(null)} aria-hidden="true" />
          <div className="modal-box relative z-10 max-w-lg border border-base-300 bg-base-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-base-content">{reviewTarget.targetTitle}</h3>
                <p className="mt-0.5 text-xs text-base-content/50 capitalize">{reviewTarget.targetType} report</p>
              </div>
              <AdminStatusBadge status={reviewTarget.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-base-content/50">Reported by</dt>
                <dd className="font-medium text-base-content">{reviewTarget.reportedBy}</dd>
              </div>
              <div>
                <dt className="text-xs text-base-content/50">Reported on</dt>
                <dd className="font-medium text-base-content">{new Date(reviewTarget.createdAt).toLocaleString()}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-base-content/50">Reason</dt>
                <dd className="font-medium text-base-content">{reviewTarget.reason}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-base-content/50">Details</dt>
                <dd className="text-base-content/80">{reviewTarget.details}</dd>
              </div>
            </dl>

            <div className="modal-action mt-6">
              <button type="button" className="btn btn-sm rounded-full" onClick={() => setReviewTarget(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm rounded-full btn-error btn-outline"
                onClick={() => {
                  setActionTarget({ row: reviewTarget, status: "dismissed" });
                  setReviewTarget(null);
                }}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="btn btn-sm rounded-full btn-success text-white"
                onClick={() => {
                  setActionTarget({ row: reviewTarget, status: "resolved" });
                  setReviewTarget(null);
                }}
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmModal
        open={Boolean(actionTarget)}
        title={actionTarget?.status === "resolved" ? "Resolve this report?" : "Dismiss this report?"}
        description={
          actionTarget
            ? actionTarget.status === "resolved"
              ? "This marks the report as handled."
              : "This marks the report as reviewed with no action taken."
            : ""
        }
        confirmLabel={actionTarget?.status === "resolved" ? "Resolve" : "Dismiss"}
        variant={actionTarget?.status === "resolved" ? "default" : "warning"}
        loading={actionSaving}
        onCancel={() => setActionTarget(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default AdminReports;
