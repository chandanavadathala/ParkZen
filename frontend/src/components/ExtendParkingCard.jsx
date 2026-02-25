import React, { useState } from "react";

const ExtendParkingCard = ({
  slotNumber,
  initialTime = 60,
  ratePerHour = 50,
}) => {
  // initialTime in minutes
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [extraTime, setExtraTime] = useState(30); // minutes
  const [totalCost, setTotalCost] = useState((initialTime / 60) * ratePerHour);

  const handleExtendParking = () => {
    const extra = parseInt(extraTime); // ensure it's a number
    const newTime = remainingTime + extra;
    const newCost = (newTime / 60) * ratePerHour;

    // Update state
    setRemainingTime(newTime);
    setTotalCost(newCost);
  };

  return (
    <div className="bg-[#DFF6E4] rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
      <h3 className="text-lg font-semibold text-[#0B2E33]">Extend Parking</h3>

      <div className="text-[#4B5563] text-sm text-center">
        <p>Slot Number: {slotNumber}</p>
        <p>Remaining Time: {remainingTime} mins</p>
        <p>Total Cost: ₹{totalCost.toFixed(2)}</p>
      </div>

      <select
        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#28C76F] w-full text-sm"
        value={extraTime}
        onChange={(e) => setExtraTime(e.target.value)}
      >
        <option value={30}>30 mins</option>
        <option value={60}>1 hour</option>
        <option value={120}>2 hours</option>
      </select>

      <button
        className="bg-[#28C76F] text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
        onClick={handleExtendParking}
      >
        Extend
      </button>
    </div>
  );
};

export default ExtendParkingCard;
