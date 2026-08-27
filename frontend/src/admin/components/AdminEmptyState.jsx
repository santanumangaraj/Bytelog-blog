import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

export default function AdminEmptyState({ title = "Nothing here yet", description, icon = faInbox, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#55DDE0]/10 text-[#0e7c80] dark:text-[#55DDE0]">
        <FontAwesomeIcon icon={icon} className="text-lg" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-base-content">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-base-content/60">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
