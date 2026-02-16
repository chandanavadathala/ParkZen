import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  // ✅ If not logged in → go to Auth page
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If role not allowed → redirect to correct dashboard
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "owner") return <Navigate to="/owner" replace />;
    if (user.role === "user") return <Navigate to="/dashboard" replace />;
  }

  // ✅ If allowed → show page
  return children;
};

export default ProtectedRoute;