import React from "react";
import { CheckCircle2 } from "lucide-react";

const BookingLogs = ({ bookings }) => {
  // Only show bookings that are already marked as Paid
  const paidBookings = bookings.filter((b) => b.payment === "Paid");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. SIMPLE STATUS BAR */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <h4 className="font-black text-slate-800 uppercase tracking-tighter">
            Confirmed Sessions ({paidBookings.length})
          </h4>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Live Updates Active
        </div>
      </div>

      {/* 2. THE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Slot</th>
              <th className="p-4">Vehicle No.</th>
              <th className="p-4">Time Window</th>
              <th className="p-4 text-right">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paidBookings.map((booking, idx) => (
              <tr
                key={booking.id || idx}
                className="hover:bg-slate-50/50 transition"
              >
                <td className="p-4">
                  <p className="font-bold text-slate-700">{booking.user}</p>
                  <p className="text-[9px] font-mono text-slate-400 uppercase">
                    Ref: {booking.id}
                  </p>
                </td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-black text-[10px]">
                    {booking.slot}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs font-bold text-slate-600">
                  {booking.vehicle}
                </td>
                <td className="p-4 text-xs text-slate-500 font-medium">
                  {booking.time}
                </td>
                <td className="p-4 text-right">
                  <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    ✓ Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {paidBookings.length === 0 && (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4">
              <CheckCircle2 className="text-slate-200" size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              No active paid bookings found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLogs;
