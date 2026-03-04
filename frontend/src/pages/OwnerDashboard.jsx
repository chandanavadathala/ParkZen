import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import AddSlotModal from "../components/AddSlotModal";
import BookingLogs from "../components/BookingLogs";
import RevenueManagement from "../components/RevenueManagement";

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
  MessageSquare, // <--- ADD THIS
  Star, // <--- ADD THIS
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
  // --- NEW SCANNER STATE ---
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [scannedBooking, setScannedBooking] = useState(null);
  const [scanError, setScanError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    // Only initialize scanner if the active tab is "scan"
    if (activeTab === "scan") {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          scanner.clear(); // Stop camera
          handleProcessQR(decodedText);
        },
        (err) => {
          /* ignore scan errors */
        },
      );

      return () => scanner.clear();
    }
  }, [activeTab]);

  const handleProcessQR = (idFromQR) => {
    // 1. Clean the scanned text (in case of spaces or hidden characters)
    const cleanId = idFromQR.trim();

    // 2. Find the user in your 'bookings' state
    const foundBooking = bookings.find((b) => b.id === cleanId);

    if (foundBooking) {
      // 3. Update Success state
      setScannedBooking(foundBooking);
      setScanError("");

      // 4. Add to 'activeSessions' (the table at the bottom of your screen)
      const newEntry = {
        ...foundBooking,
        entryTime: new Date().toLocaleTimeString(),
      };
      setActiveSessions((prev) => [...prev, newEntry]);

      // 5. Trigger the Gate UI
      setGateStatus("Open");

      // Auto-close gate after 4 seconds
      setTimeout(() => {
        setGateStatus("Closed");
        setScannedBooking(null); // Reset for next scan
      }, 4000);
    } else {
      // 6. Handle Error
      setScanError(`ID "${cleanId}" not found in current bookings.`);
      setScannedBooking(null);
    }
  };
  // --- ADD THIS RIGHT AFTER handleProcessQR ---
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = async () => {
    setIsScanning(true);
    // Ensure we are using the lower-level Html5Qrcode for better control
    const { Html5Qrcode } = await import("html5-qrcode");
    const html5QrCode = new Html5Qrcode("reader");

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessQR(decodedText);
          html5QrCode.stop();
          setIsScanning(false);
        },
      );
    } catch (err) {
      console.error("Camera start error:", err);
      setIsScanning(false);
      alert("Camera permission denied or not found.");
    }
  };
  const handleExit = (sessionId) => {
    const sessionToExit = activeSessions.find((s) => s.id === sessionId);

    if (sessionToExit) {
      const historyLog = {
        user: sessionToExit.user,
        // Your table uses log.entry, so we must save it as 'entry'
        entry: sessionToExit.entryTime || sessionToExit.entry || "N/A",
        // Your table uses log.exit, so we must save it as 'exit'
        exit: new Date().toLocaleTimeString(),
      };

      // 1. Update History
      setGateHistory((prev) => [historyLog, ...prev]);

      // 2. Clear from Active Sessions
      setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));

      // 3. Reset Slot Status
      setSlots((prev) =>
        prev.map((slot) =>
          slot.name === sessionToExit.slot
            ? { ...slot, status: "available" }
            : slot,
        ),
      );
    }
  };
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
  const handleAddNewSlot = (newSlotData) => {
    // This adds the new slot to your existing list
    setSlots([...slots, newSlotData]);
  };
  const handleMarkAsPaid = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, payment: "Paid" } : b)),
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white mb-8 px-2">
          <ShieldCheck className="text-blue-500" size={32} />
          <h1 className="text-xl font-bold tracking-tight">ParkZen Owner </h1>
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
        {/* FEATURE 4: ENTRY / EXIT (QR SCANNER) */}
        {activeTab === "gate" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Gate Terminal</h3>
                  <p className="text-sm text-gray-500">
                    Scan user QR code for entry validation
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${gateStatus === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  Gate: {gateStatus}
                </div>
              </div>

              <div className="p-8">
                {!scannedBooking && !scanError ? (
                  <div className="space-y-6">
                    {/* The Scanner Viewport */}
                    <div className="space-y-6">
                      {/* The Container */}
                      <div
                        id="reader"
                        className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-all ${
                          isScanning
                            ? "border-blue-500 bg-black min-h-[300px]"
                            : "border-gray-300 bg-gray-50 h-64"
                        } flex flex-col items-center justify-center`}
                      >
                        {!isScanning && (
                          <div className="text-center">
                            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                              <QrCode size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4 font-medium px-4">
                              Camera is ready
                            </p>
                            <button
                              onClick={startCamera}
                              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 mx-auto"
                            >
                              <Plus size={20} /> Start Scanning
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg text-blue-700">
                        <QrCode size={24} />
                        <p className="text-sm">
                          {isScanning
                            ? "Align the user's QR code within the frame."
                            : "Click 'Start Scanning' to verify a user's booking."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg text-blue-700">
                      <QrCode size={24} />
                      <p className="text-sm">
                        Position the user's QR code within the frame to
                        automatically detect booking details.
                      </p>
                    </div>
                  </div>
                ) : scannedBooking ? (
                  /* SUCCESS STATE */
                  <div className="text-center py-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Valid Booking
                    </h3>
                    <p className="text-gray-500 mb-6">
                      ID: {scannedBooking.id}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="text-xs text-gray-500 block">
                          User
                        </span>
                        <span className="font-bold">{scannedBooking.user}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="text-xs text-gray-500 block">
                          Slot
                        </span>
                        <span className="font-bold text-blue-600">
                          {scannedBooking.slot}
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                        <span className="text-xs text-gray-500 block">
                          Vehicle
                        </span>
                        <span className="font-bold">
                          {scannedBooking.vehicle}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setScannedBooking(null);
                          setGateStatus("Closed");
                        }}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => {
                          setGateStatus("Open");
                          // Optional: Automatically close gate after 5 seconds
                          setTimeout(() => setGateStatus("Closed"), 5000);
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 shadow-lg shadow-green-200"
                      >
                        Open Gate
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ERROR STATE */
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Invalid QR Code
                    </h3>
                    <p className="text-gray-500 mb-6">{scanError}</p>
                    <button
                      onClick={() => setScanError("")}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 5: REVENUE MANAGEMENT */}
        {activeTab === "revenue" && <RevenueManagement bookings={bookings} />}

        {/* FEATURE 6: UPGRADED ANALYTICS - INDIAN RUPEE */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Top Row: Quick Stats in ₹ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Revenue",
                  value: "₹42,500",
                  change: "+12%",
                  icon: CreditCard,
                  color: "text-emerald-600",
                },
                {
                  label: "Avg. Ticket",
                  value: "₹180",
                  change: "-5%",
                  icon: Clock,
                  color: "text-blue-600",
                },
                {
                  label: "Monthly Pass Users",
                  value: "45",
                  change: "+4",
                  icon: ShieldCheck,
                  color: "text-purple-600",
                },
                {
                  label: "Active Alerts",
                  value: "2",
                  change: "Stable",
                  icon: AlertTriangle,
                  color: "text-orange-600",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-2 rounded-lg ${stat.color.replace("text", "bg")}/10`}
                    >
                      <stat.icon className={`${stat.color}`} size={20} />
                    </div>
                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 1. Peak Utilization Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Occupancy Trends
                    </h3>
                    <p className="text-xs text-gray-400">
                      Hourly traffic for today
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>{" "}
                      Normal
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>{" "}
                      Peak
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-3 h-48 px-2">
                  {[15, 25, 40, 75, 95, 100, 90, 70, 50, 30, 20].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={`w-full rounded-t-sm transition-all relative ${h > 80 ? "bg-red-500" : "bg-blue-500 opacity-80 group-hover:opacity-100"}`}
                        style={{ height: `${h}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                          {h}% Full
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {i + 9} AM
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Revenue Breakdown by Vehicle Type */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold mb-6 text-slate-800">
                  Revenue Breakdown
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      type: "4-Wheelers",
                      amount: "₹28,400",
                      perc: 60,
                      color: "bg-blue-600",
                    },
                    {
                      type: "2-Wheelers",
                      amount: "₹9,200",
                      perc: 25,
                      color: "bg-indigo-400",
                    },
                    {
                      type: "EV Charging",
                      amount: "₹4,900",
                      perc: 15,
                      color: "bg-emerald-500",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">
                          {item.type}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.amount}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`${item.color} h-full transition-all duration-1000`}
                          style={{ width: `${item.perc}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                    Estimated Monthly Earnings
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-1">
                    ₹1,25,500
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: AI Insights in INR context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                      <TrendingUp size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Revenue Optimizer</h3>
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                        AI Suggestion
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Current occupancy for{" "}
                    <span className="text-white font-medium">4-Wheelers</span>{" "}
                    is peaking 2 hours earlier than usual. Apply a{" "}
                    <span className="text-emerald-400 font-bold">
                      ₹20 surcharge
                    </span>{" "}
                    for instant bookings to maximize evening revenue.
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20">
                      Apply ₹20 Hike
                    </button>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl text-xs font-bold transition-all">
                      Ignore
                    </button>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-lg">
                    <ShieldCheck size={22} className="text-emerald-500" />{" "}
                    Operational Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">
                        Entry Gate Sensors
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Online
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">
                        EV Charger Cluster
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3 text-emerald-600 font-bold text-xs bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  SYSTEMS FULLY OPERATIONAL
                </div>
              </div>
            </div>
          </div>
        )}
        {/* FEATURE 3: BOOKING MONITORING (Categorized) */}
        {activeTab === "bookings" && (
          <BookingLogs bookings={bookings} onMarkAsPaid={handleMarkAsPaid} />
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
          </div>
        )}
        {/* --- TAB 1: GATE/SCANNER TAB --- */}
        {activeTab === "gate" && (
          <div className="space-y-6">
            {/* Your Scanner UI and Currently in Lot Table go here */}
          </div>
        )}

        {/* FEATURE 7: UPGRADED NOTIFICATIONS & FEEDBACK */}
        {activeTab === "notifications" && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            {/* Section 1: Critical System Alerts */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" /> Operational Alerts
              </h3>
              <div className="grid gap-4">
                {/* Maintenance Alert */}
                <div className="flex items-start justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertTriangle className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 text-sm">
                        Hardware Fault: Slot B-201
                      </p>
                      <p className="text-amber-800 text-xs">
                        Sensor not responding since 10:45 AM. Technician
                        notified.
                      </p>
                      <span className="text-[10px] text-amber-600 font-bold mt-2 block uppercase tracking-wider">
                        High Priority
                      </span>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-amber-700 hover:underline">
                    Mark Resolved
                  </button>
                </div>

                {/* Payment Alert */}
                <div className="flex items-start justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CreditCard className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">
                        Payout Dispatched
                      </p>
                      <p className="text-emerald-800 text-xs">
                        ₹42,500.00 transferred to HDFC Bank ****9821.
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold mt-2 block uppercase tracking-wider">
                        Reference: #PZN-8821
                      </span>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-emerald-700 hover:underline">
                    View Receipt
                  </button>
                </div>

                {/* Overstay Alert */}
                <div className="flex items-start justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex gap-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Clock className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-red-900 text-sm">
                        Overstay Warning: MH-12-AB-1234
                      </p>
                      <p className="text-red-800 text-xs">
                        Vehicle in Slot A-12 has exceeded booking time by 45
                        mins.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                      Apply Fine
                    </button>
                    <button className="text-[10px] text-gray-400 font-bold">
                      Ignore
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: User Feedback Feed */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-purple-600" /> Recent
                User Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    user: "Rahul Sharma",
                    rating: 5,
                    comment:
                      "Best parking experience in Indiranagar. The EV charger was super fast!",
                    tag: "Compliment",
                    color: "purple",
                  },
                  {
                    user: "Ananya Iyer",
                    rating: 3,
                    comment:
                      "The entrance is a bit narrow for SUVs. Had some trouble navigating.",
                    tag: "Suggestion",
                    color: "blue",
                  },
                  {
                    user: "Vikram Singh",
                    rating: 2,
                    comment:
                      "The floor was a bit muddy near Slot C-5. Needs cleaning.",
                    tag: "Issue",
                    color: "amber",
                  },
                  {
                    user: "Priya K.",
                    rating: 5,
                    comment:
                      "Automated gate works like magic. Very secure feel.",
                    tag: "Compliment",
                    color: "purple",
                  },
                ].map((feedback, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {feedback.user}
                        </p>
                        <div className="flex gap-0.5 text-amber-400 mt-0.5">
                          {[...Array(5)].map((_, star) => (
                            <Star
                              key={star}
                              size={10}
                              fill={
                                star < feedback.rating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-1 rounded bg-${feedback.color}-50 text-${feedback.color}-600`}
                      >
                        {feedback.tag}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs italic leading-relaxed">
                      "{feedback.comment}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">
                        2 hours ago
                      </span>
                      <button className="text-xs font-bold text-purple-600 hover:text-purple-700">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
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
              <button
                onClick={() => setShowAddSlot(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
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
              {showAddSlot && (
                <AddSlotModal
                  onClose={() => setShowAddSlot(false)}
                  onAdd={(slot) => setSlots((prev) => [...prev, slot])}
                />
              )}
              <div className="grid grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 border rounded-xl shadow-sm"
                  >
                    <h4 className="font-bold">{slot.name}</h4>
                    <p className="text-sm text-slate-500">
                      {slot.size} - ₹{slot.rate}/hr
                    </p>
                  </div>
                ))}
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
