import React from "react";
import { PINK } from "../blog/blogUi.jsx";
import FieldError from "./FieldError.jsx";

/* NOTE: blog types mirror the options your Blogs listing already filters on.
   Adjust this list if your backend enum differs. */
export const BLOG_TYPES = [
  "Technology",
  "Programming",
  "Career",
  "Design",
  "Personal",
];

const BlogSettings = ({ blogType, status, onBlogTypeChange, onStatusChange, error }) => (
  <div className="card mt-6 rounded-3xl bg-base-100 p-5 shadow-md sm:p-6">
    <p
      className="mb-1 text-xs font-semibold tracking-[0.2em] uppercase"
      style={{ color: PINK }}
    >
      Settings
    </p>
    <h2 className="font-barlow text-lg font-bold text-base-content">Blog Details</h2>

    <div className="mt-5">
      <label htmlFor="blog-type" className="text-sm font-semibold text-base-content">
        Blog Type
      </label>
      <select
        id="blog-type"
        value={blogType}
        onChange={(e) => onBlogTypeChange(e.target.value)}
        className="select select-bordered mt-2 w-full rounded-full"
      >
        <option value="">Select a type</option>
        {BLOG_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>

    <div className="mt-5">
      <span className="text-sm font-semibold text-base-content">Status</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ].map((opt) => {
          const active = status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              aria-pressed={active}
              className={`btn btn-sm rounded-full font-semibold transition ${
                active ? "border-0 text-white shadow-md" : "btn-ghost text-base-content/70"
              }`}
              style={active ? { backgroundColor: PINK } : undefined}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-base-content/55">
        Drafts stay private until you publish them.
      </p>
    </div>
  </div>
);

export default BlogSettings;