import React from "react";

const BlogSkeleton = () => (
    <div className="space-y-12">
        <div className="card overflow-hidden rounded-3xl bg-base-100 p-0 shadow-md">
            <div className="grid gap-0 lg:grid-cols-2">
                <div className="skeleton h-56 w-full rounded-none sm:h-72 lg:h-full lg:min-h-[320px]" />
                <div className="space-y-3 p-6 sm:p-8">
                    <div className="skeleton h-8 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-5/6" />
                    <div className="flex gap-4 pt-2">
                        <div className="skeleton h-4 w-24" />
                        <div className="skeleton h-4 w-20" />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden rounded-2xl bg-base-100 shadow-md">
                    <div className="skeleton h-44 w-full rounded-none" />
                    <div className="space-y-3 p-5">
                        <div className="skeleton h-5 w-4/5" />
                        <div className="skeleton h-3 w-full" />
                        <div className="skeleton h-3 w-3/5" />
                        <div className="flex gap-3 pt-1">
                            <div className="skeleton h-3 w-20" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default BlogSkeleton;