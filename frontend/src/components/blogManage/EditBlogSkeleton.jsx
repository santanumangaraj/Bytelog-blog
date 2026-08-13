import React from "react";

const EditBlogSkeleton = () => (
  <>
    <div className="skeleton h-52 w-full rounded-3xl" />
    <div className="mt-6 skeleton h-10 w-48 rounded-full" />
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <div className="space-y-6">
        <div className="skeleton h-28 w-full rounded-3xl" />
        <div className="skeleton h-40 w-full rounded-3xl" />
        <div className="skeleton h-96 w-full rounded-3xl" />
      </div>
      <div className="space-y-6">
        <div className="skeleton h-64 w-full rounded-3xl" />
        <div className="skeleton h-56 w-full rounded-3xl" />
      </div>
    </div>
  </>
);

export default EditBlogSkeleton;