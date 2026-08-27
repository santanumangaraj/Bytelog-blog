import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../auth/useAdminAuth";

/**
 * AdminSidebar — main admin navigation.
 *
 * Routes with react-router-dom (matches the rest of the app) — NavLink's
 * built-in `isActive` gives active-state styling without any extra state.
 */
const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "fa-gauge-high" },
  { to: "/admin/blogs", label: "Blogs", icon: "fa-file-lines" },
  { to: "/admin/users", label: "Users", icon: "fa-users" },
  { to: "/admin/reports", label: "Reports", icon: "fa-flag" },
  { to: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

function SidebarBody({ collapsed = false, onNavigate }) {
  const { user, logout } = useAdminAuth();
  const name = user?.fullName ?? user?.name ?? "Admin";
  const email = user?.email ?? "admin@bytelog.dev";

  return (
    <div className="flex h-full flex-col border-r border-base-300 bg-base-200">
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-4 ${collapsed ? "justify-center px-0" : ""}`}>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
          <i className="fa-solid fa-code" />
        </span>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base font-bold text-base-content">ByteLog</p>
            <p className="truncate text-xs text-base-content/60">Admin Panel</p>
          </div>
        )}
      </div>

      <div className="mx-4 border-t border-base-300" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/20"
                      : "text-base-content/70 hover:bg-base-300/60 hover:text-base-content"
                  }`
                }
              >
                <i className={`fa-solid ${item.icon} w-4 text-center`} aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile + logout */}
      <div className="border-t border-base-300 p-3">
        <NavLink
          to="/admin/profile"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-base-300/60 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? name : undefined}
        >
          <div className="avatar placeholder">
            <div className="size-8 rounded-full bg-secondary/20 text-xs font-semibold text-secondary">
              {user?.avatarImageUrl ? (
                <img src={user.avatarImageUrl} alt="" className="rounded-full" />
              ) : (
                <span>{name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-base-content">{name}</p>
              <p className="truncate text-xs text-base-content/60">{email}</p>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          onClick={() => logout?.()}
          className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/70 transition-colors hover:bg-error/10 hover:text-error ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" aria-hidden="true" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}) {
  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-200 ease-out lg:block ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className={`fixed inset-y-0 left-0 ${collapsed ? "w-[76px]" : "w-64"} transition-[width] duration-200 ease-out`}>
          <SidebarBody collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 transition-transform duration-200 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarBody onNavigate={onCloseMobile} />
        </div>
      </div>
    </>
  );
}
