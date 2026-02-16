import { useState, useEffect } from "react";

export default function OwnerDashboard() {
  // ---------------- PARKING LOT SETUP ----------------
const [parkingConfigured, setParkingConfigured] = useState(false);

const [parkingForm, setParkingForm] = useState({
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  regularSlots: 0,
  premiumSlots: 0,
  evSlots: 0,
  hourlyRate: 50,
  enableDynamicPricing: true,
  payoutMethod: "",
  payoutAccount: "",
});
  
  
  const totalSlots = 50;

  // ---------------- SLOTS ----------------
  const [slots, setSlots] = useState(
    Array.from({ length: totalSlots }, (_, i) => ({
      id: i + 1,
      status:
        i % 4 === 0
          ? "occupied"
          : i % 7 === 0
          ? "reserved"
          : "available",
    }))
  );

  const occupied = slots.filter(s => s.status === "occupied").length;
  const reserved = slots.filter(s => s.status === "reserved").length;
  const available = totalSlots - occupied - reserved;

  const occupancyRate = Math.round(
    ((occupied + reserved) / totalSlots) * 100
  );

  // ---------------- PRICING ENGINE ----------------
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const basePrice = 50;
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [suggestedPrice, setSuggestedPrice] = useState(basePrice);

  useEffect(() => {
    let newPrice = basePrice;

    if (occupancyRate >= 80) {
      newPrice = basePrice + 20;
    } else if (occupancyRate <= 40) {
      newPrice = basePrice - 10;
    }

    setSuggestedPrice(newPrice);

    if (dynamicPricing) {
      setCurrentPrice(newPrice);
    }
  }, [occupancyRate, dynamicPricing]);

  // ---------------- REVENUE ----------------
  const todayRevenue = currentPrice * occupied * 2;

  // ---------------- SLOT TOGGLE ----------------
  const toggleSlot = (id) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === id
          ? {
              ...slot,
              status:
                slot.status === "available"
                  ? "occupied"
                  : slot.status === "occupied"
                  ? "available"
                  : slot.status,
            }
          : slot
      )
    );
  };

  // ---------------- LIVE ENTRY / EXIT ----------------
  const [liveVehicles] = useState([
    {
      id: 1,
      vehicleNo: "TS09AB1234",
      slot: 12,
      entryTime: Date.now() - 60 * 60 * 1000,
      expectedExit: Date.now() + 30 * 60 * 1000,
    },
    {
      id: 2,
      vehicleNo: "AP28CD5678",
      slot: 5,
      entryTime: Date.now() - 2.5 * 60 * 60 * 1000,
      expectedExit: Date.now() - 10 * 60 * 1000,
    },
  ]);

  const now = Date.now();

  // ---------------- SMART ALERTS SYSTEM ----------------
  const alerts = [];

  if (occupancyRate > 90) {
    alerts.push({
      type: "danger",
      message: "Parking almost full! Occupancy crossed 90%",
    });
  }

  const overstayedVehicles = liveVehicles.filter(
    v => now - v.expectedExit > 30 * 60 * 1000
  );

  if (overstayedVehicles.length > 0) {
    alerts.push({
      type: "warning",
      message: `${overstayedVehicles.length} vehicle(s) overstayed more than 30 mins`,
    });
  }

  const yesterdayRevenue = todayRevenue + 1200;

  if (todayRevenue < yesterdayRevenue) {
    alerts.push({
      type: "info",
      message: "Revenue dropped compared to yesterday",
    });
  }

  // ---------------- POPUP ALERT FOR 90% OCCUPANCY ----------------
  const [showOccupancyPopup, setShowOccupancyPopup] = useState(false);

  useEffect(() => {
    if (occupancyRate > 90) {
      setShowOccupancyPopup(true);
      const timer = setTimeout(() => setShowOccupancyPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [occupancyRate]);

  // ---------------- TEST ALERTS BUTTON FUNCTION ----------------
  const triggerTestAlerts = () => {
    // 1️⃣ Occupancy > 90%
    setSlots(prev =>
      prev.map((slot, i) =>
        i < 46 // 46/50 = 92% occupied
          ? { ...slot, status: "occupied" }
          : slot
      )
    );

    // 2️⃣ Add an overstayed vehicle
    liveVehicles.push({
      id: 999,
      vehicleNo: "TEST1234",
      slot: 50,
      entryTime: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      expectedExit: Date.now() - 45 * 60 * 1000,   // 45 mins ago
    });

    // 3️⃣ Lower revenue artificially (triggers revenue drop)
    setCurrentPrice(10);

    // Optional reset after 5 seconds
    const timer = setTimeout(() => {
      setCurrentPrice(basePrice);
      setSlots(
        Array.from({ length: totalSlots }, (_, i) => ({
          id: i + 1,
          status:
            i % 4 === 0
              ? "occupied"
              : i % 7 === 0
              ? "reserved"
              : "available",
        }))
      );
      liveVehicles.pop(); // remove test vehicle
    }, 5000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">🏢 Owner Dashboard</h1>

      {/* ⚡ TEST ALERTS BUTTON */}
      <div className="mb-4">
        <button
          onClick={triggerTestAlerts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow
          hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5
          transition-all duration-300"
        >
          Test All Alerts
        </button>
      </div>

      {/* ⚠️ Occupancy > 90% Popup Alert */}
      {showOccupancyPopup && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in z-50">
          🚨 Parking almost full! Occupancy crossed 90%
        </div>
      )}

      {/* KPI CARDS */}
      <div className="bg-white rounded-2xl shadow
           hover:shadow-lg hover:-translate-y-1
          transition-all duration-300 p-6">
        <Stat title="Total Slots" value={totalSlots} />
        <Stat title="Occupancy Rate" value={`${occupancyRate}%`} />
        <Stat title="Current Price / Hour" value={`₹${currentPrice}`} />
        <Stat title="Today Revenue" value={`₹${todayRevenue}`} />
      </div>

      {/* 🔔 SMART ALERTS */}
      {alerts.length > 0 && (
        <div className="grid gap-4 mb-8 md:grid-cols-3">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border text-sm font-medium
                ${
                  alert.type === "danger"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : alert.type === "warning"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
            >
              🔔 {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* DYNAMIC PRICING ENGINE */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">⚡ Dynamic Pricing Engine</h2>

          <button
            onClick={() => setDynamicPricing(!dynamicPricing)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${dynamicPricing
                ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300"
                : "bg-gray-200 text-gray-600"}`}
          >
            {dynamicPricing ? "ON" : "OFF"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PriceCard title="Base Price" value={`₹${basePrice}`} desc="Normal demand" />
          <PriceCard
            title="Suggested Price"
            value={`₹${suggestedPrice}`}
            highlight
            desc={
              occupancyRate >= 80
                ? "Peak demand detected"
                : occupancyRate <= 40
                ? "Low demand discount"
                : "Stable demand"
            }
          />
          <PriceCard
            title="Current Applied Price"
            value={`₹${currentPrice}`}
            desc={dynamicPricing ? "Auto-adjusted" : "Manual control"}
          />
        </div>
      </div>

      {/* PARKING SLOTS */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Parking Slots (Click to Toggle)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {slots.map(slot => (
            <div
              key={slot.id}
              onClick={() => toggleSlot(slot.id)}
              className={`cursor-pointer py-4 text-center rounded-xl font-medium
transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                ${
                  slot.status === "occupied"
                    ? "bg-red-100 text-red-700"
                    : slot.status === "reserved"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
            >
              Slot {slot.id}
              <div className="text-xs mt-1 capitalize">
                {slot.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔴 LIVE ENTRY–EXIT TRACKING */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          🚗 Live Entry–Exit Tracking
        </h2>

        <table className="w-full text-sm text-left">
          <thead className="border-b">
            <tr>
              <th className="py-2">Vehicle No</th>
              <th>Slot</th>
              <th>Entry Time</th>
              <th>Expected Exit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {liveVehicles.map(v => {
              const overstayed = now > v.expectedExit;
              return (
                <tr
                  key={v.id}
                  className={`border-b ${overstayed ? "bg-red-50" : ""}`}
                >
                  <td className="py-2 font-medium">{v.vehicleNo}</td>
                  <td>{v.slot}</td>
                  <td>{new Date(v.entryTime).toLocaleTimeString()}</td>
                  <td>{new Date(v.expectedExit).toLocaleTimeString()}</td>
                  <td
                    className={`font-medium ${
                      overstayed ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {overstayed ? "Overstayed" : "Inside"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <h2 className="font-semibold text-indigo-700 mb-2">
          🤖 AI Business Insights
        </h2>
        <ul className="text-sm text-indigo-600 space-y-1">
          <li>• Dynamic pricing increased revenue by ~18%.</li>
          <li>• 1 vehicle currently overstayed.</li>
          <li>• Peak demand occurs between 6PM – 9PM.</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function PriceCard({ title, value, desc, highlight }) {
  return (
    <div
      className={`rounded-xl p-5 border
        ${
          highlight
            ? "bg-emerald-50 border-emerald-200"
            : "bg-gray-50 border-gray-200"
        }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      <p className="text-xs mt-2 text-gray-600">{desc}</p>
    </div>
  );
}