import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";

const AdminStatCard = ({ icon, label, value, change, hint, accent = "#55DDE0", loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="skeleton h-9 w-9 rounded-xl" />
        <div className="skeleton mt-4 h-3 w-24" />
        <div className="skeleton mt-3 h-7 w-20" />
        <div className="skeleton mt-3 h-3 w-32" />
      </div>
    );
  }

  const positive = Number(change) >= 0;

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <FontAwesomeIcon icon={icon} />
        </span>
        {change != null && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              positive ? "text-success" : "text-error"
            }`}
          >
            <FontAwesomeIcon
              icon={positive ? faArrowTrendUp : faArrowTrendDown}
              className="text-[10px]"
            />
            {positive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
        {label}
      </p>
      <p className="mt-1 font-barlow text-2xl font-bold text-base-content">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      {hint && <p className="mt-1 text-xs text-base-content/50">{hint}</p>}
    </div>
  );
};

export default AdminStatCard;
