import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK, Meta, formatDate } from "./blogUi.jsx";

const BlogCard = ({ blog, onOpen }) => (
    <article
        onClick={() => onOpen(blog)}
        className="group card h-full cursor-pointer overflow-hidden rounded-2xl bg-base-100 shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
        <div className="aspect-[16/10] w-full overflow-hidden">
            {blog?.coverImageUrl ? (
                <img
                    src={blog.coverImageUrl}
                    alt={blog?.title || "Blog cover"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            ) : (
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})`,
                    }}
                />
            )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="font-barlow line-clamp-2 text-lg font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA]">
                {blog?.title}
            </h3>
            <p className="line-clamp-2 text-sm text-base-content/65">
                {blog?.excerpt}
            </p>
            <Meta
                author={blog?.authorDetails?.fullName}
                date={formatDate(blog?.createdAt)}
                className="mt-auto pt-2"
            />
            <span
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: PINK }}
            >
                Read More
                <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
            </span>
        </div>
    </article>
);

export default BlogCard;
