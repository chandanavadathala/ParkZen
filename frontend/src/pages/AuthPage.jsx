import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { saveToken } from "../api/authService";

export default function AuthPage() {

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // Owner Parking Details
  const [parkingName, setParkingName] = useState("");
  const [parkingAddress, setParkingAddress] = useState("");

  // Location (hidden fields)
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const navigate = useNavigate();

  // 📍 Get current location
  const getCurrentLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        alert("Location captured successfully");

      },
      () => {
        alert("Unable to get location");
      }
    );
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!mobile || mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      alert("Enter your password");
      return;
    }

    try {

      // ================= LOGIN =================

      if (mode === "login") {

        let endpoint = "";

        if (role === "user") endpoint = "/users/login";
        else if (role === "owner") endpoint = "/owners/login";
        else endpoint = "/admins/login";

        const res = await api.post(endpoint, {
          login: mobile || email,
          password: password,
        });

        saveToken(res.data);

        localStorage.setItem("role", role);

        if (role === "user") navigate("/user/dashboard");
        else if (role === "owner") navigate("/owner/dashboard");
        else navigate("/admin/dashboard");

        return;
      }

      // ================= SIGNUP =================

      if (mode === "signup") {

        if (!name.trim()) {
          alert("Enter your full name");
          return;
        }

        if (role === "user" && !vehicleNumber.trim()) {
          alert("Enter your vehicle number");
          return;
        }

        if (role === "owner") {

          if (!parkingName || !parkingAddress) {
            alert("Please enter parking details");
            return;
          }

          if (!latitude || !longitude) {
            alert("Please click 'Get Current Location'");
            return;
          }
        }

        const endpoint =
          role === "user" ? "/users/register" : "/owners/register";

        const payload =
          role === "user"
            ? {
                name,
                mobile,
                email,
                password,
                vehicleNumber
              }
            : {
                ownerName: name,
                mobile,
                email,
                password,
                parkingName,
                parkingAddress,
                latitude,
                longitude
              };

        await api.post(endpoint, payload);

        alert("Registration Successful! Please login.");

        setMode("login");
        setPassword("");

        return;
      }

    } catch (error) {

      alert(error.response?.data || "Something went wrong");
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
            {mode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            {mode === "login"
              ? "Login to continue parking smarter"
              : "Sign up to start using ParkZen"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECTION */}
            {mode === "signup" && (

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Register As
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {[{ id: "user", label: "User" }, { id: "owner", label: "Owner" }].map((r) => (

                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-3 rounded-xl border text-sm font-medium transition
                        ${role === r.id
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

            {/* FULL NAME */}
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            )}

            {/* USER VEHICLE NUMBER */}
            {mode === "signup" && role === "user" && (
              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            )}

            {/* OWNER PARKING DETAILS */}
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
      onClick={getCurrentLocation}
      className="w-full py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
            >
      📍 Get Current Location
    </button>
  </>
)}

            {/* MOBILE */}
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
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
            />

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
              className="w-full py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
            >
              {mode === "login" ? "Continue" : "Register & Continue"}
            </button>

          </form>

          <div className="text-center text-sm mt-6 text-gray-600">
            {mode === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setRole("user");
              }}
              className="ml-1 text-emerald-600 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}