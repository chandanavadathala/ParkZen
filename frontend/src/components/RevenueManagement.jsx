import React, { useState } from "react";
import { TrendingUp, DollarSign, Wallet, ArrowDownCircle } from "lucide-react";

const RevenueManagement = ({ bookings }) => {
  // 1. STATE FOR CALCULATIONS
  const [availableBalance, setAvailableBalance] = useState(3210.0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(9240.0);

  // Calculate revenue from Paid bookings
  const paidBookings = bookings.filter((b) => b.payment === "Paid");
  const totalRevenue = paidBookings.reduce((sum, _) => sum + 25, 0);

  // 2. THE BUTTON LOGIC
  const handleRequestPayout = () => {
    if (availableBalance > 0) {
      alert(`Success! $${availableBalance} has been sent to your bank.`);
      setTotalWithdrawn((prev) => prev + availableBalance); // Move money to Withdrawn
      setAvailableBalance(0); // Reset available balance
    } else {
      alert("No funds available to withdraw.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: TOTAL EARNED */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Total Earned
          </h3>
          <p className="text-3xl font-black text-slate-900">
            ${totalRevenue.toLocaleString()}.00
          </p>
          <div className="text-emerald-500 text-[10px] font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +12% growth
          </div>
        </div>

        {/* CARD 2: TOTAL WITHDRAWN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Total Withdrawn
          </h3>
          <p className="text-3xl font-black text-blue-600">
            ${totalWithdrawn.toLocaleString()}.00
          </p>
          <div className="text-slate-400 text-[10px] font-medium mt-2 flex items-center gap-1">
            <ArrowDownCircle size={12} /> Lifetime Transfers
          </div>
        </div>

        {/* CARD 3: AVAILABLE & ACTION */}
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Available
              </h3>
              <p className="text-2xl font-bold text-white">
                ${availableBalance.toLocaleString()}.00
              </p>
            </div>
            <Wallet className="text-blue-400 opacity-50" size={24} />
          </div>
          <button
            onClick={handleRequestPayout}
            disabled={availableBalance === 0}
            className={`w-full py-3 rounded-2xl font-black transition text-sm ${
              availableBalance > 0
                ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {availableBalance > 0 ? "Withdraw to Bank" : "Funds Withdrawn"}
          </button>
        </div>
      </div>

      {/* TRANSACTION TABLE (Same as before) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h4 className="font-black text-slate-800 text-sm uppercase">
            Payment History
          </h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paidBookings.map((b, i) => (
              <tr key={i}>
                <td className="p-4 font-bold text-slate-700 text-sm">
                  {b.user}
                </td>
                <td className="p-4 text-sm font-black">$25.00</td>
                <td className="p-4 text-right">
                  <span className="text-emerald-500 text-[10px] font-black uppercase">
                    Completed
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
