/**
 * Pluggable auth bridge for the admin panel.
 *
 * Wired to the project's real AuthContext (src/context/AuthContext.jsx) —
 * the whole admin panel (AdminRoute, AdminSidebar, AdminNavbar, AdminProfile)
 * follows from this one file.
 *
 * Shape:
 *   { user: { fullName, email, role, avatarImageUrl } | null,
 *     isAuthenticated: boolean,
 *     isAdmin: boolean,
 *     loading: boolean,
 *     logout: () => void | Promise<void> }
 */
import { useAuth } from "../../context/AuthContext.jsx";

/** Kept for compatibility with anything still checking it directly — the
 *  gate below now uses the real AuthContext, so this no longer bypasses. */
export const ADMIN_AUTH_BYPASS = false;

export function useAdminAuth() {
  const { user, initializing, logout } = useAuth();

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    loading: initializing,
    logout,
  };
}
