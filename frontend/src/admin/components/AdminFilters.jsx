import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export const AdminSelect = ({ label, value, onChange, options, className = "" }) => (
  <label className={`min-w-0 ${className}`}>
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="select select-sm select-bordered h-10 w-full rounded-xl bg-base-100 text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export const AdminRefreshButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    title="Refresh"
    aria-label="Refresh"
    className="btn btn-sm h-10 gap-2 rounded-xl border-base-300 bg-base-100 font-semibold shadow-sm"
  >
    <FontAwesomeIcon icon={faRotateRight} className={`text-xs ${loading ? "animate-spin" : ""}`} />
    <span className="hidden sm:inline">Refresh</span>
  </button>
);

/* Layout shell for the control strip above every admin table. */
const AdminFilters = ({ children }) =>{
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}


export default AdminFilters;
