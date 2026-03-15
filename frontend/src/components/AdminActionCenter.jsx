import React, { useState } from "react";
import { Mail, ShieldAlert, UserX, Send, UserCheck } from "lucide-react";

export default function AdminActionCenter({ selectedPerson }) {
  const [mailBody, setMailBody] = useState("");

  // Placeholder for the person details if none selected
  const person = selectedPerson || {
    name: "Select a User",
    role: "N/A",
    email: "none",
  };

  const handleAction = (actionType) => {
    if (!selectedPerson) {
      alert("Please select a user from the list first!");
      return;
    }
    console.log(`Performing ${actionType} on ${person.email}`);
    alert(`${actionType} successful for ${person.name}`);
  };

  return (
    <div className="bg-white rounded-[24px] p-7 border border-slate-200 shadow-sm transition-all">
      {/* Header with Selected User Status */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[15px] font-black m-0 flex items-center gap-2">
            📧 Communication Hub
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">
            Target: {person.name} ({person.role})
          </p>
        </div>
        {selectedPerson && (
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">
            CONNECTED
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email/Message Editor */}
        <div className="flex flex-col">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
            Custom Message Body
          </label>
          <textarea
            value={mailBody}
            onChange={(e) => setMailBody(e.target.value)}
            placeholder={`Message to ${person.name}...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-[16px] p-4 text-[12px] h-[140px] outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleAction("Email")}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Send size={14} /> Send Direct Mail
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-[16px] border border-dashed border-slate-300 p-5 flex flex-col justify-center gap-3">
          <p className="text-[11px] text-slate-500 text-center mb-2">
            Quick Actions for{" "}
            <span className="font-bold text-slate-700">{person.email}</span>
          </p>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleAction("Warning")}
              className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 py-2 rounded-lg text-[11px] font-bold flex items-center px-4 gap-3 transition"
            >
              <ShieldAlert size={16} /> Send Security Warning
            </button>

            <button
              onClick={() => handleAction("Block")}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg text-[11px] font-bold flex items-center px-4 gap-3 transition"
            >
              <UserX size={16} /> Block User Account
            </button>

            <button
              onClick={() => handleAction("Verify")}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2 rounded-lg text-[11px] font-bold flex items-center px-4 gap-3 transition"
            >
              <UserCheck size={16} /> Mark as Verified Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
