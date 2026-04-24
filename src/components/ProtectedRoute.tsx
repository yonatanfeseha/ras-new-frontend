import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken } from "../auth/authStore";
import { refresh } from "../auth/authService";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (token) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        await refresh();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
