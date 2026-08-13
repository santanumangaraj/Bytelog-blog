import React, { useMemo, useState } from "react";
import {
  faRotateRight,
  faPenNib,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Reveal, SectionHeading } from "../blog/blogUi.jsx";
import BlogCard from "../blog/BlogCard.jsx";
import BlogPagination from "../blog/BlogPagination.jsx";
import StateCard from "../blog/StateCard.jsx";
import { MyBlogsSkeleton } from "./ProfileSkeleton.jsx";

const MyBlogsSection = ({
  blogs,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onOpen,
  onRetry,
  onStartWriting,
  onEdit,
  onDelete,
}) => {
  const [filter, setFilter] = useState("all");

  const publishedBlogs = useMemo(
    () => blogs?.filter((blog) => blog?.status === "published") || [],
    [blogs]
  );

  const draftBlogs = useMemo(
    () => blogs?.filter((blog) => blog?.status === "draft") || [],
    [blogs]
  );
  const archivedBlogs = useMemo(
    () => blogs?.filter((blog) => blog?.status === "archived") || [],
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    if (filter === "published") return publishedBlogs;
    if (filter === "draft") return draftBlogs;
    if (filter === "archived") return archivedBlogs;

    return blogs || [];
  }, [filter, blogs, publishedBlogs, draftBlogs,archivedBlogs]);

  const FilterButton = ({ value, children, count }) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`btn btn-sm rounded-full px-5 font-semibold transition ${
        filter === value
          ? "border-0 text-white shadow-md"
          : "btn-ghost text-base-content/60"
      }`}
      style={
        filter === value
          ? {
              backgroundImage:
                "linear-gradient(135deg, #55DDE0, #FF2DAA)",
            }
          : undefined
      }
    >
      {children}

      <span
        className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${
          filter === value
            ? "bg-white/20 text-white"
            : "bg-base-200 text-base-content/50"
        }`}
      >
        {count}
      </span>
    </button>
  );

  const BlogGrid = ({ blogs: blogList, emptyTitle }) => {
    if (!blogList?.length) {
      return (
        <div className="rounded-2xl border border-dashed border-base-300 py-10 text-center">
          <p className="text-sm text-base-content/50">{emptyTitle}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogList.map((blog, i) => (
            <Reveal key={blog?.id ?? i} delay={i * 80}>
              <BlogCard
                blog={blog}
                onOpen={onOpen}
                showStatus
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Reveal>
          ))}
      </div>
    );
  };

  return loading ? (
    <MyBlogsSkeleton />
  ) : error ? (
    <StateCard
      icon={faRotateRight}
      title="Unable to load your blogs"
      description="Please try again."
      actionLabel="Try Again"
      onAction={onRetry}
    />
  ) : !blogs?.length ? (
    <StateCard
      icon={faPenNib}
      title="No blogs yet"
      description="You haven't published any articles yet. Share your knowledge with the ByteLog community."
      actionLabel="Start Writing"
      onAction={onStartWriting}
    />
  ) : (
    <section>
      {/* Header */}
      <SectionHeading
        label="Your content"
        title="My Blogs"
        action={
          <button
            type="button"
            onClick={onStartWriting}
            className="btn gap-2 rounded-full border-0 px-6 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #55DDE0, #FF2DAA)",
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            New Blog
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        <FilterButton value="all" count={blogs?.length || 0}>
          All
        </FilterButton>

        <FilterButton value="published" count={publishedBlogs.length}>
          Published
        </FilterButton>

        <FilterButton value="draft" count={draftBlogs.length}>
          Drafts
        </FilterButton>
        <FilterButton value="archived" count={archivedBlogs.length}>
          Archived
        </FilterButton>
      </div>

      {/* ALL */}
      {filter === "all" && (
        <div className="space-y-12">
          {/* Published */}
          {publishedBlogs.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-barlow text-xl font-bold text-base-content">
                    Published
                  </h3>
                  <p className="mt-1 text-sm text-base-content/50">
                    Articles visible to the community
                  </p>
                </div>

                <span className="badge badge-ghost">
                  {publishedBlogs.length}
                </span>
              </div>

              <BlogGrid blogs={publishedBlogs} />
            </section>
          )}

          {/* Drafts */}
          {draftBlogs.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-barlow text-xl font-bold text-base-content">
                    Drafts
                  </h3>
                  <p className="mt-1 text-sm text-base-content/50">
                    Articles you're still working on
                  </p>
                </div>

                <span className="badge badge-ghost">
                  {draftBlogs.length}
                </span>
              </div>

              <BlogGrid blogs={draftBlogs} />
            </section>
          )}
        </div>
      )}

      {/* PUBLISHED FILTER */}
      {filter === "published" && (
        <section>
          <div className="mb-5">
            <h3 className="font-barlow text-xl font-bold text-base-content">
              Published
            </h3>
            <p className="mt-1 text-sm text-base-content/50">
              Articles visible to the community
            </p>
          </div>

          <BlogGrid
            blogs={filteredBlogs}
            emptyTitle="You don't have any published blogs yet."
          />
        </section>
      )}

      {/* DRAFT FILTER */}
      {filter === "draft" && (
        <section>
          <div className="mb-5">
            <h3 className="font-barlow text-xl font-bold text-base-content">
              Drafts
            </h3>
            <p className="mt-1 text-sm text-base-content/50">
              Articles you're still working on
            </p>
          </div>

          <BlogGrid
            blogs={filteredBlogs}
            emptyTitle="You don't have any drafts."
          />
        </section>
      )}

      {/* ARCHIVED FILTER */}
      {filter === "archived" && (
        <section>
          <div className="mb-5">
            <h3 className="font-barlow text-xl font-bold text-base-content">
              Archived
            </h3>
            <p className="mt-1 text-sm text-base-content/50">
              Articles you're still working on
            </p>
          </div>

          <BlogGrid
            blogs={filteredBlogs}
            emptyTitle="You don't have any drafts."
          />
        </section>
      )}

      {/* Pagination */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default MyBlogsSection;