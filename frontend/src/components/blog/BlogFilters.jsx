import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRotateRight } from "@fortawesome/free-solid-svg-icons";

const BlogFilters = ({
    query,
    sortBy,
    sortType,
    tag,
    availableTags = [],
    onQueryChange,
    onSortByChange,
    onSortTypeChange,
    onTagChange,
    onReset,
}) => (
    <div className="card rounded-3xl bg-base-100 p-4 shadow-md sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-base-content/50"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search blogs..."
                    className="input input-bordered w-full rounded-full pl-11"
                    aria-label="Search blogs"
                />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                {onTagChange && (
                    <select
                        value={tag || ""}
                        onChange={(e) => onTagChange(e.target.value)}
                        className="select select-bordered rounded-full"
                        aria-label="Filter by tag"
                    >
                        <option value="">All tags</option>
                        {availableTags.map((t) => (
                            <option key={t.slug} value={t.slug}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                )}

                <select
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    className="select select-bordered rounded-full"
                    aria-label="Sort by"
                >
                    <option value="createdAt">Created At</option>
                    <option value="publishedAt">Published At</option>
                    <option value="views">Views</option>
                </select>

                <select
                    value={sortType}
                    onChange={(e) => onSortTypeChange(e.target.value)}
                    className="select select-bordered rounded-full"
                    aria-label="Sort order"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>

            <button
                type="button"
                onClick={onReset}
                className="btn btn-ghost gap-2 rounded-full font-semibold"
            >
                <FontAwesomeIcon icon={faRotateRight} className="text-sm" />
                Reset
            </button>
        </div>
    </div>
);

export default BlogFilters;