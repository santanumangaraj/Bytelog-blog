import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFloppyDisk, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK } from "../blog/blogUi.jsx";

const AddBlogHeader = ({ saving, publishing, savedAt, onSaveDraft, onPublish }) => {
  const busy = saving || publishing;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-base-100 shadow-md">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, ${CYAN}1F, transparent 55%, ${PINK}1F)`,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: CYAN }}
      />
      <div
        className="pointer-events-none absolute -right-12 -bottom-24 h-60 w-60 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: PINK }}
      />

      <div className="relative p-5 sm:p-8">
        <Link
          to="/blogs"
          className="btn btn-ghost btn-sm gap-2 rounded-full font-semibold text-base-content/70"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back to Blogs
        </Link>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p
              className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: PINK }}
            >
              New Story
            </p>
            <h1 className="font-barlow text-3xl leading-tight font-bold text-base-content sm:text-4xl">
              Create a New{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
              >
                Blog
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-base-content/70">
              Share your knowledge, ideas, and experiences with the developer
              community.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {savedAt && !busy && (
              <span className="text-xs text-base-content/60 sm:mr-1">
                Draft saved
              </span>
            )}
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={busy}
              className="btn btn-outline gap-2 rounded-full px-6 font-semibold"
              style={{ color: CYAN, borderColor: CYAN }}
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} className="text-sm" />
              )}
              {saving ? "Saving..." : savedAt ? "Saved" : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={onPublish}
              disabled={busy}
              className="btn gap-2 rounded-full border-0 px-7 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
              style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
            >
              {publishing ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              )}
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddBlogHeader;