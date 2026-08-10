import React from "react";

const BlogDetailSkeleton = () => (
  <div className="mx-auto max-w-4xl">
    <div className="flex flex-col items-center gap-4">
      <div className="skeleton h-6 w-28 rounded-full" />
      <div className="skeleton h-10 w-4/5" />
      <div className="skeleton h-10 w-3/5" />
      <div className="skeleton h-4 w-full max-w-2xl" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex gap-4 pt-2">
        <div className="skeleton h-4 w-28" />
        <div className="skeleton h-4 w-24" />
      </div>
    </div>

    <div className="skeleton mt-10 h-56 w-full rounded-3xl sm:h-80 lg:h-96" />

    <div className="mt-10 space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`skeleton h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  </div>
);

export default BlogDetailSkeleton;