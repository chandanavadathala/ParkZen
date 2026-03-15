import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { user } = useAuth();

  // If no token → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is blocked due to negative wallet balance
  if (user?.isBlocked) {
    return <Navigate to="/login" state={{ blocked: true, message: "Account blocked due to negative wallet balance" }} replace />;
  }

  // If role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {

    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "owner") return <Navigate to="/owner/dashboard" replace />;
    if (role === "user") return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;