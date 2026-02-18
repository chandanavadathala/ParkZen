import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const mobile = location.state?.mobile || "";
  const role = location.state?.role || "user";

  const handleVerify = () => {
    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    const userData = {
      isAuthenticated: true,
      role,
      mobile,
    };

    login(userData);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-end">
          <Link to="/login" className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Verify Your Number
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          OTP sent to {mobile}
        </p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center tracking-widest text-xl px-4 py-3 border rounded-xl"
        />

        <button
          onClick={handleVerify}
          className="w-full mt-6 py-3 text-white bg-emerald-500 rounded-xl"
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
}