import React from "react";

export const ProfileHeaderSkeleton = () => (
  <div className="overflow-hidden rounded-3xl bg-base-100 shadow-md">
    <div className="skeleton h-24 w-full rounded-none sm:h-28" />
    <div className="flex flex-col items-center gap-5 px-6 pb-8 sm:flex-row sm:items-end sm:px-8">
      <div className="skeleton -mt-12 h-24 w-24 shrink-0 rounded-2xl sm:-mt-14 sm:h-28 sm:w-28" />
      <div className="w-full space-y-3 pt-2">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-8 w-2/3 max-w-xs" />
        <div className="skeleton h-4 w-1/2 max-w-[16rem]" />
      </div>
    </div>
  </div>
);

export const ProfileCardSkeleton = () => (
  <div className="rounded-3xl bg-base-100 p-6 shadow-md sm:p-8">
    <div className="skeleton h-7 w-52" />
    <div className="mt-6 space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton h-9 w-9 shrink-0 rounded-xl" />
          <div className="w-full space-y-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MyBlogsSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl bg-base-100 shadow-md">
        <div className="skeleton aspect-[16/10] w-full rounded-none" />
        <div className="space-y-3 p-5">
          <div className="skeleton h-5 w-4/5" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);