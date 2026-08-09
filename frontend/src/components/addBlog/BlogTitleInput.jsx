import React from "react";
import FieldError from "./FieldError.jsx";

const BlogTitleInput = ({ value, onChange, error }) => (
  <div className="card rounded-3xl bg-base-100 p-5 shadow-md sm:p-7">
    <label htmlFor="blog-title" className="sr-only">
      Blog title
    </label>
    <input
      id="blog-title"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write an engaging title..."
      aria-invalid={Boolean(error)}
      className="font-barlow w-full bg-transparent text-2xl font-bold text-base-content outline-none placeholder:text-base-content/35 sm:text-4xl"
    />
    <div className="mt-4 h-px w-full bg-base-300" />
    <FieldError message={error} />
  </div>
);

export default BlogTitleInput;