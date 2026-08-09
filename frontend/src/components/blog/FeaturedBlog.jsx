import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK, Meta, formatDate } from "./blogUi.jsx";

const FeaturedBlog = ({ blog, onOpen }) => (
    <article
        onClick={() => onOpen(blog)}
        className="group card cursor-pointer overflow-hidden rounded-3xl bg-base-100 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative overflow-hidden lg:h-full">
                <div className="aspect-[16/10] w-full overflow-hidden lg:h-full lg:min-h-[320px] lg:aspect-auto">
                    {blog?.coverImageUrl ? (
                        <img
                            src={blog.coverImageUrl}
                            alt={blog?.title || "Blog cover"}
                            loading="lazy"
                            className="h-full w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="h-full w-full rounded-2xl"
                            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
                        />
                    )}
                </div>
                <span
                    className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase shadow-md"
                    style={{ backgroundColor: PINK }}
                >
                    Featured
                </span>
            </div>

            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                <h3 className="font-barlow line-clamp-2 text-2xl font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA] sm:text-3xl">
                    {blog?.title}
                </h3>
                <p className="line-clamp-3 text-sm text-base-content/70 sm:text-base">
                    {blog?.excerpt}
                </p>
                <Meta
                    author={blog?.authorDetails?.fullName}
                    date={formatDate(blog?.createdAt)}
                    className="mt-2"
                />
                <span
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: PINK }}
                >
                    Read More
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                    />
                </span>
            </div>
        </div>
    </article>
);

export default FeaturedBlog;