import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ QR code library


export default function UserDashboard() {
  const TOTAL_SLOTS = 50;
  const [availableSlots, setAvailableSlots] = useState(32);

  // ===== PLACE SEARCH =====
  const places = {
    'City Mall': {
      slots: 20,
      type: 'Covered',
      rate: 50,
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    Airport: {
      slots: 30,
      type: 'Open',
      rate: 40,
      coords: { lat: 12.9985, lng: 77.567 },
    },
    'Tech Park': {
      slots: 15,
      type: 'EV Charging',
      rate: 60,
      coords: { lat: 12.9352, lng: 77.6245 },
    },
  };

  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeSlots, setPlaceSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  // Add this inside UserDashboard, with other useState hooks
  const [imageModal, setImageModal] = useState({
    open: false,
    src: '',
    title: '',
  });
  // Inside UserDashboard component
  const [entryLogged, setEntryLogged] = useState(false);
  const [entryTime, setEntryTime] = useState(null);
  // Tracks if user is currently parked
  const [parkingActive, setParkingActive] = useState(false);

  // Tracks start time for parking duration
  const [parkingStartTime, setParkingStartTime] = useState(null);

  // Tracks parking duration (updates every second)
  const [parkingDuration, setParkingDuration] = useState('0:00');

  // Track payment status for current parking
  const [parkingPaymentStatus, setParkingPaymentStatus] = useState('Pending');

  // ===== NEW STATES FOR BOOKING MODAL =====
  const [selectedSlotType, setSelectedSlotType] = useState('Regular');
  const [selectedPayment, setSelectedPayment] = useState('Wallet');
  const [extendedMinutes, setExtendedMinutes] = useState(0);

  // ===== DIGITAL TICKET =====
  const [ticket, setTicket] = useState(null);

  // ===== BOOKINGS =====
  const [bookings, setBookings] = useState([
    {
      id: 'BK101',
      slot: 'A12',
      start: '10:00 AM',
      end: '12:00 PM',
      status: 'Active',
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
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  // ===== STATISTICS CALCULATION =====
  const totalBookings = bookings.length;
  const activeParking = bookings.filter((b) => b.status === 'Active').length;
  const amountSpent = bookings
    .filter((b) => b.status !== 'Cancelled')
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
    setSelectedSlotType('Regular');
    setSelectedPayment('Wallet');
  };

  // ===== GPS LOCATION =====
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // ===== CALCULATE DISTANCE =====
  const getDistance = (placeCoords) => {
    if (!userCoords) return '-';
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
    if (!userCoords) return '-';
    const distanceKm = parseFloat(getDistance(placeCoords));
    const etaMinutes = Math.ceil((distanceKm / 40) * 60); // assuming avg 40 km/h
    return etaMinutes + ' min';
  };

  // ===== NAVIGATION =====
  const handleNavigateToPlace = (place) => {
    const coords = places[place].coords;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(mapsUrl, '_blank');
  };

  // ===== CONFIRM BOOKING WITH PAYMENT =====
  const handleConfirmBookingWithPayment = () => {
    const rate =
      places[selectedPlace].rate * (selectedSlotType === 'Premium' ? 1.2 : 1);
    const entryTime = new Date().toLocaleTimeString();

    const newTicket = {
      bookingId: 'BK' + Math.floor(Math.random() * 1000),
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
        end: '—',
        status: 'Active',
        amount: rate,
      },
    ]);
  };

  // ===== STATUS COLORS =====
  const getStatusColor = () => {
    if (availableSlots === 0) return 'bg-red-100 text-red-700';
    if (availableSlots <= 10) return 'bg-yellow-100 text-yellow-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const getBookingStatusColor = (status) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Completed') return 'bg-blue-100 text-blue-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-6">
      <h1 className="text-2xl font-bold mb-6">👤 User Dashboard</h1>

      {/* 🔥 USER STATISTICS */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Active Parking" value={activeParking} />
        <StatCard title="Amount Spent" value={`₹${amountSpent}`} />
      </div>

      {/* SEARCH / PLACES - CLEAN CARD + VIEW IMAGE MODAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-6 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          🔎 Search Parking Location
        </h2>

        {/* SEARCH + LOCATION */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-12 border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-gray-700 font-medium"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUseCurrentLocation}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-700 transition font-semibold"
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
                'City Mall':
                  'https://source.unsplash.com/400x250/?mall,shopping',
                Airport: 'https://source.unsplash.com/400x250/?airport,plane',
                'Tech Park':
                  'https://source.unsplash.com/400x250/?office,technology',
              };

              return (
                <motion.div
                  key={place}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
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
                      Distance: {getDistance(places[place].coords)} km | ETA:{' '}
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
          onClick={() => setImageModal({ open: false, src: '', title: '' })}
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
                  setImageModal({ open: false, src: '', title: '' })
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
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="font-semibold mb-4">
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
                      ? 'bg-red-200 text-red-700 cursor-not-allowed'
                      : selectedSlot === slot.number
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-emerald-200 text-emerald-800'
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
          initial = {{opacity:0,y:20,scale:0.95}}
          animate={{opacity:1,y:0,scale:1}}
          transition={{ duration: 0.4 }}
           className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-6 mb-8 max-w-md mx-auto"
          > 
          <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">
            📝 Booking Summary – {selectedPlace}
          </h2>

          <div className="bg-white/80 rounded-2xl p-4 shadow-md mb-4 backdrop-blur-sm">
            <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">Slot Type:</label>
            <select
              className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-medium text-slate-800"
              value={selectedSlotType}
              onChange={(e) => setSelectedSlotType(e.target.value)}
            >
              <option value="Regular">Regular</option>
              <option value="Premium">Premium (+20%)</option>
            </select>
          </div>

          <p className="text-slate-800 font-medium text-lg">
            Rate: ₹
            {(
              places[selectedPlace].rate *
              (selectedSlotType === 'Premium' ? 1.2 : 1)
            ).toFixed(0)}
            /hr
          </p>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Payment Method:</label>
            <select
              className="border p-2 rounded-lg"
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold shadow hover:bg-emerald-700 transition text-lg"
          >
            💳 Pay & Confirm Booking
          </motion.button>
        </motion.div>
      )}

      {/* ===== DIGITAL TICKET / QR CODE ===== */}
      {ticket && (
        <div className="bg-white rounded-2xl shadow p-6 mb-8 text-center">
          <h2 className="text-lg font-semibold mb-2">🎫 Digital Ticket</h2>
          <p>
            Booking ID: {ticket.bookingId} <br />
            Place: {ticket.place} <br />
            Slot: {ticket.slot} <br />
            Slot Type: {ticket.slotType} <br />
            Time: {ticket.entryTime} <br />
            Payment: {ticket.payment} <br />
            Amount: ₹{ticket.amount}
          </p>
          ,
          <div className="mt-4 flex justify-center">
            <QRCodeCanvas
              value={JSON.stringify(ticket)}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
        </div>
      )}
     {/* ===== ENTRY AT PARKING ===== */}
{ticket && !entryLogged && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-3xl shadow-lg p-6 mb-6 max-w-md mx-auto"
  >
    <h3 className="text-lg font-semibold text-slate-800 mb-4">
      🚪 Entry at Parking
    </h3>
    <p className="text-slate-600 mb-4">
      Scan your QR code at the parking gate to log entry automatically.
    </p>

    <motion.button
      whileHover={{ scale: 1.05 }}
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
            b.id === ticket.bookingId ? { ...b, start: timeString } : b
          )
        );

        // 3️⃣ Activate While Parking card
        setParkingActive(true);

        // 4️⃣ Start duration timer
        setParkingStartTime(now);
      }}
      className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold shadow hover:bg-blue-700 transition text-lg"
    >
      Scan QR / Confirm Entry
    </motion.button>
  </motion.div>
)}

