import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { CYAN } from "../blog/blogUi.jsx";
import BlogStatusBadge from "./BlogStatusBadge.jsx";

/* Owner-only management strip shown on the Blog Details page.
   Rendering is a convenience — the backend still enforces ownership. */
const BlogActions = ({ status, onEdit, onDelete }) => (
  <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-base-100 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold tracking-[0.18em] text-base-content/50 uppercase">
        Owner actions
      </span>
      <BlogStatusBadge status={status} />
    </div>
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="btn btn-sm btn-outline gap-2 rounded-full font-semibold"
        style={{ color: CYAN, borderColor: CYAN }}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
        Edit Blog
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="btn btn-sm btn-ghost gap-2 rounded-full font-semibold text-error"
      >
        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
        Delete
      </button>
    </div>
  </div>
);

export default BlogActions;