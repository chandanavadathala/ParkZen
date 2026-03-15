import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {

    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "owner") return <Navigate to="/owner/dashboard" replace />;
    if (role === "user") return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;