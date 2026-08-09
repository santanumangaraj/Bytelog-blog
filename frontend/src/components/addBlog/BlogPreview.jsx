import React from "react";
import { CYAN, PINK, Meta, formatDate } from "../blog/blogUi.jsx";
import renderMarkdown from "./markdown.jsx";

const BlogPreview = ({ title, excerpt, content, coverUrl, author, blogType, status }) => (
  <article className="card overflow-hidden rounded-3xl bg-base-100 shadow-md">
    {coverUrl ? (
      <div className="bg-base-200">
        <img
          src={coverUrl}
          alt={title ? `Cover for ${title}` : "Blog cover"}
          className="h-56 w-full object-cover sm:h-80"
        />
      </div>
    ) : (
      <div
        className="h-40 w-full sm:h-56"
        style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
        aria-hidden="true"
      />
    )}

    <div className="p-5 sm:p-9">
      <div className="flex flex-wrap items-center gap-2">
        {blogType && (
          <span
            className="badge badge-lg border-0 text-[11px] font-semibold tracking-[0.2em] text-white uppercase"
            style={{ backgroundColor: PINK }}
          >
            {blogType}
          </span>
        )}
        {status && (
          <span className="badge badge-lg badge-ghost text-[11px] font-semibold tracking-[0.2em] uppercase">
            {status}
          </span>
        )}
      </div>

      <h1 className="font-barlow mt-5 text-2xl leading-tight font-bold break-words text-base-content sm:text-4xl">
        {title || "Untitled blog"}
      </h1>

      {excerpt && (
        <p className="mt-4 text-sm leading-relaxed text-base-content/70 sm:text-base">
          {excerpt}
        </p>
      )}

      <Meta
        className="mt-5"
        author={author || "You"}
        date={formatDate(new Date())}
      />

      <div className="mt-6 h-px w-full bg-base-300" />

      <div className="mt-4 text-sm sm:text-base">
        {content.trim() ? (
          renderMarkdown(content)
        ) : (
          <p className="text-base-content/50 italic">
            Nothing written yet — switch back to Edit to start your story.
          </p>
        )}
      </div>
    </div>
  </article>
);

export default BlogPreview;