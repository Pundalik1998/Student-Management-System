import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/authContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-slate-600">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

