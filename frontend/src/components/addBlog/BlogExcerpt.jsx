import React from "react";
import FieldError from "./FieldError.jsx";

const MAX = 300;

const BlogExcerpt = ({ value, onChange, error }) => (
  <div className="card mt-6 rounded-3xl bg-base-100 p-5 shadow-md sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <label
        htmlFor="blog-excerpt"
        className="text-sm font-semibold text-base-content"
      >
        Excerpt
      </label>
      <span className="text-xs text-base-content/50">
        {value.length}/{MAX}
      </span>
    </div>
    <textarea
      id="blog-excerpt"
      value={value}
      maxLength={MAX}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write a short description of your blog..."
      aria-invalid={Boolean(error)}
      className="textarea textarea-bordered mt-3 w-full resize-y rounded-2xl text-sm leading-relaxed"
    />
    <FieldError message={error} />
  </div>
);

export default BlogExcerpt;