import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

// actions: [{ label, icon?: FontAwesome icon object, onClick, danger? }]
export default function AdminActionMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Row actions"
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 items-center justify-center rounded-lg text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus:outline-none focus:ring-2 focus:ring-[#55DDE0]/60"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-base-300 bg-base-100 py-1 shadow-lg"
        >
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-base-200 ${
                a.danger ? "text-error" : "text-base-content"
              }`}
            >
              {a.icon && <FontAwesomeIcon icon={a.icon} className="w-4 text-center" aria-hidden="true" />}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
