import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";

/**
 * Frontend-only route gate. Backend authorization remains authoritative —
 * this only hides UI, it does not secure data (every admin endpoint on the
 * backend independently re-checks req.user.role === "ADMIN").
 *
 * Not authenticated  -> signedOutTo ("/login")
 * Authenticated user -> nonAdminTo ("/")
 * Authenticated admin-> renders children
 */
export default function AdminRoute({ children, signedOutTo = "/login", nonAdminTo = "/" }) {
  const { isAuthenticated, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={signedOutTo} replace />;
  if (!isAdmin) return <Navigate to={nonAdminTo} replace />;

  return children;
}