{/* ===== WHILE PARKING ===== */}
{parkingActive && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-3xl shadow-xl p-6 mb-6 max-w-md mx-auto"
  >
    <h3 className="text-lg font-semibold text-slate-800 mb-4">
      ⏱️ Parking in Progress
    </h3>

    <p className="text-slate-600 mb-2">Entry Time: {entryTime}</p>
    <p className="text-slate-600 mb-4">
      Parking Duration: {parkingDuration} min
    </p>

    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => alert('Extend Parking Feature Coming Soon!')}
        className="flex-1 bg-yellow-500 text-white py-2 rounded-2xl font-semibold shadow hover:bg-yellow-600 transition"
      >
        ➕ Extend Parking
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setParkingActive(false);
          alert('Parking Ended!');
        }}
        className="flex-1 bg-red-600 text-white py-2 rounded-2xl font-semibold shadow hover:bg-red-700 transition"
      >
        🛑 End Parking
      </motion.button>
    </div>
  </motion.div>
)}

      {/* REAL TIME SLOT STATS */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard title="Total Slots" value={TOTAL_SLOTS} />
        <StatCard title="Available Slots" value={availableSlots} />
        <StatCard title="Occupied Slots" value={occupiedSlots} />
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center">
          <span className={`px-4 py-2 rounded-full ${getStatusColor()}`}>
            Live Status
          </span>
        </div>
      </div>

      {/* MY BOOKINGS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6 text-slate-800">
          📋 My Bookings
        </h2>

        <div className="space-y-4">
          {bookings.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              No bookings yet 🚗
            </div>
          )}

          {bookings.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-r from-white to-slate-50 
                 border border-slate-200 
                 rounded-2xl p-5 shadow-sm 
                 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    Booking ID: {b.id}
                  </p>
                  <p className="text-sm text-slate-500">{b.slot}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getBookingStatusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>

                  {b.status === 'Active' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelBooking(b.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs shadow hover:bg-red-600 transition"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-600">
                <div>
                  <p className="text-slate-400 text-xs">Start Time</p>
                  <p className="font-medium">{b.start}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Amount</p>
                  <p className="font-medium text-emerald-600">₹{b.amount}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <p className="font-medium">{b.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value }) {
  // ✅ Safely extract number (fixes NaN crash)
  const numericValue =
    typeof value === 'number'
      ? value
      : parseInt(String(value).replace(/[^\d]/g, ''), 10) || 0;

  // ✅ Detect currency
  const isCurrency = typeof value === 'string' && value.includes('₹');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl"
    >
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-3xl font-bold mt-2 text-slate-800">
        {isCurrency && '₹'}
        <CountUp end={numericValue} duration={1.5} />
      </h3>
    </motion.div>
  );
}
