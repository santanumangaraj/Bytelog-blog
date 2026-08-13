import React from "react";
import { CYAN, PINK } from "../blog/blogUi.jsx";

const BlogStatusBadge = ({ status, className = "" }) => {
  const normalized = String(status || "").toLowerCase();
  if (!normalized) return null;

  const published = normalized === "published";
  const archived = normalized === "archived";
  const label = published ? "Published" : archived ? "Archived" : "Draft";

  return (
    <span
      className={`badge border-0 text-[10px] font-semibold tracking-[0.18em] uppercase ${
        published
          ? "text-white"
          : archived
            ? "bg-base-300 text-base-content/50"
            : "text-base-content/70"
      } ${className}`}
      style={
        published
          ? { backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }
          : undefined
      }
    >
      {label}
    </span>
  );
};

export default BlogStatusBadge;