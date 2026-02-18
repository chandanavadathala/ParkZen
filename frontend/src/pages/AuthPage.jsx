import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mobile || mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      alert("Enter your password");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      alert("Enter your full name");
      return;
    }

    if (mode === "signup" && role === "user" && !vehicleNumber.trim()) {
      alert("Enter your vehicle number");
      return;
    }

    // Normal login for User/Owner
    if (mode === "login" && role !== "admin") {
      navigate("/verify-otp", {
        state: { name, mobile, email, password, role, ...(role==="user" && {vehicleNumber}) },
      });
      return;
    }

    // Signup
    if (mode === "signup") {
      navigate("/verify-otp", {
        state: { name, mobile, email, password, role, ...(role==="user" && {vehicleNumber}) },
      });
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 font-sans">
      <div className="grid w-full max-w-4xl overflow-hidden bg-white shadow-xl rounded-3xl md:grid-cols-2">

        {/* Left Branding */}
        <div className="hidden md:flex flex-col justify-between bg-emerald-500 p-10 text-white">
          <h2 className="text-3xl font-bold">ParkZen</h2>
          <p className="text-sm opacity-90">
            Smart parking made simple, fast and stress-free.
          </p>
          <span className="text-xs opacity-80">© 2026 ParkZen</span>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-12">
          <h3 className="text-2xl font-semibold mb-2">
            {mode === "login" && role === "admin"
              ? "Admin Login"
              : mode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            {mode === "login"
              ? "Login to continue parking smarter"
              : "Sign up to start using ParkZen"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECTION (Signup only, moved to top) */}
            {mode === "signup" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "user", label: "User" },
                    { id: "owner", label: "Owner" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-3 rounded-xl border text-sm font-medium transition
                        ${
                          role === r.id
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-white text-gray-700 hover:border-emerald-400"
                        }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FULL NAME (Signup only) */}
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            )}

            {/* VEHICLE NUMBER (Signup only for User) */}
            {mode === "signup" && role === "user" && (
              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            )}

            {/* MOBILE NUMBER */}
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              maxLength={10}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email address "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* PASSWORD (Login & Signup) */}
            {(mode === "signup" || mode === "login") && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                required
              />
            )}

            {/* ADMIN LOGIN BUTTON (Login only) */}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  if (!mobile || mobile.length !== 10) {
                    alert("Enter a valid 10-digit mobile number");
                    return;
                  }
                  if (!password) {
                    alert("Enter your password");
                    return;
                  }
                  navigate("/admin/dashboard", {
                    state: { mobile, password, role: "admin" },
                  });
                }}
                className="text-sm text-red-500 hover:underline mt-2"
              >
                Admin Login
              </button>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
            >
              {mode === "login" ? "Continue" : "Register & Continue"}
            </button>
          </form>

          {/* SWITCH MODE */}
          <div className="text-center text-sm mt-6 text-gray-600">
            {mode === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setRole("user"); // Reset role when switching
              }}
              className="ml-1 text-emerald-600 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}