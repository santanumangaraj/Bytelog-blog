import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight,faEllipsisVertical,faPenToSquare,faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK, Meta, formatDate } from "./blogUi.jsx";
import BlogStatusBadge from "../blogManage/BlogStatusBadge.jsx";

const BlogCard = ({ blog, onOpen, showStatus = false, onEdit, onDelete }) => (
    <article
        onClick={() => onOpen?.(blog)}
        className="group card h-full cursor-pointer overflow-hidden rounded-2xl bg-base-100 shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
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
            {showStatus && blog?.status && (
                <BlogStatusBadge status={blog.status} className="absolute top-3 left-3 shadow-md" />
            )}
            {(onEdit || onDelete) && (
                <div
                className="dropdown dropdown-end absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
                >
                <button
                    type="button"
                    tabIndex={0}
                    aria-label="Blog actions"
                    className="btn btn-circle btn-sm border-0 bg-base-100/90 text-base-content shadow-md"
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu z-10 mt-2 w-36 rounded-2xl bg-base-100 p-2 shadow-xl"
                >
                    {onEdit && (
                    <li>
                        <button type="button" onClick={() => onEdit(blog)} className="rounded-xl">
                        <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                        Edit
                        </button>
                    </li>
                    )}
                    {onDelete && (
                    <li>
                        <button
                        type="button"
                        onClick={() => onDelete(blog)}
                        className="rounded-xl text-error"
                        >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                        Delete
                        </button>
                    </li>
                    )}
                </ul>
                </div>
            )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="font-barlow line-clamp-2 text-lg font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA]">
                {blog?.title}
            </h3>
            <p className="line-clamp-2 text-sm text-base-content/65">
                {blog?.excerpt}
            </p>
            {blog?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((t) => (
                        <Link
                            key={t.slug}
                            to={`/blogs?tag=${t.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="badge badge-outline badge-sm rounded-full text-[11px] font-medium hover:border-current"
                            style={{ color: PINK, borderColor: `${PINK}55` }}
                        >
                            #{t.name}
                        </Link>
                    ))}
                </div>
            )}
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
