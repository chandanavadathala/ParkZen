import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import OtpVerification from "./pages/OtpVerification";

// Dashboards
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🌐 Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* 👤 USER Dashboard */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 🏢 OWNER Dashboard */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🛡️ ADMIN Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
                <AdminDashboard />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;