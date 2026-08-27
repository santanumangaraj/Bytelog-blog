import { useEffect, useRef } from "react";

/**
 * AdminConfirmModal — presentational confirmation dialog.
 * The parent owns the mutation; this component never calls an API.
 */
export default function AdminConfirmModal({
  open = false,
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger", // "danger" | "warning" | "default"
  icon,
  children,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const tone =
    variant === "danger"
      ? { btn: "btn-error", ring: "bg-error/10 text-error", fa: "fa-triangle-exclamation" }
      : variant === "warning"
        ? { btn: "btn-warning", ring: "bg-warning/10 text-warning", fa: "fa-circle-exclamation" }
        : { btn: "btn-primary", ring: "bg-primary/10 text-primary", fa: "fa-circle-question" };

  return (
    <div className="modal modal-open" role="presentation">
      {/* Backdrop click closes, but never while a mutation is in flight. */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby={description ? "admin-confirm-desc" : undefined}
        className="modal-box relative z-10 max-w-md border border-base-300 bg-base-100 text-base-content"
      >
        <div className="flex gap-4">
          <div
            className={`grid size-10 shrink-0 place-items-center rounded-full ${tone.ring}`}
            aria-hidden="true"
          >
            {icon ?? <i className={`fa-solid ${tone.fa}`} />}
          </div>
          <div className="min-w-0">
            <h3 id="admin-confirm-title" className="text-base font-semibold">
              {title}
            </h3>
            {description ? (
              <p id="admin-confirm-desc" className="mt-1 text-sm text-base-content/60">
                {description}
              </p>
            ) : null}
            {children ? <div className="mt-3 text-sm">{children}</div> : null}
          </div>
        </div>

        <div className="modal-action mt-6">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onCancel?.()}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={`btn btn-sm ${tone.btn}`}
            onClick={() => !loading && onConfirm?.()}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <span className="loading loading-spinner loading-xs" /> : null}
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
