import React from "react";

export const AdminTableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="divide-y divide-base-300">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-4 px-4 py-4">
        {Array.from({ length: cols }).map((__, c) => (
          <div
            key={c}
            className={`skeleton h-4 ${c === 0 ? "flex-[2]" : "flex-1"} ${c > 2 ? "hidden sm:block" : ""}`}
          />
        ))}
      </div>
    ))}
  </div>
);

export const AdminCardSkeleton = ({ className = "h-64" }) => (
  <div className={`skeleton w-full rounded-2xl ${className}`} />
);

export default AdminTableSkeleton;
