import { useState } from "react";
import { Plus } from "lucide-react";

export default function AddSlotModal({ onAdd, onClose }) {
  const [newSlot, setNewSlot] = useState({
    name: "",
    type: "Open",
    size: "Medium",
    rate: "",
    isCovered: false,
  });

  const handleAdd = () => {
    if (!newSlot.name || !newSlot.rate)
      return alert("Please fill slot name and rate.");
    onAdd({
      id: Date.now(),
      name: newSlot.name,
      type: newSlot.type,
      size: newSlot.size,
      status: "available",
      rate: parseInt(newSlot.rate),
      isCovered: newSlot.isCovered,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-white font-black text-xl">Add New Slot</h3>
            <p className="text-slate-400 text-xs mt-1">
              Configure size, type & pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Slot Name */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Slot Name / Number
            </label>
            <input
              type="text"
              placeholder="e.g. A-105, VIP-3"
              value={newSlot.name}
              onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Size Selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Vehicle Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: "Small", label: "S", sub: "2-Wheeler", icon: "🛵" },
                {
                  size: "Medium",
                  label: "M",
                  sub: "Sedan / Hatch",
                  icon: "🚗",
                },
                { size: "Large", label: "L", sub: "SUV / MUV", icon: "🚙" },
                { size: "XL", label: "XL", sub: "Bus / Truck", icon: "🚌" },
              ].map(({ size, label, sub, icon }) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setNewSlot({ ...newSlot, size })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                    newSlot.size === size
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="font-black text-sm">{label}</span>
                  <span className="text-[9px] font-bold text-center leading-tight opacity-70">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Type & Rate Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                Slot Type
              </label>
              <select
                value={newSlot.type}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, type: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Covered">Covered</option>
                <option value="EV">EV Charging</option>
                <option value="Accessible">Accessible</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                Rate (₹/hr)
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={newSlot.rate}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, rate: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Covered Toggle */}
          <div
            onClick={() =>
              setNewSlot({ ...newSlot, isCovered: !newSlot.isCovered })
            }
            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              newSlot.isCovered
                ? "border-blue-500 bg-blue-50"
                : "border-slate-100 bg-slate-50"
            }`}
          >
            <div>
              <p
                className={`font-bold text-sm ${
                  newSlot.isCovered ? "text-blue-700" : "text-slate-600"
                }`}
              >
                Covered / Sheltered
              </p>
              <p className="text-[10px] text-slate-400">
                Has roof or shade protection
              </p>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-all relative ${
                newSlot.isCovered ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  newSlot.isCovered ? "left-5" : "left-0.5"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              type="button"
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Add Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
