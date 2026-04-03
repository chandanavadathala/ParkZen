import React, { useEffect, useState } from "react";
import { TrendingUp, Wallet, ArrowDownCircle } from "lucide-react";

const RevenueManagement = () => {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  useEffect(() => {
    fetchPayments();
    fetchRevenue();
  }, []);

  // 🔥 FETCH PAYMENTS
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const parkingId = localStorage.getItem("parkingId");

      const response = await fetch(
        `http://localhost:8080/api/owner/payments/${parkingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Invalid payment data", data);
        return;
      }

      setPayments(data);

      // 🔥 calculate revenue from SUCCESS payments
      const successPayments = data.filter(
        (p) => p.paymentStatus === "SUCCESS"
      );

      const total = successPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      setTotalRevenue(total);
      setAvailableBalance(total); // simple logic for now

    } catch (error) {
      console.error("Payment fetch error:", error);
    }
  };

  // 🔥 FETCH REVENUE (optional if backend gives total)
  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem("token");
      const parkingId = localStorage.getItem("parkingId");

      const response = await fetch(
        `http://localhost:8080/api/owner/revenue/${parkingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Revenue API:", data);

    } catch (error) {
      console.error("Revenue error:", error);
    }
  };

  // 🔥 WITHDRAW BUTTON
  const handleRequestPayout = () => {
    if (availableBalance > 0) {
      alert(`Success! $${availableBalance} withdrawn.`);
      setTotalWithdrawn((prev) => prev + availableBalance);
      setAvailableBalance(0);
    } else {
      alert("No funds available.");
    }
  };

  return (
    <div className="space-y-6">
      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL EARNED */}
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase">
            Total Earned
          </h3>
          <p className="text-3xl font-black text-slate-900">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        {/* WITHDRAWN */}
        <div className="bg-white p-6 rounded-3xl border shadow-sm border-l-4 border-blue-500">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase">
            Total Withdrawn
          </h3>
          <p className="text-3xl font-black text-blue-600">
            ${totalWithdrawn.toFixed(2)}
          </p>
          <div className="text-slate-400 text-[10px] mt-2 flex items-center gap-1">
            <ArrowDownCircle size={12} /> Lifetime Transfers
          </div>
        </div>

        {/* AVAILABLE */}
        <div className="bg-slate-900 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] text-slate-400 uppercase">
              Available
            </h3>
            <p className="text-2xl text-white font-bold">
              ${availableBalance.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={availableBalance === 0}
            className={`mt-4 py-3 rounded-xl font-bold ${
              availableBalance > 0
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            Withdraw to Bank
          </button>
        </div>
      </div>

      {/* PAYMENT TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-bold text-sm uppercase">
            Payment History
          </h4>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-bold">
                  {p.booking?.user?.fullName || "N/A"}
                </td>

                <td className="p-4 font-black">
                  ${p.amount}
                </td>

                <td className="p-4 text-right">
                  <span
                    className={`text-xs font-bold ${
                      p.paymentStatus === "SUCCESS"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueManagement;