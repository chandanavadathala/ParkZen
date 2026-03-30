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

  // Hidden state for admin access
  const [adminClickCount, setAdminClickCount] = useState(0);
  const navigate = useNavigate();

  const handleAdminSecret = () => {
    const newCount = adminClickCount + 1;
    if (newCount === 5) {
      setRole("admin");
      setMode("login");
      setAdminClickCount(0);
      alert("Admin access enabled");
    } else {
      setAdminClickCount(newCount);
      // Reset count if they don't finish clicking within 3 seconds
      setTimeout(() => setAdminClickCount(0), 3000);
    }
  };

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

    // Admin redirection logic
    if (role === "admin") {
      navigate("/admin/dashboard", {
        state: { mobile, password, role: "admin" },
      });
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

    // Normal flow for User/Owner
    navigate("/verify-otp", {
      state: {
        name,
        mobile,
        email,
        password,
        role,
        ...(role === "user" && { vehicleNumber }),
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 font-sans p-4">
      <div className="grid w-full max-w-4xl overflow-hidden bg-white shadow-xl rounded-3xl md:grid-cols-2">
        {/* Left Branding */}
        <div className="hidden md:flex flex-col justify-between bg-emerald-500 p-10 text-white">
          <div>
            <h2 className="text-3xl font-bold">ParkZen</h2>
            <p className="mt-2 text-sm opacity-90">
              Smart parking made simple, fast and stress-free.
            </p>
          </div>

          {/* Hidden Admin Trigger: Click 5 times */}
          <span
            onClick={handleAdminSecret}
            className="text-xs opacity-50 cursor-default select-none hover:opacity-100 transition-opacity"
          >
            © 2026 ParkZen
          </span>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-12">
          <h3 className="text-2xl font-semibold mb-2">
            {role === "admin"
              ? "System Administration"
              : mode === "login"
                ? "Welcome Back"
                : "Create Account"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            {role === "admin"
              ? "Authorized access only"
              : mode === "login"
                ? "Login to continue parking smarter"
                : "Sign up to start using ParkZen"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ROLE SELECTION (Signup only) */}
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
                placeholder="Vehicle Number (e.g. MH12AB1234)"
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

            {/* EMAIL (Optional for login, required for signup) */}
            {(mode === "signup" || role === "admin") && (
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            )}

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              required
            />

            <button
              type="submit"
              className={`w-full py-3 text-white rounded-xl transition ${
                role === "admin"
                  ? "bg-slate-800 hover:bg-slate-900"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {role === "admin"
                ? "Admin Login"
                : mode === "login"
                  ? "Continue"
                  : "Register & Continue"}
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
                setRole("user"); // Reset to default role
              }}
              className="ml-1 text-emerald-600 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4 italic">
            Secure connection enabled
          </p>
        </div>
      </div>
    </div>
  );
}
