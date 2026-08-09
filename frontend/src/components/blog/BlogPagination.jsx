import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PINK } from "./blogUi.jsx";

const buildPages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current, current - 1, current + 1]);
    const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out = [];
    list.forEach((p, i) => {
        if (i > 0 && p - list[i - 1] > 1) out.push("...");
        out.push(p);
    });
    return out;
};

const BlogPagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
    if (!totalPages || totalPages < 2) return null;
    const pages = buildPages(currentPage, totalPages);

    return (
        <nav
            aria-label="Blog pagination"
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="btn btn-sm gap-2 rounded-full border-base-300 bg-base-100 font-semibold shadow-sm disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                Previous
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`gap-${i}`} className="px-2 text-base-content/50">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`btn btn-sm rounded-full font-semibold shadow-sm transition ${p === currentPage
                                ? "border-0 text-white hover:scale-[1.03]"
                                : "border-base-300 bg-base-100"
                            }`}
                        style={p === currentPage ? { backgroundColor: PINK } : undefined}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="btn btn-sm gap-2 rounded-full border-base-300 bg-base-100 font-semibold shadow-sm disabled:opacity-50"
            >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
        </nav>
    );
};

export default BlogPagination;