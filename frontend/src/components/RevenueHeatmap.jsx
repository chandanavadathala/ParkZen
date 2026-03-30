import React, { useState, useEffect } from 'react';
import { getDynamicPrice, getPriceCategory, getPriceColor } from '../utils/pricingLogic.js';

const RevenueHeatmap = ({ 
  basePrice = 50, 
  occupancyRate = 50, 
  weather = 'Clear', 
  eventNearby = false,
  gridRows = 8,
  gridCols = 10 
}) => {
  const [slots, setSlots] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [aiAdjustments, setAiAdjustments] = useState([]);

  useEffect(() => {
    generateSlotData();
  }, [basePrice, occupancyRate, weather, eventNearby]);

  const generateSlotData = () => {
    const newSlots = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const slotId = `${row}-${col}`;
        const slotOccupancy = Math.random() * 100; // Random occupancy for demo
        const hasEvent = Math.random() > 0.7; // 30% chance of nearby event
        const weatherCondition = Math.random() > 0.8 ? 'Rainy' : weather;
        
        const pricing = getDynamicPrice(
          basePrice, 
          slotOccupancy, 
          weatherCondition, 
          hasEvent
        );
        
        const category = getPriceCategory(pricing.adjustedPrice, basePrice);
        const color = getPriceColor(category);
        
        // AI Pricing Adjustments
        const newAiAdjustments = [];
        if (weather === 'Rainy' && slotOccupancy > 70) {
          newAiAdjustments.push({ type: 'surge', amount: 20, reason: 'High demand due to rain' });
        }
        if (eventNearby && slotOccupancy > 85) {
          newAiAdjustments.push({ type: 'surge', amount: 30, reason: 'Event nearby - increased demand' });
        }
        if (weather === 'Foggy') {
          newAiAdjustments.push({ type: 'discount', amount: -10, reason: 'Low visibility discount' });
        }
        setAiAdjustments(newAiAdjustments);
        
        newSlots.push({
          id: slotId,
          row,
          col,
          occupancy: slotOccupancy,
          pricing,
          category,
          color,
          isOccupied: Math.random() > 0.3 // 70% occupied for demo
        });
      }
    }
    setSlots(newSlots);
  };

  const getSlotSize = () => {
    const maxSlotWidth = 60;
    const maxSlotHeight = 40;
    return {
      width: Math.min(maxSlotWidth, 800 / gridCols),
      height: Math.min(maxSlotHeight, 400 / gridRows)
    };
  };

  const slotSize = getSlotSize();

  const getStats = () => {
    const totalSlots = slots.length;
    const occupiedSlots = slots.filter(slot => slot.isOccupied).length;
    const highRevenueSlots = slots.filter(slot => slot.category === 'high').length;
    const averageRevenueSlots = slots.filter(slot => slot.category === 'average').length;
    const baseRevenueSlots = slots.filter(slot => slot.category === 'base').length;
    
    return {
      totalSlots,
      occupiedSlots,
      occupancyRate: totalSlots > 0 ? (occupiedSlots / totalSlots * 100).toFixed(1) : 0,
      highRevenueSlots,
      averageRevenueSlots,
      baseRevenueSlots
    };
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Revenue Heatmap</h3>
        <p className="text-sm text-gray-600">Real-time parking slot revenue visualization</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded p-3">
          <div className="text-2xl font-bold text-gray-800">{stats.totalSlots}</div>
          <div className="text-xs text-gray-600">Total Slots</div>
        </div>
        <div className="bg-blue-50 rounded p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.occupancyRate}%</div>
          <div className="text-xs text-gray-600">Occupancy Rate</div>
        </div>
        <div className="bg-red-50 rounded p-3">
          <div className="text-2xl font-bold text-red-600">{stats.highRevenueSlots}</div>
          <div className="text-xs text-gray-600">High Revenue</div>
        </div>
        <div className="bg-green-50 rounded p-3">
          <div className="text-2xl font-bold text-green-600">{stats.baseRevenueSlots}</div>
          <div className="text-xs text-gray-600">Base Price</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Base Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-600">Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-600">High Revenue</span>
        </div>
      </div>

      {/* AI Pricing Adjustments */}
      {aiAdjustments.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-bold text-blue-800 mb-2">AI Pricing Adjustments</h4>
          <div className="space-y-2">
            {aiAdjustments.map((adjustment, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {adjustment.type === 'surge' ? '📈' : adjustment.type === 'discount' ? '📉' : '🤖'} 
                  {adjustment.reason}
                </span>
                <span className={`font-bold ${
                  adjustment.type === 'surge' ? 'text-red-600' : 
                  adjustment.type === 'discount' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {adjustment.type === 'surge' ? '+' : ''}{adjustment.amount}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="flex justify-center mb-4">
        <div 
          className="grid gap-1 p-4 bg-gray-100 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, ${slotSize.width}px)`,
            gridTemplateRows: `repeat(${gridRows}, ${slotSize.height}px)`
          }}
        >
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`rounded cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 ${
                slot.isOccupied ? 'opacity-90' : 'opacity-40'
              }`}
              style={{
                backgroundColor: slot.color,
                width: slotSize.width,
                height: slotSize.height
              }}
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(null)}
              title={`Slot ${slot.id}: $${slot.pricing.adjustedPrice.toFixed(2)}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-white font-semibold">
                  {slot.isOccupied ? '🚗' : '📍'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Details */}
      {hoveredSlot && (
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Slot:</span>
              <span className="ml-2 font-semibold">{hoveredSlot.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="ml-2 font-semibold">${hoveredSlot.pricing.adjustedPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Occupancy:</span>
              <span className="ml-2 font-semibold">{hoveredSlot.occupancy.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-semibold">{hoveredSlot.isOccupied ? 'Occupied' : 'Available'}</span>
            </div>
          </div>
          {hoveredSlot.pricing.adjustments.length > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Adjustments:</span>
              <span className="ml-2 text-blue-600">{hoveredSlot.pricing.adjustments.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RevenueHeatmap;
