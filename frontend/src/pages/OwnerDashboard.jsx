import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  Calendar,
  QrCode,
  CreditCard,
  BarChart3,
  Bell,
  History,
  Plus,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [gateStatus, setGateStatus] = useState("Closed");
  // Tracks people currently inside the lot
  const [activeSessions, setActiveSessions] = useState([]);

  // Tracks everyone who has completed their visit
  const [gateHistory, setGateHistory] = useState([]);

  // --- MOCK DATA STATE ---
  const [slots, setSlots] = useState([
    {
      id: 1,
      name: "A-101",
      type: "EV",
      status: "occupied",
      rate: 15,
      isCovered: true,
    },
    {
      id: 2,
      name: "A-102",
      type: "Open",
      status: "available",
      rate: 10,
      isCovered: false,
    },
    {
      id: 3,
      name: "B-201",
      type: "Covered",
      status: "maintenance",
      rate: 12,
      isCovered: true,
    },
    {
      id: 4,
      name: "VIP-1",
      type: "Covered",
      status: "booked",
      rate: 25,
      isCovered: true,
    },
  ]);

  const [bookings, setBookings] = useState([
    {
      id: "BK-7721",
      user: "John Doe",
      vehicle: "TS-09-EA-1234",
      slot: "A-101",
      status: "Confirmed",
      payment: "Paid",
    },
    {
      id: "BK-7722",
      user: "Jane Smith",
      vehicle: "KA-01-MJ-5566",
      slot: "VIP-1",
      status: "Pending",
      payment: "Pending",
    },
  ]);

  // --- FEATURE 2 & 4: SLOT & GATE LOGIC ---
  const toggleGate = (slotId) => {
    setSlots(
      slots.map((s) =>
        s.id === slotId
          ? {
              ...s,
              status: s.status === "available" ? "occupied" : "available",
            }
          : s,
      ),
    );
    alert("Gate Signal Sent: Action Logged");
  };

  // --- UI COMPONENTS ---

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white mb-8 px-2">
          <ShieldCheck className="text-blue-500" size={32} />
          <h1 className="text-xl font-bold tracking-tight">ParkAdmin Pro</h1>
        </div>

        <SidebarItem
          id="dashboard"
          icon={LayoutDashboard}
          label="Live Monitor"
        />
        <SidebarItem id="lots" icon={Car} label="Lot Management" />
        <SidebarItem id="bookings" icon={Calendar} label="Bookings" />
        <SidebarItem id="gate" icon={QrCode} label="Entry / Exit" />
        <SidebarItem id="revenue" icon={CreditCard} label="Payments" />
        <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
        <SidebarItem id="history" icon={History} label="History" />
        <SidebarItem id="notifications" icon={Bell} label="Alerts" />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold capitalize">
              {activeTab.replace("-", " ")}
            </h2>
            <p className="text-gray-500">Real-time control center</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-2 px-4 rounded-lg shadow-sm border border-gray-200">
              <span className="text-xs text-gray-500 block">Occupancy</span>
              <span className="font-bold text-blue-600">72%</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus size={18} /> New Booking
            </button>
          </div>
        </header>

        {/* FEATURE 2 & 3: LIVE MONITORING & SLOTS */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    slot.status === "available"
                      ? "bg-green-500"
                      : slot.status === "occupied"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                />
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">{slot.name}</h4>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                      slot.status === "available"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Type: {slot.type}</p>
                  <p>Rate: ${slot.rate}/hr</p>
                </div>
                <button
                  onClick={() => toggleGate(slot.id)}
                  className="mt-4 w-full py-2 bg-gray-50 text-gray-700 text-sm rounded border hover:bg-gray-100 font-medium"
                >
                  {slot.status === "available"
                    ? "Manually Occupy"
                    : "Release Slot"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FEATURE 5: REVENUE MANAGEMENT */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-gray-500 text-sm mb-1">
                  Total Revenue (Monthly)
                </h3>
                <p className="text-3xl font-bold text-slate-900">$12,450.00</p>
                <span className="text-green-500 text-xs flex items-center gap-1 mt-2">
                  <TrendingUp size={12} /> +12% from last month
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col justify-center">
                <button className="bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800">
                  Request Payout
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Available: $3,210.00
                </p>
              </div>
            </div>
            <table className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">User</th>
                  <th className="text-left p-4 text-sm font-semibold">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-semibold">
                    Method
                  </th>
                  <th className="text-left p-4 text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td className="p-4 text-sm">{b.user}</td>
                    <td className="p-4 text-sm font-bold">$25.00</td>
                    <td className="p-4 text-sm">Credit Card</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FEATURE 6: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-6">Peak Hour Utilization</h3>
              <div className="flex items-end gap-2 h-40">
                {[20, 35, 50, 90, 100, 80, 40].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>8AM</span>
                <span>12PM</span>
                <span>4PM</span>
                <span>8PM</span>
              </div>
            </div>
            <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Dynamic Suggestion
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Occupancy has been consistently above 90% between 2:00 PM and
                5:00 PM.
              </p>
              <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
                Increase Rates by 15%
              </button>
            </div>
          </div>
        )}
        {/* FEATURE 3: BOOKING MONITORING (Categorized) */}
        {activeTab === "bookings" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER & SEARCH */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">Booking Logs</h3>
                <p className="text-sm text-gray-500 font-medium">
                  Monitoring {bookings.length} active sessions
                </p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                  Unpaid:{" "}
                  {bookings.filter((b) => b.payment === "Pending").length}
                </div>
                <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100">
                  Paid: {bookings.filter((b) => b.payment === "Paid").length}
                </div>
              </div>
            </div>

            {/* SECTION 1: UNPAID BOOKINGS (Immediate Action Required) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter">
                  Payment Pending / Post-Paid
                </h4>
              </div>

              <div className="bg-white rounded-3xl border-2 border-amber-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-amber-50/50 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Slot</th>
                      <th className="p-4">Vehicle No.</th>
                      <th className="p-4">Time Window</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings
                      .filter((b) => b.payment === "Pending")
                      .map((booking, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-amber-50/30 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-slate-900">
                              {booking.user}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              ID: {booking.id}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold text-xs">
                              {booking.slot}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs font-bold text-slate-600">
                            {booking.vehicle}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {booking.time}
                          </td>
                          <td className="p-4 font-black text-red-600">
                            $25.00
                          </td>
                          <td className="p-4 text-right">
                            <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800">
                              Mark as Paid
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {bookings.filter((b) => b.payment === "Pending").length ===
                  0 && (
                  <p className="p-8 text-center text-sm text-gray-400 italic">
                    No pending payments found.
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 2: PAID BOOKINGS (Confirmed Access) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 px-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter">
                  Verified & Paid Bookings
                </h4>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden opacity-90">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Slot</th>
                      <th className="p-4">Vehicle No.</th>
                      <th className="p-4">Time Window</th>
                      <th className="p-4">Reference</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings
                      .filter((b) => b.payment === "Paid")
                      .map((booking, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-700">
                              {booking.user}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold text-xs">
                              {booking.slot}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-500">
                            {booking.vehicle}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {booking.time}
                          </td>
                          <td className="p-4 text-[10px] font-mono text-slate-400">
                            {booking.id}
                          </td>
                          <td className="p-4 text-right">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                              Paid & Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* FEATURE 4: ENTRY & EXIT CONTROL */}
        {activeTab === "gate" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* SCANNER SIMULATOR */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <QrCode size={60} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-800">
                  QR Access Control
                </h3>
                <p className="text-slate-500 mb-4">
                  Scan user's digital pass to log entry/exit times
                  automatically.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const entryTime = new Date().toLocaleTimeString();
                      const newSession = {
                        id: "BK-" + Math.floor(1000 + Math.random() * 9000),
                        user: "Incoming User",
                        plate: "ABC-1234",
                        entry: entryTime,
                      };
                      setActiveSessions([newSession, ...activeSessions]);
                      setGateStatus("Entry Approved");
                      setTimeout(() => setGateStatus("Closed"), 2000);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700"
                  >
                    Simulate QR Entry
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Gate Status
                </p>
                <p
                  className={`text-2xl font-black ${gateStatus === "Closed" ? "text-slate-400" : "text-green-500"}`}
                >
                  {gateStatus}
                </p>
              </div>
            </div>

            {/* LIVE LOG TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" /> Currently In Lot
                </h4>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">User / Booking ID</th>
                    <th className="p-4">Vehicle Plate</th>
                    <th className="p-4">Entry Time</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeSessions.length > 0 ? (
                    activeSessions.map((session, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">
                            {session.user}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {session.id}
                          </p>
                        </td>
                        <td className="p-4 font-mono text-sm">
                          {session.plate}
                        </td>
                        <td className="p-4 text-sm text-blue-600 font-bold">
                          {session.entry}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              const exitTime = new Date().toLocaleTimeString();
                              setGateHistory([
                                { ...session, exit: exitTime },
                                ...gateHistory,
                              ]);
                              setActiveSessions(
                                activeSessions.filter(
                                  (_, index) => index !== i,
                                ),
                              );
                              setGateStatus("Exit Approved");
                              setTimeout(() => setGateStatus("Closed"), 2000);
                            }}
                            className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100"
                          >
                            Confirm Exit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-10 text-center text-slate-400 italic"
                      >
                        No vehicles currently inside.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* HISTORY TABLE (EXIT LOGS) */}
            {gateHistory.length > 0 && (
              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <History size={18} className="text-blue-400" /> Recent
                    Activity History
                  </h4>
                </div>
                <table className="w-full text-left text-slate-300 text-sm">
                  <thead className="bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Entry Time</th>
                      <th className="p-4">Exit Time</th>
                      <th className="p-4 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {gateHistory.map((log, i) => (
                      <tr key={i}>
                        <td className="p-4 text-white font-medium">
                          {log.user}
                        </td>
                        <td className="p-4">{log.entry}</td>
                        <td className="p-4 text-green-400">{log.exit}</td>
                        <td className="p-4 text-right text-slate-500 italic">
                          Completed
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* FEATURE 7: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="text-amber-600" />
              <div>
                <p className="font-bold text-amber-900 text-sm">
                  Slot Maintenance Required
                </p>
                <p className="text-amber-800 text-sm">
                  Slot B-201 sensor is not responding.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CreditCard className="text-blue-600" />
              <div>
                <p className="font-bold text-blue-900 text-sm">
                  Payout Successful
                </p>
                <p className="text-blue-800 text-sm">
                  $1,200.00 transferred to Bank Account ****1234.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 2: LOT MANAGEMENT (Add/Edit Slots) */}
        {activeTab === "lots" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Slot Configuration</h3>
                <p className="text-sm text-gray-500">
                  Manage total capacity and slot properties
                </p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                <Plus size={20} /> Add New Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dynamic Pricing Controller */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl lg:col-span-1">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
                  <TrendingUp size={18} /> Dynamic Pricing
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      Base Rate (per hour)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full bg-slate-800 border-none rounded-xl mt-1 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      Peak Hour Multiplier
                    </label>
                    <select className="w-full bg-slate-800 border-none rounded-xl mt-1 text-white focus:ring-2 focus:ring-blue-500">
                      <option>1.5x (Busy)</option>
                      <option>2.0x (Event)</option>
                      <option>1.0x (Normal)</option>
                    </select>
                  </div>
                  <button className="w-full bg-blue-600 py-3 rounded-xl font-bold mt-2 hover:bg-blue-500 transition">
                    Update Global Rates
                  </button>
                </div>
              </div>

              {/* Slot Type Summary */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-bold text-slate-400">
                    EV Charging Slots
                  </p>
                  <p className="text-3xl font-black mt-2">12</p>
                  <button className="text-blue-600 text-xs font-bold mt-4 hover:underline">
                    Manage EV Rate →
                  </button>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-bold text-slate-400">
                    Covered Parking
                  </p>
                  <p className="text-3xl font-black mt-2">45</p>
                  <button className="text-blue-600 text-xs font-bold mt-4 hover:underline">
                    Manage Layout →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
