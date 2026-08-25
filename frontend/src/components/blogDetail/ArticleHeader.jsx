import React from "react";
import { Link } from "react-router-dom";
import { PINK, Meta, formatDate } from "../blog/blogUi.jsx";

const ArticleHeader = ({ blog }) => (
  <header className="mx-auto max-w-4xl text-center">
    {blog?.tags?.length > 0 && (
      <div className="flex flex-wrap justify-center gap-2">
        {blog.tags.map((t) => (
          <Link
            key={t.slug}
            to={`/blogs?tag=${t.slug}`}
            className="badge badge-lg border-0 text-[11px] font-semibold tracking-[0.2em] text-white uppercase"
            style={{ backgroundColor: PINK }}
          >
            {t.name}
          </Link>
        ))}
      </div>
    )}

    <h1 className="font-barlow mt-6 text-3xl leading-tight font-bold break-words text-base-content sm:text-4xl lg:text-5xl">
      {blog?.title}
    </h1>

    {blog?.excerpt && (
      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-base-content/70 sm:text-lg">
        {blog.excerpt}
      </p>
    )}

    <Meta
      className="mt-6 justify-center"
      author={blog?.authorDetails?.fullName}
      date={formatDate(blog?.createdAt)}
    />
  </header>
);

export default ArticleHeader;