import React, { useId } from "react";
import { CYAN, PINK } from "../blog/blogUi.jsx";

/* A loading ring in the site's own CYAN → PINK gradient, instead of a flat
   default-colored spinner — same diagonal gradient used everywhere else
   (buttons, headings, badges). Best on a neutral/light background; on top of
   a gradient-filled button the ring would blend in, so keep plain white
   spinners there. */
const BrandSpinner = ({ size = 20, className = "" }) => {
  const gradientId = useId();
  const strokeWidth = Math.max(2, Math.round(size / 8));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={`animate-spin motion-reduce:animate-none ${className}`}
      role="status"
      aria-label="Loading"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={CYAN} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
      </defs>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="85 62"
      />
    </svg>
  );
};

export default BrandSpinner;
