import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PINK } from "../../components/blog/blogUi.jsx";

const buildPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current, current - 1, current + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push("...");
    out.push(p);
  });
  return out;
};

/* Server-pagination shaped: the page only knows page / totalPages / totalItems. */
const AdminPagination = ({ page = 1, totalPages = 1, totalItems = 0, limit = 10, onPageChange }) => {
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  return (
    <div className="grid gap-3 border-t border-base-300 px-4 py-3 sm:flex sm:items-center sm:justify-between">
      <p className="text-xs text-base-content/60">
        Showing <span className="font-semibold text-base-content">{from}</span>–
        <span className="font-semibold text-base-content">{to}</span> of{" "}
        <span className="font-semibold text-base-content">{totalItems}</span>
      </p>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
            className="btn btn-xs h-8 rounded-lg border-base-300 bg-base-100 px-2.5 disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
          </button>

          {buildPages(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`gap-${i}`} className="px-1 text-xs text-base-content/40">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`btn btn-xs h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${
                  p === page ? "border-0 text-white" : "border-base-300 bg-base-100"
                }`}
                style={p === page ? { backgroundColor: PINK } : undefined}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
            className="btn btn-xs h-8 rounded-lg border-base-300 bg-base-100 px-2.5 disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default AdminPagination;
