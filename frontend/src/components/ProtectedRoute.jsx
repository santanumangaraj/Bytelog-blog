import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/* Centralized auth guard for routes that require a logged-in user — replaces
   the ad hoc `if (!authUser) return <Navigate .../>` checks that used to be
   duplicated per page. */
const ProtectedRoute = () => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
