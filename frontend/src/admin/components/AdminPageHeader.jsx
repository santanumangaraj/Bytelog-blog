import React from "react";

const AdminPageHeader = ({ title, subtitle, actions }) => (
  <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
    <div className="min-w-0">
      <h1 className="font-barlow truncate text-2xl font-bold text-base-content sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export default AdminPageHeader;
