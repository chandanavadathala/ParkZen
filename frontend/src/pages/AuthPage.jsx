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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Owner-specific fields
  const [parkingName, setParkingName] = useState("");
  const [parkingAddress, setParkingAddress] = useState("");

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

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          
          try {
            // Use reverse geocoding to get address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              setParkingAddress(data.display_name);
              alert("Location captured successfully!");
            } else {
              // Fallback to coordinates if address not found
              setParkingAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              alert("Location captured (coordinates only)");
            }
          } catch (error) {
            // If geocoding fails, use coordinates
            setParkingAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            alert("Location captured (coordinates only)");
            console.error("Geocoding error:", error);
          }
        },
        (error) => {
          alert("Unable to retrieve location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!mobile || mobile.length !== 10) {
    alert("Enter valid mobile number");
    return;
  }

  if (!password) {
    alert("Enter password");
    return;
  }

  try {
    // 🔐 LOGIN
    if (mode === "login") {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrMobile: email || mobile,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("parkingId", data.parkingId);
      localStorage.setItem("role", data.role);

      alert("Login successful!");

      // 🔥 Role-based navigation
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/dashboard");
      }
    }

    // 📝 SIGNUP
    else {
      const url =
        role === "owner"
          ? "http://localhost:8080/api/auth/register/owner"
          : "http://localhost:8080/api/auth/register/user";

      const body =
        role === "owner"
          ? {
              fullName: name,
              mobile,
              email,
              password,
              parkingName,
              parkingAddress,
              latitude: latitude,
             longitude: longitude,
            }
          : {
              fullName: name,
              mobile,
              email,
              password,
              vehicleNumber,
            };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful!");

      // 🔥 Go to OTP page
      navigate("/verify-otp", {
        state: {
          role,
          mobile,
          email,
        },
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
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

            {/* OWNER-SPECIFIC FIELDS */}
            {mode === "signup" && role === "owner" && (
              <>
                <input
                  type="text"
                  placeholder="Parking Name"
                  value={parkingName}
                  onChange={(e) => setParkingName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />

                <input
                  type="text"
                  placeholder="Parking Address"
                  value={parkingAddress}
                  onChange={(e) => setParkingAddress(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />

                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Get Current Location
                </button>
              </>
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
              ? "Don't have an account?"
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