import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminNavbar from "../components/AdminNavbar.jsx";

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/blogs": "Blog Management",
  "/admin/users": "User Management",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
};

const titleForPath = (pathname) => TITLES[pathname] ?? "Admin";

/**
 * AdminLayout — shell for every /admin/* page.
 *
 * react-router-dom nested routes (see App.jsx): this renders <Outlet/> for
 * whichever admin page route matched, sidebar + navbar stay mounted across
 * navigations.
 */
const AdminLayout = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-base-200/40">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`flex min-h-screen flex-col transition-[margin] duration-200 ease-out lg:ml-64 ${collapsed ? "lg:ml-[76px]" : ""}`}>
        <AdminNavbar title={titleForPath(pathname)} onOpenSidebar={() => setMobileOpen(true)} />

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden w-fit items-center gap-2 px-6 pt-3 text-xs font-medium text-base-content/40 transition-colors hover:text-base-content/70 lg:flex"
        >
          <i className={`fa-solid ${collapsed ? "fa-angles-right" : "fa-angles-left"}`} aria-hidden="true" />
          {collapsed ? "Expand" : "Collapse"}
        </button>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
