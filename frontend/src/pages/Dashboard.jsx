import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR code library

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
    const rate =
      places[selectedPlace].rate * (selectedSlotType === "Premium" ? 1.2 : 1);
    const entryTime = new Date().toLocaleTimeString();

    const newTicket = {
      bookingId: "BK" + Math.floor(Math.random() * 1000),
      place: selectedPlace,
      slot: selectedSlot,
      slotType: selectedSlotType,
      entryTime,
      payment: selectedPayment,
      amount: rate,
    };

    setTicket(newTicket);

    setBookings((prev) => [
      ...prev,
      {
        id: newTicket.bookingId,
        slot: `Slot ${selectedSlot} (${selectedSlotType})`,
        start: entryTime,
        end: "—",
        status: "Active",
        amount: rate,
      },
    ]);
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

  return (
    <div
      className="bg-gradient-to-br from-[#A8E6CF] to-[#D0F0FD] 
           border border-transparent
           rounded-2xl p-5 shadow-md
           transition hover:shadow-lg text-[#0B2E33]"
    >
      <h1 className="text-2xl font-bold mb-6">👤 User Dashboard</h1>
      {/* 🔥 USER STATISTICS */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          bgColor="bg-[#DFF6E4]" // light green
          shadowColor="shadow-lg"
          valueColor="text-[#0B2E33]"
          labelColor="text-[#4B5563]"
        />
        <StatCard
          title="Active Parking"
          value={activeParking}
          bgColor="bg-[#DFF6E4]" // same light green for consistency
          shadowColor="shadow-lg"
          valueColor="text-[#28C76F]"
          labelColor="text-[#4B5563]"
        />
        <StatCard
          title="Amount Spent"
          value={`₹${amountSpent}`}
          bgColor="bg-[#DFF6E4]" // light pastel blue
          shadowColor="shadow-lg"
          valueColor="text-[#0B84FF]"
        />
      </div>
      {/* SEARCH / PLACES - CLEAN CARD + VIEW IMAGE MODAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#E6F7FF] rounded-3xl shadow-xl p-6 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          🔎 Search Parking Location
        </h2>

        {/* SEARCH + LOCATION */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2E33]/50 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-12 rounded-2xl
                 bg-gradient-to-br from-[#D0F0FD] to-[#A8E6CF]
                 border border-transparent
                 shadow-md
                 focus:outline-none focus:ring-2 focus:ring-[#94AF6E]
                 text-[#0B2E33] font-medium
                 transition-all duration-300 hover:shadow-lg"
            />
          </div>

          {/* Location Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUseCurrentLocation}
            className="bg-gradient-to-br from-[#A8E6CF] to-[#D0F0FD]
               text-[#0B2E33] font-semibold
               px-6 py-3 rounded-2xl shadow-md
               transition-all duration-300 hover:shadow-lg"
          >
            📍 Use My Location
          </motion.button>
        </div>

        {/* PLACE CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.keys(places)
            .filter((p) => p.toLowerCase().includes(search.toLowerCase()))
            .map((place, i) => {
              const images = {
                "City Mall":
                  "https://source.unsplash.com/400x250/?mall,shopping",
                Airport: "https://source.unsplash.com/400x250/?airport,plane",
                "Tech Park":
                  "https://source.unsplash.com/400x250/?office,technology",
              };

              return (
                <motion.div
                  key={place}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                  }}
                  onClick={() => handlePlaceSelect(place)}
                  className="bg-white p-5 rounded-2xl shadow-lg cursor-pointer flex flex-col justify-between transition hover:shadow-xl"
                >
                  <div>
                    <p className="font-bold text-lg mb-1 text-slate-800">
                      {place}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      {places[place].type}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      Rate: ₹{places[place].rate}/hr
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      Slots: {places[place].slots}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      Distance: {getDistance(places[place].coords)} km | ETA:{" "}
                      {getEstimatedArrival(places[place].coords)}
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToPlace(place);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-blue-700 transition"
                    >
                      Navigate
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageModal({
                          open: true,
                          src: images[place],
                          title: place,
                        });
                      }}
                      className="flex-1 bg-gray-200 text-slate-800 px-4 py-2 rounded-lg text-sm shadow hover:bg-gray-300 transition"
                    >
                      View Image
                    </motion.button>
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
        <div className="bg-[#FFFFFF] rounded-2xl shadow p-6 mb-8">
          <h2 className="font-semibold mb-4 text-[#0B2E33]">
            Parking Slots – {selectedPlace}
          </h2>

          <div className="grid grid-cols-5 gap-3">
            {placeSlots.map((slot) => (
              <div
                key={slot.number}
                onClick={() => !slot.occupied && setSelectedSlot(slot.number)}
                className={`p-4 rounded-lg text-center text-sm font-medium cursor-pointer
            ${
              slot.occupied
                ? "bg-[#EA5455]/20 text-[#EA5455] cursor-not-allowed" // occupied → error
                : selectedSlot === slot.number
                  ? "bg-[#FF9F43]/20 text-[#FF9F43]" // selected → warning
                  : "bg-[#28C76F]/20 text-[#28C76F]" // available → success
            }`}
              >
                Slot {slot.number}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ===== BOOKING MODAL ===== */}
      {selectedSlot && !ticket && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#BCD8EC] rounded-3xl shadow-2xl p-6 mb-8 max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#0B2E33] text-center">
            📝 Booking Summary – {selectedPlace}
          </h2>

          <div className="bg-white/60 rounded-2xl p-4 shadow-md mb-4 backdrop-blur-sm">
            <label className="flex items-center gap-2 mb-2 font-semibold text-[#0B2E33]">
              Slot Type:
            </label>
            <select
              className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition font-medium text-[#0B2E33]"
              value={selectedSlotType}
              onChange={(e) => setSelectedSlotType(e.target.value)}
            >
              <option value="Regular">Regular</option>
              <option value="Premium">Premium (+20%)</option>
            </select>
          </div>

          <p className="text-[#0B2E33] font-medium text-lg mb-4">
            Rate: ₹
            {(
              places[selectedPlace].rate *
              (selectedSlotType === "Premium" ? 1.2 : 1)
            ).toFixed(0)}
            /hr
          </p>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-[#0B2E33]">
              Payment Method:
            </label>
            <select
              className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-pink-300 transition font-medium text-[#0B2E33]"
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
            >
              <option value="Wallet">Wallet</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>

          <motion.button
            onClick={handleConfirmBookingWithPayment}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#2E8857] text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-[#7f8b58] transition text-lg"
          >
            💳 Pay & Confirm Booking
          </motion.button>
        </motion.div>
      )}
      {/* ===== DIGITAL TICKET / QR CODE ===== */}
      {ticket && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-[#BCD8EC] rounded-3xl shadow-lg p-6 mb-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          {/* Ticket Text */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 text-left space-y-2"
          >
            <h2 className="text-2xl font-bold text-[#0B2E33] mb-2">
              🎫 Digital Ticket
            </h2>
            <p className="text-[#0B2E33] font-medium">
              <span className="font-semibold">Booking ID:</span>{" "}
              {ticket.bookingId} <br />
              <span className="font-semibold">Place:</span> {ticket.place}{" "}
              <br />
              <span className="font-semibold">Slot:</span> {ticket.slot} <br />
              <span className="font-semibold">Slot Type:</span>{" "}
              {ticket.slotType} <br />
              <span className="font-semibold">Time:</span> {ticket.entryTime}{" "}
              <br />
              <span className="font-semibold">Payment:</span> {ticket.payment}{" "}
              <br />
              <span className="font-semibold">Amount:</span> ₹{ticket.amount}
            </p>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-md"
          >
            <QRCodeCanvas
              value={JSON.stringify(ticket)}
              size={160}
              bgColor="#ffffff"
              fgColor="#0B2E33"
              level="H"
            />
          </motion.div>
        </motion.div>
      )}
      ;{/* ===== ENTRY AT PARKING ===== */}
      {ticket && !entryLogged && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-[#BCD8EC] rounded-3xl shadow-xl p-6 mb-6 max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          {/* Text Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-left"
          >
            <h3 className="text-2xl font-bold text-[#0B2E33] mb-2">
              🚪 Entry at Parking
            </h3>
            <p className="text-[#0B2E33] mb-4">
              Scan your QR code at the parking gate to log entry automatically.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const now = new Date();
                const timeString = now.toLocaleTimeString();

                // 1️⃣ Log entry time
                setEntryTime(timeString);
                setEntryLogged(true);

                // 2️⃣ Update booking start time
                setBookings((prev) =>
                  prev.map((b) =>
                    b.id === ticket.bookingId ? { ...b, start: timeString } : b,
                  ),
                );

                // 3️⃣ Activate While Parking card
                setParkingActive(true);

                // 4️⃣ Start duration timer
                setParkingStartTime(now);
              }}
              className="w-full md:w-auto bg-gradient-to-r from-[#0B84FF] to-[#28C76F] text-white py-3 px-6 rounded-2xl font-bold shadow hover:from-[#0A6ECC] hover:to-[#20B95F] transition text-lg"
            >
              Scan QR / Confirm Entry
            </motion.button>
          </motion.div>

          {/* Optional Icon / Illustration */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl"
          >
            🚪
          </motion.div>
        </motion.div>
      )}
      {/* ===== WHILE PARKING ===== */}
      {parkingActive && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-[#BCD8EC] rounded-3xl shadow-2xl p-6 mb-6 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6"
        >
          {/* Text Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-left"
          >
            <h3 className="text-2xl font-bold text-[#0B2E33] mb-3">
              ⏱️ Parking in Progress
            </h3>
            <p className="text-[#0B2E33] mb-2">Entry Time: {entryTime}</p>
            <p className="text-[#0B2E33] mb-4">
              Parking Duration: {parkingDuration} min
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("Extend Parking Feature Coming Soon!")}
                className="flex-1 bg-gradient-to-r from-[#FFD166] to-[#F0A500] text-[#0B2E33] py-3 rounded-2xl font-semibold shadow transition"
              >
                ➕ Extend Parking
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setParkingActive(false);
                  alert("Parking Ended!");
                }}
                className="flex-1 bg-gradient-to-r from-[#FF6B6B] to-[#D72638] text-white py-3 rounded-2xl font-semibold shadow transition"
              >
                🛑 End Parking
              </motion.button>
            </div>
          </motion.div>

          {/* Icon / Illustration */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl"
          >
            🚗
          </motion.div>
        </motion.div>
      )}
      {/* ===== REAL-TIME SLOT STATS ===== */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard
          title="Total Slots"
          value={TOTAL_SLOTS}
          bgColor="bg-[#FFF4D6]" // soft light blue background
          valueColor="text-[#0B84FF]" // blue for number
          shadowColor="shadow-lg"
        />
        <StatCard
          title="Available Slots"
          value={availableSlots}
          bgColor="bg-[#FFF4D6]" // light gentle yellow
          valueColor="text-[#28C76F]"
          shadowColor="shadow-lg"
        />
        <StatCard
          title="Occupied Slots"
          value={occupiedSlots}
          bgColor="bg-[#FFF4D6]"
          valueColor="text-[#D72638]"
          shadowColor="shadow-lg"
        />
        <div className="bg-[#FFF4D6] rounded-2xl shadow-lg p-6 flex items-center justify-center">
          <span
            className={`px-4 py-2 rounded-full font-semibold text-white ${
              getStatusColor() === "bg-green-500"
                ? "bg-green-500"
                : getStatusColor() === "bg-red-500"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            } transition-all`}
          >
            Live Status
          </span>
        </div>
      </div>
      {/* MY BOOKINGS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#D7F0FA] rounded-3xl shadow-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6 text-[#0B3D91]">
          📋 My Bookings
        </h2>

        <div className="space-y-4">
          {bookings.length === 0 && (
            <div className="text-center py-10 text-[#4B5563]">
              No bookings yet 🚗
            </div>
          )}

          {bookings.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
              className="bg-white 
           border border-[#D1D5DB] 
           rounded-2xl p-5 shadow-md 
           transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-[#0B3D91]">
                    Booking ID: {b.id}
                  </p>
                  <p className="text-sm text-[#4B5563]">{b.slot}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      b.status === "Active"
                        ? "bg-[#64DD17] text-white" // Light green
                        : b.status === "Completed"
                          ? "bg-[#29B6F6] text-white" // Light blue
                          : "bg-[#FF8A80] text-white" // Red for Cancelled
                    }`}
                  >
                    {b.status}
                  </span>

                  {b.status === "Active" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelBooking(b.id)}
                      className="bg-[#FF8A80] text-white px-3 py-1 rounded-lg text-xs shadow hover:bg-[#F44336] transition"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[#4B5563]">
                <div>
                  <p className="text-[#9CA3AF] text-xs">Start Time</p>
                  <p className="font-medium text-[#0B3D91]">{b.start}</p>
                </div>

                <div>
                  <p className="text-[#9CA3AF] text-xs">Amount</p>
                  <p className="font-medium text-[#388E3C]">₹{b.amount}</p>
                </div>

                <div>
                  <p className="text-[#9CA3AF] text-xs">Status</p>
                  <p className="font-medium text-[#0B3D91]">{b.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  title,
  value,
  bgColor = "bg-white",
  valueColor = "text-slate-800",
  shadowColor = "shadow-md",
}) {
  // Safely extract number
  const numericValue =
    typeof value === "number"
      ? value
      : parseInt(String(value).replace(/[^\d]/g, ""), 10) || 0;

  // Detect currency
  const isCurrency = typeof value === "string" && value.includes("₹");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className={`${bgColor} rounded-2xl p-6 ${shadowColor} hover:shadow-xl`}
    >
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className={`text-3xl font-bold mt-2 ${valueColor}`}>
        {isCurrency && "₹"}
        <CountUp end={numericValue} duration={1.5} />
      </h3>
    </motion.div>
  );
}
