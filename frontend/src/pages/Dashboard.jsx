import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR code library
import {
  // Navigation & Core
  LayoutDashboard,
  User,
  LogOut,
  ChevronRight,
  Navigation,

  // Search & Filters
  Search,
  MapPin,
  Clock,

  // Booking & Selection
  Car,
  CheckCircle2,
  ShieldCheck,

  // Ticket & Entry
  Ticket,
  Calendar,
  CreditCard,
  Download,
  Scan,
  LogIn,
  QrCode,
} from "lucide-react";

export default function UserDashboard() {
  const TOTAL_SLOTS = 50;
  const [availableSlots, setAvailableSlots] = useState(32);

  // ===== PLACE SEARCH =====
  const places = {
    "City Mall": {
      slots: 20,
      type: "Covered",
      rate: 50,
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    Airport: {
      slots: 30,
      type: "Open",
      rate: 40,
      coords: { lat: 12.9985, lng: 77.567 },
    },
    "Tech Park": {
      slots: 15,
      type: "EV Charging",
      rate: 60,
      coords: { lat: 12.9352, lng: 77.6245 },
    },
  };

  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [placeSlots, setPlaceSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentStep, setPaymentStep] = useState("selection"); // 'selection', 'gateway', 'processing'
  const [upiId, setUpiId] = useState("");
  // Add this inside UserDashboard, with other useState hooks
  const [imageModal, setImageModal] = useState({
    open: false,
    src: "",
    title: "",
  });
  // Inside UserDashboard component
  const [entryLogged, setEntryLogged] = useState(false);
  const [entryTime, setEntryTime] = useState(null);
  // Tracks if user is currently parked
  const [parkingActive, setParkingActive] = useState(false);

  // Tracks start time for parking duration
  const [parkingStartTime, setParkingStartTime] = useState(null);

  // Tracks parking duration (updates every second)
  const [parkingDuration, setParkingDuration] = useState("0:00");

  // Track payment status for current parking
  const [parkingPaymentStatus, setParkingPaymentStatus] = useState("Pending");

  // ===== NEW STATES FOR BOOKING MODAL =====
  const [selectedSlotType, setSelectedSlotType] = useState("Regular");
  const [selectedPayment, setSelectedPayment] = useState("Wallet");
  const [extendedMinutes, setExtendedMinutes] = useState(0);

  // ===== DIGITAL TICKET =====
  const [ticket, setTicket] = useState(null);

  // ===== BOOKINGS =====
  const [bookings, setBookings] = useState([
    {
      id: "BK101",
      slot: "A12",
      start: "10:00 AM",
      end: "12:00 PM",
      status: "Active",
      amount: 200,
    },
  ]);

  // ===== REAL TIME SLOTS =====
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAvailable = Math.floor(Math.random() * TOTAL_SLOTS);
      setAvailableSlots(randomAvailable);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const occupiedSlots = TOTAL_SLOTS - availableSlots;
  // ===== CANCEL BOOKING FUNCTION =====
  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    );
  };

  // ===== STATISTICS CALCULATION =====
  const totalBookings = bookings.length;
  const activeParking = bookings.filter((b) => b.status === "Active").length;
  const amountSpent = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // ===== PLACE SELECT =====
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    const total = places[place].slots;

    const generatedSlots = Array.from({ length: total }, (_, i) => ({
      number: i + 1,
      occupied: Math.random() < 0.4,
    }));

    setPlaceSlots(generatedSlots);
    setSelectedSlot(null);
    setTicket(null);
    setSelectedSlotType("Regular");
    setSelectedPayment("Wallet");
  };

  // ===== GPS LOCATION =====
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // ===== CALCULATE DISTANCE =====
  const getDistance = (placeCoords) => {
    if (!userCoords) return "-";
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(placeCoords.lat - userCoords.lat);
    const dLon = toRad(placeCoords.lng - userCoords.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userCoords.lat)) *
        Math.cos(toRad(placeCoords.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1); // return km as number for calculations
  };

  // ===== ESTIMATED ARRIVAL =====
  const getEstimatedArrival = (placeCoords) => {
    if (!userCoords) return "-";
    const distanceKm = parseFloat(getDistance(placeCoords));
    const etaMinutes = Math.ceil((distanceKm / 40) * 60); // assuming avg 40 km/h
    return etaMinutes + " min";
  };

  // ===== NAVIGATION =====
  const handleNavigateToPlace = (place) => {
    const coords = places[place].coords;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(mapsUrl, "_blank");
  };

  // ===== CONFIRM BOOKING WITH PAYMENT =====
  const handleConfirmBookingWithPayment = () => {
    // Start the loading state
    setIsProcessing(true);

    // Simulate a network delay (like a real payment gateway)
    setTimeout(() => {
      const rate = Math.round(
        places[selectedPlace].rate * (selectedSlotType === "Premium" ? 1.2 : 1),
      );
      const entryTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newTicket = {
        bookingId: "PZ" + Math.floor(1000 + Math.random() * 9000),
        place: selectedPlace,
        slot: selectedSlot,
        slotType: selectedSlotType,
        entryTime,
        payment: selectedPayment, // This will show 'UPI', 'Card', etc.
        amount: rate,
      };

      // Update states
      setTicket(newTicket);
      setTotalBookings((prev) => prev + 1);
      setAmountSpent((prev) => prev + rate);

      // Stop loading
      setIsProcessing(false);

      // Clear selection so the summary modal disappears
      setSelectedSlot(null);
    }, 2000); // 2-second delay
  };

  // ===== STATUS COLORS =====
  const getStatusColor = () => {
    if (availableSlots === 0) return "bg-red-100 text-red-700";
    if (availableSlots <= 10) return "bg-yellow-100 text-yellow-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const getBookingStatusColor = (status) => {
    if (status === "Active") return "bg-emerald-100 text-emerald-700";
    if (status === "Completed") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };
  const handlePaymentWorkflow = () => {
    // 1. Move to Processing Screen
    setPaymentStep("processing");

    // 2. Simulate the bank/UPI "Handshake" (3 seconds)
    setTimeout(() => {
      const rate = Math.round(
        places[selectedPlace].rate * (selectedSlotType === "Premium" ? 1.2 : 1),
      );
      const entryTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newTicket = {
        bookingId: "PZ" + Math.floor(1000 + Math.random() * 9000),
        place: selectedPlace,
        slot: selectedSlot,
        slotType: selectedSlotType,
        entryTime,
        payment: selectedPayment,
        amount: rate,
      };

      // 3. Finalize everything
      setTicket(newTicket);
      setTotalBookings((prev) => prev + 1);
      setAmountSpent((prev) => prev + rate);

      // Reset states so UI shows the Ticket
      setPaymentStep("selection");
      setIsConfirming(false);
    }, 3000);
  };

  return (
    <div
      className="bg-white/70 backdrop-blur-md border border-emerald-100/50 
             rounded-[2.5rem] p-8 shadow-xl shadow-emerald-900/5 
             transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/50
             relative overflow-hidden group"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl group-hover:bg-emerald-200/60 transition-colors duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl opacity-60" />
      <div className="relative z-10">
        {/* ===== PARKZEN USER HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Account Overview
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Welcome, <span className="text-emerald-600">User</span>
              <motion.span
                animate={{ rotate: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
              >
                👋
              </motion.span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              You have{" "}
              <span className="text-slate-900 font-bold">
                {availableSlots} spots
              </span>{" "}
              available nearby.
            </p>
          </motion.div>

          {/* Quick Actions / Date Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm font-bold text-slate-700">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
          </motion.div>
        </div>
        {/* 🔥 USER STATISTICS */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            /* UX: Slate-to-Emerald wash. Stable, grounded, yet successful. */
            bgColor="bg-gradient-to-br from-[#F8FAFC] to-[#ECFDF5] border border-[#E2E8F0]"
            shadowColor="shadow-sm border-b-4 border-b-[#10B981]"
            valueColor="text-[#065F46]" // Deep Emerald
            labelColor="text-[#64748B]" // Soft Slate
          />
          <StatCard
            title="Active Parking"
            value={activeParking}
            /* UX: Emerald core with a Slate border. Focuses on the "Live" data. */
            bgColor="bg-gradient-to-br from-[#F1F5F9] to-[#F0FDF4] border border-[#E2E8F0]"
            shadowColor="shadow-sm border-b-4 border-b-[#22C55E]"
            valueColor="text-[#15803D]" // Mid Emerald
            labelColor="text-[#64748B]" // Soft Slate
          />
          <StatCard
            title="Amount Spent"
            value={`₹${amountSpent}`}
            /* UX: Premium Slate-Teal. Feels like a modern banking interface. */
            bgColor="bg-gradient-to-br from-[#F8FAFC] to-[#F0FDFA] border border-[#E2E8F0]"
            shadowColor="shadow-sm border-b-4 border-b-[#0D9488]"
            valueColor="text-[#0F766E]" // Deep Teal/Emerald
            labelColor="text-[#64748B]" // Soft Slate
          />
        </div>
        {/* SEARCH / PLACES - PARKZEN THEMED */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 mb-8 overflow-hidden relative"
        >
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

          <div className="relative flex items-center gap-4 mb-8">
            <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
              <Search size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Search Parking Location
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Find your zen spot
              </p>
            </div>
          </div>

          {/* SEARCH + LOCATION BOX */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Where are you heading?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                   text-slate-700 font-medium transition-all duration-300 shadow-inner"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUseCurrentLocation}
              className="bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl shadow-lg 
                 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
            >
              <MapPin size={18} className="text-emerald-400" />
              Use My Location
            </motion.button>
          </div>

          {/* PLACE CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(places)
              .filter((p) => p.toLowerCase().includes(search.toLowerCase()))
              .map((place, i) => {
                const images = {
                  "City Mall":
                    "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=400&q=80",
                  Airport:
                    "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=400&q=80",
                  "Tech Park":
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
                };

                return (
                  <motion.div
                    key={place}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => handlePlaceSelect(place)}
                    className="group bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Image Preview Container */}
                    <div className="h-32 w-full overflow-hidden relative">
                      <img
                        src={images[place]}
                        alt={place}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700">
                        ₹{places[place].rate}/hr
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-black text-slate-800 text-lg mb-1">
                        {place}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mb-3 uppercase tracking-wider font-bold">
                        <Car size={12} className="text-emerald-500" />
                        {places[place].type} • {places[place].slots} Slots Left
                      </div>

                      <div className="space-y-1.5 mb-5">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} /> Distance
                          </span>
                          <span className="font-bold text-slate-900">
                            {getDistance(places[place].coords)} km
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} /> Arrival
                          </span>
                          <span className="font-bold text-slate-900">
                            {getEstimatedArrival(places[place].coords)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToPlace(place);
                          }}
                          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
                        >
                          Navigate
                        </motion.button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageModal({
                              open: true,
                              src: images[place],
                              title: place,
                            });
                          }}
                          className="px-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 transition"
                        >
                          <Search size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
        {/* PLACE IMAGE MODAL */}
        {imageModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setImageModal({ open: false, src: "", title: "" })}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageModal.src}
                alt={imageModal.title}
                className="w-full object-cover"
              />
              <div className="p-4 text-center">
                <p className="font-bold text-lg text-slate-800">
                  {imageModal.title}
                </p>
                <button
                  onClick={() =>
                    setImageModal({ open: false, src: "", title: "" })
                  }
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* SLOTS */}
        {selectedPlace && (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Select Your Spot
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                  {selectedPlace} •{" "}
                  {placeSlots.filter((s) => !s.occupied).length} Available
                </p>
              </div>

              {/* Visual Legend */}
              <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Open
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Taken
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {placeSlots.map((slot) => {
                const isOccupied = slot.occupied;
                const isSelected = selectedSlot === slot.number;

                return (
                  <motion.div
                    key={slot.number}
                    whileHover={!isOccupied ? { y: -4, scale: 1.02 } : {}}
                    whileTap={!isOccupied ? { scale: 0.98 } : {}}
                    onClick={() => !isOccupied && setSelectedSlot(slot.number)}
                    className={`
              relative p-6 rounded-2xl text-center transition-all duration-300 border-2 cursor-pointer
              ${
                isOccupied
                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                  : isSelected
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white border-emerald-50 text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/30"
              }
            `}
                  >
                    {/* Slot Number Icon View */}
                    <div className="flex flex-col items-center gap-1">
                      <Car
                        size={16}
                        className={
                          isOccupied
                            ? "opacity-20"
                            : isSelected
                              ? "text-white"
                              : "text-emerald-500"
                        }
                      />
                      <span
                        className={`text-sm font-black ${isSelected ? "text-white" : "text-slate-700"}`}
                      >
                        {slot.number}
                      </span>
                    </div>

                    {/* Selection Checkmark */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full p-1 shadow-md border border-emerald-100">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Change your logic to only show if a slot is picked AND we aren't already confirming or finished */}
            {selectedSlot && !isConfirming && !ticket && (
              <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between animate-in zoom-in-95">
                <p className="text-emerald-800 text-sm font-medium">
                  Ready to park in{" "}
                  <span className="font-black">Slot {selectedSlot}</span>?
                </p>
                <button
                  onClick={() => setIsConfirming(true)} // This "unlocks" the summary
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Confirm Spot
                </button>
              </div>
            )}
          </div>
        )}
        {/* ===== PARKZEN BOOKING MODAL ===== */}
        {isConfirming && !ticket && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 mb-8 max-w-md mx-auto relative overflow-hidden"
          >
            {/* Background Design Accents for Depth */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-60" />

            <div className="relative">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 shadow-inner">
                  <Calendar size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Booking Summary
                </h2>
                <button
                  onClick={() => setIsConfirming(false)}
                  className="text-slate-400"
                >
                  ✕
                </button>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                    {selectedPlace}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                    Slot {selectedSlot}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Slot Category Selection */}
                <div className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-200">
                  <label className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Spot Category
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-transparent outline-none font-bold text-slate-800 appearance-none cursor-pointer relative z-10"
                      value={selectedSlotType}
                      onChange={(e) => setSelectedSlotType(e.target.value)}
                    >
                      <option value="Regular">Regular Spot</option>
                      <option value="Premium">Premium Spot (+20%)</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight
                        size={16}
                        className="rotate-90 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 ...">
                  <label className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <CreditCard size={14} className="text-emerald-500" />
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-transparent outline-none font-bold text-slate-800 appearance-none cursor-pointer relative z-10"
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    >
                      <option value="Wallet">ParkZen Wallet (Bal: ₹450)</option>
                      <option value="UPI">UPI (Google Pay/PhonePe)</option>
                      <option value="Card">Credit / Debit Card</option>
                    </select>
                    {/* ... Chevron icon ... */}
                  </div>
                </div>

                {/* The Action Button */}
                <motion.button
                  onClick={handleConfirmBookingWithPayment}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                    isProcessing
                      ? "bg-slate-400 cursor-wait"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-xl"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing {selectedPayment}...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="text-emerald-400" />
                      Pay via {selectedPayment}
                    </>
                  )}
                </motion.button>

                {/* Pricing Summary Visualization */}
                <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-200 mt-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                          Total Rate
                        </p>
                        <h3 className="text-3xl font-black">
                          ₹
                          {(
                            places[selectedPlace].rate *
                            (selectedSlotType === "Premium" ? 1.2 : 1)
                          ).toFixed(0)}
                          <span className="text-sm font-medium opacity-80 ml-1">
                            /hr
                          </span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                          ETA
                        </p>
                        <p className="font-bold text-sm">
                          {getEstimatedArrival(places[selectedPlace].coords)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <motion.button
                  onClick={handleConfirmBookingWithPayment}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all text-lg"
                >
                  <CreditCard size={20} className="text-emerald-400" />
                  Pay & Confirm
                </motion.button>

                <button
                  onClick={() => setSelectedSlot(null)}
                  className="w-full py-2 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Cancel Selection
                </button>
              </div>

              <p className="text-center text-[9px] text-slate-400 mt-4 px-6 leading-tight font-medium">
                Secure encrypted payment via ParkZen Gateway. By confirming, you
                agree to our Terms of Service.
              </p>
            </div>
          </motion.div>
        )}
        {/* ===== PARKZEN DIGITAL TICKET ===== */}
        {ticket && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl mx-auto mb-12 relative"
          >
            {/* Success Badge */}
            <div className="flex justify-center -mb-6 relative z-10">
              <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-200 border-4 border-white">
                <CheckCircle2 size={32} />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row overflow-hidden">
              {/* LEFT SIDE: TICKET INFO */}
              <div className="flex-1 p-8 pt-10 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-slate-100 relative">
                {/* Aesthetic Ticket "Cuts" */}
                <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-slate-50 rounded-full" />
                <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 bg-slate-50 rounded-full" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-900 text-white p-2 rounded-xl">
                    <Ticket size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Digital Ticket
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Booking ID
                    </p>
                    <p className="font-bold text-slate-700">
                      {ticket.bookingId.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Location
                    </p>
                    <p className="font-bold text-slate-700">{ticket.place}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Slot / Type
                    </p>
                    <p className="font-bold text-slate-700">
                      {ticket.slot}{" "}
                      <span className="text-emerald-500 text-xs">
                        ({ticket.slotType})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Entry Time
                    </p>
                    <p className="font-bold text-slate-700">
                      {ticket.entryTime}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Amount Paid
                    </p>
                    <p className="text-2xl font-black text-emerald-600">
                      ₹{ticket.amount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </p>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: QR CODE */}
              <div className="bg-slate-50 p-10 flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200 border border-white">
                  <QRCodeCanvas
                    value={JSON.stringify(ticket)}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#1e293b" // slate-800
                    level="H"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                  Scan at entry point <br /> to open gate
                </p>

                <div className="flex flex-col w-full gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Floating Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ y: -4 }}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2"
              >
                <Navigation size={18} className="text-emerald-400" />
                Navigate to Slot
              </motion.button>
            </div>
          </motion.div>
        )}
        ;{/* ===== ENTRY AT PARKING ===== */}
        {/* ===== PARKZEN ENTRY GATE SCANNER ===== */}
        {ticket && !entryLogged && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-[2.5rem] border-2 border-dashed border-emerald-100 shadow-2xl shadow-emerald-100/50 p-8 mb-8 max-w-3xl mx-auto relative overflow-hidden"
          >
            {/* Animated Scanner Beam Effect */}
            <motion.div
              animate={{ translateY: [0, 200, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent z-0"
            />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 relative">
                  <Scan size={48} strokeWidth={1.5} className="animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" />
                </div>
              </div>

              {/* Text Section */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 text-center md:text-left"
              >
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  Gate Arrival
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                  You are at{" "}
                  <span className="text-slate-800 font-bold">
                    {ticket.place}
                  </span>
                  . Scan your digital ticket at the sensor to lift the barrier
                  and start your session.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    setEntryTime(timeString);
                    setEntryLogged(true);

                    setBookings((prev) =>
                      prev.map((b) =>
                        b.id === ticket.bookingId
                          ? { ...b, start: timeString }
                          : b,
                      ),
                    );

                    setParkingActive(true);
                    setParkingStartTime(now);
                  }}
                  className="w-full md:w-auto bg-slate-900 text-white py-4 px-8 rounded-2xl font-black shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all duration-300 group"
                >
                  <LogIn
                    size={20}
                    className="text-emerald-400 group-hover:text-white"
                  />
                  Confirm Entry & Open Gate
                </motion.button>
              </motion.div>

              {/* Status Badge */}
              <div className="hidden lg:block">
                <div className="rotate-12 border-4 border-slate-100 rounded-2xl p-4 text-slate-100 font-black text-xl uppercase tracking-widest select-none">
                  Ready to <br /> Park
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* ===== PARKZEN ACTIVE SESSION ===== */}
        {parkingActive && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 mb-8 max-w-3xl mx-auto relative overflow-hidden text-white"
          >
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              {/* Visual Timer Section */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-3xl font-black text-emerald-400 leading-none">
                      {parkingDuration}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60">
                      Mins
                    </span>
                  </div>
                </div>
                {/* Pulsing indicator */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
                <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Live Session
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-1 tracking-tight">
                  Parking in Progress
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-6">
                  Location:{" "}
                  <span className="text-white">
                    {ticket?.place || "Premium Spot"}
                  </span>{" "}
                  • Joined at {entryTime}
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert("Extend Parking Feature Coming Soon!")}
                    className="flex-1 min-w-[140px] bg-slate-800 border border-slate-700 text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                  >
                    <Clock size={18} className="text-emerald-400" />
                    Extend
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setParkingActive(false);
                      alert("Parking Ended!");
                    }}
                    className="flex-1 min-w-[140px] bg-red-500/10 border border-red-500/20 text-red-400 py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <LogOut size={18} />
                    End Session
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* ===== REAL-TIME SLOT STATS ===== */}
        {/* ===== PARKZEN STATS OVERVIEW ===== */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 mb-10">
          <StatCard
            title="Total Capacity"
            value={TOTAL_SLOTS}
            icon={<LayoutDashboard size={18} />}
            bgColor="bg-white"
            valueColor="text-slate-800"
            borderColor="border-slate-100"
          />
          <StatCard
            title="Available Now"
            value={availableSlots}
            icon={<CheckCircle2 size={18} />}
            bgColor="bg-white"
            valueColor="text-emerald-600"
            borderColor="border-emerald-50"
          />
          <StatCard
            title="Currently In Use"
            value={occupiedSlots}
            icon={<Car size={18} />}
            bgColor="bg-white"
            valueColor="text-slate-400"
            borderColor="border-slate-100"
          />

          {/* Dynamic Status Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Subtle Background Glow based on status */}
            <div
              className={`absolute -inset-1 opacity-20 blur-2xl transition-all duration-500 ${
                availableSlots > 5
                  ? "bg-emerald-400"
                  : availableSlots > 0
                    ? "bg-amber-400"
                    : "bg-red-400"
              }`}
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    availableSlots > 5
                      ? "bg-emerald-500"
                      : availableSlots > 0
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  System
                </span>
              </div>

              <p
                className={`text-sm font-black uppercase tracking-tighter transition-colors ${
                  availableSlots > 5
                    ? "text-emerald-600"
                    : availableSlots > 0
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {availableSlots > 5
                  ? "All Systems Go"
                  : availableSlots > 0
                    ? "Limited Space"
                    : "Parking Full"}
              </p>
            </div>
          </div>
        </div>
        {/* MY BOOKINGS */}
        {/* ===== PARKZEN BOOKINGS LIST ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2 rounded-xl">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Recent Activity
              </h2>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full">
              {bookings.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <Car size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">
                  No active history found.
                </p>
                <p className="text-slate-300 text-xs">
                  Your future bookings will appear here.
                </p>
              </div>
            )}

            {bookings.map((b, i) => (
              <motion.div
                key={b.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5 }}
                className="group relative bg-white border border-slate-100 rounded-[1.5rem] p-5 transition-all hover:border-emerald-100 hover:shadow-xl hover:shadow-slate-200/40"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Booking Main Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        b.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : b.status === "Completed"
                            ? "bg-slate-50 text-slate-400"
                            : "bg-red-50 text-red-500"
                      }`}
                    >
                      {b.status === "Active" ? (
                        <Navigation size={20} />
                      ) : (
                        <CheckCircle2 size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        ID: {b.id.substring(0, 8)}...
                      </p>
                      <h4 className="font-bold text-slate-800 tracking-tight leading-none">
                        {b.place || "Standard Slot"} • {b.slot}
                      </h4>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Amount
                      </p>
                      <p className="font-black text-slate-800 tracking-tighter">
                        ₹{b.amount}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          b.status === "Active"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                            : b.status === "Completed"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {b.status}
                      </span>

                      {b.status === "Active" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          title="Cancel Booking"
                        >
                          <LogOut size={18} className="rotate-180" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Metadata Footer */}
                <div className="mt-4 flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-300" />
                    Started: {b.start}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    Verified Session
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon, // New prop for Lucide icons
  bgColor = "bg-white",
  valueColor = "text-slate-800",
  borderColor = "border-slate-100", // New prop for subtle borders
}) {
  // Extract number for CountUp: remove non-digits but keep the first decimal if present
  const numericValue =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;

  const isCurrency = typeof value === "string" && value.includes("₹");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`${bgColor} ${borderColor} border-2 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center transition-all`}
    >
      {/* Icon Wrapper */}
      {icon && (
        <div className="text-slate-300 mb-3 group-hover:text-emerald-500 transition-colors">
          {icon}
        </div>
      )}

      {/* Title with Zen Typography */}
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
        {title}
      </p>

      {/* Value with CountUp Animation */}
      <h3
        className={`text-3xl font-black ${valueColor} tracking-tighter flex items-center gap-1`}
      >
        {isCurrency && (
          <span className="text-xl opacity-50 font-medium">₹</span>
        )}
        <CountUp end={numericValue} duration={2} separator="," />
      </h3>
    </motion.div>
  );
}
