import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const DeleteBlogModal = ({ open, title, deleting, error, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box rounded-3xl bg-base-100 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-error/10 text-error">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </span>
          <div className="min-w-0">
            <h3 className="font-barlow text-xl font-bold text-base-content">
              Delete this blog?
            </h3>
            <p className="mt-2 text-sm text-base-content/70">
              This action cannot be undone. Are you sure you want to delete
              {title ? ` "${title}"` : " this blog"}?
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="modal-action mt-6 flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="btn btn-ghost rounded-full font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="btn btn-error rounded-full px-6 font-semibold text-white"
          >
            {deleting && <span className="loading loading-spinner loading-xs" />}
            {deleting ? "Deleting..." : "Delete Blog"}
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label="Close"
        className="modal-backdrop"
        onClick={deleting ? undefined : onCancel}
      />
    </div>
  );
};

export default DeleteBlogModal;