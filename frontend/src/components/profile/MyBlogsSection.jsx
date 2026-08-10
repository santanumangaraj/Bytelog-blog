import React from "react";
import { faRotateRight, faPenNib, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Reveal, SectionHeading } from "../blog/blogUi.jsx";
import BlogCard from "../blog/BlogCard.jsx";
import BlogPagination from "../blog/BlogPagination.jsx";
import StateCard from "../blog/StateCard.jsx";
import { MyBlogsSkeleton } from "./ProfileSkeleton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
}) => (
  <section className="mt-12">
    <SectionHeading
            label="Your work"
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
    <p className="-mt-6 mb-8 text-sm text-base-content/60">
      Articles you&apos;ve published on ByteLog.
    </p>

    {loading ? (
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
      <>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <Reveal key={blog?.id ?? i} delay={i * 80}>
              <BlogCard blog={blog} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </>
    )}
  </section>
);

export default MyBlogsSection;