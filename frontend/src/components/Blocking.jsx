import React, { useState } from "react";

const UserActionPanel = ({ user, onAction }) => {
  const [message, setMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleAlert = () => {
    if (!message) return alert("Please enter a warning message.");
    onAction("alert", { userId: user.id, message });
    setMessage("");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-slate-200">
      <h3 className="text-lg font-bold mb-4">
        Manage: {user.name}{" "}
        <span className="text-sm font-normal text-slate-500">
          ({user.role})
        </span>
      </h3>

      {/* Alert Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Send Alert Message
        </label>
        <textarea
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          rows="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reason for warning..."
        />
        <button
          onClick={handleAlert}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Send Alert
        </button>
      </div>

      <div className="flex gap-4 border-t pt-4">
        {/* Block Button */}
        <button
          onClick={() => onAction("block", { userId: user.id })}
          className="flex-1 px-4 py-2 bg-slate-800 text-white rounded hover:bg-black transition"
        >
          {user.isBlocked ? "Unblock User" : "Block User"}
        </button>

        {/* Delete Button (with simple guard) */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure? This action is permanent.")) {
              onAction("remove", { userId: user.id });
            }
          }}
          className="flex-1 px-4 py-2 bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-600 hover:text-white transition"
        >
          Remove {user.role}
        </button>
      </div>
    </div>
  );
};
