import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

/* Debounced search input. Emits the committed value upward so pages can send
   it straight to the data layer as a query param (server-side search ready). */
const AdminSearch = ({ value = "", onChange, placeholder = "Search...", delay = 350, className = "" }) => {
  const [inner, setInner] = useState(value);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (inner !== value) onChange?.(inner);
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inner]);

  return (
    <label className={`relative min-w-0 ${className}`}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-base-content/40"
      />
      <input
        type="search"
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="input input-sm input-bordered h-10 w-full rounded-xl bg-base-100 pr-9 pl-9 text-sm"
      />
      {inner && (
        <button
          type="button"
          onClick={() => setInner("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-xs text-base-content/40 transition hover:text-base-content"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </label>
  );
};

export default AdminSearch;
