import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faSun,
  faMoon,
  faUser,
  faGear,
  faRightFromBracket,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAdminAuth } from "../auth/useAdminAuth.js";

/**
 * AdminNavbar — top bar for the admin shell.
 * `title` is the current page's heading (AdminLayout derives it from the
 * route); `onOpenSidebar` opens the mobile drawer (AdminSidebar owns the
 * drawer itself, this just toggles its `mobileOpen` state in AdminLayout).
 */
const AdminNavbar = ({ title = "Dashboard", onOpenSidebar }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAdminAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef(null);

  const isDark = theme === "night";
  const name = user?.fullName ?? user?.name ?? "Admin";
  const email = user?.email ?? "admin@bytelog.dev";

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout?.();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
        className="btn btn-ghost btn-sm btn-circle lg:hidden"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-base-content sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "cupcake" : "night")}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="btn btn-ghost btn-sm btn-circle"
        >
          <FontAwesomeIcon icon={faBell} />
        </button>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-base-200"
          >
            <div className="avatar placeholder">
              <div className="size-8 rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {user?.avatarImageUrl ? (
                  <img src={user.avatarImageUrl} alt="" className="rounded-full" />
                ) : (
                  <span>{name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="hidden text-[10px] text-base-content/50 sm:block" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-base-300 bg-base-100 py-1 shadow-lg"
            >
              <div className="border-b border-base-300 px-3.5 py-3">
                <p className="truncate text-sm font-semibold text-base-content">{name}</p>
                <p className="truncate text-xs text-base-content/60">{email}</p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin/profile");
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-base-content transition-colors hover:bg-base-200"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 text-center text-base-content/50" />
                View Profile
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin/settings");
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-base-content transition-colors hover:bg-base-200"
              >
                <FontAwesomeIcon icon={faGear} className="w-4 text-center text-base-content/50" />
                Settings
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-error transition-colors hover:bg-error/10"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-4 text-center" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
