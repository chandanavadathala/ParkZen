/**
 * Dynamic Pricing Logic for ParkZen
 * Uses rule-based regression approach to calculate prices based on various factors
 */

export function getDynamicPrice(basePrice, occupancyRate, weather, eventNearby) {
  let adjustedPrice = basePrice;
  const adjustments = [];

  // Occupancy-based pricing
  if (occupancyRate > 80) {
    adjustedPrice *= 1.20; // Increase by 20%
    adjustments.push('High occupancy (+20%)');
  } else if (occupancyRate < 20) {
    adjustedPrice *= 0.90; // Decrease by 10%
    adjustments.push('Low occupancy (-10%)');
  }

  // Weather-based pricing
  if (weather === 'Rainy') {
    adjustedPrice *= 1.15; // Add 15%
    adjustments.push('Rainy weather (+15%)');
  }

  // Event-based pricing
  if (eventNearby) {
    adjustedPrice *= 1.30; // Add 30%
    adjustments.push('Event nearby (+30%)');
  }

  // Round to 2 decimal places
  adjustedPrice = Math.round(adjustedPrice * 100) / 100;

  return {
    originalPrice: basePrice,
    adjustedPrice,
    adjustments,
    priceIncrease: Math.round(((adjustedPrice - basePrice) / basePrice) * 100),
    factors: {
      occupancyRate,
      weather,
      eventNearby
    }
  };
}

/**
 * Calculate overstay charges
 * @param {number} bookedDuration - Duration in minutes
 * @param {number} actualDuration - Actual duration in minutes
 * @param {number} baseRate - Base rate per hour
 * @returns {number} Total overstay charges
 */
export function calculateOverstayCharges(bookedDuration, actualDuration, baseRate) {
  if (actualDuration <= bookedDuration) {
    return 0;
  }

  const overstayMinutes = actualDuration - bookedDuration;
  const overstayHours = overstayMinutes / 60;
  
  // Charge 1.5x the base rate for overstay
  const overstayCharges = overstayHours * baseRate * 1.5;
  
  return Math.round(overstayCharges * 100) / 100;
}

/**
 * Get price category based on revenue
 * @param {number} price - Current price
 * @param {number} basePrice - Base price for comparison
 * @returns {string} Category: 'high', 'average', or 'base'
 */
export function getPriceCategory(price, basePrice) {
  const increasePercentage = ((price - basePrice) / basePrice) * 100;
  
  if (increasePercentage >= 20) {
    return 'high';
  } else if (increasePercentage >= 5) {
    return 'average';
  } else {
    return 'base';
  }
}

/**
 * Get color based on price category
 * @param {string} category - Price category
 * @returns {string} Hex color code
 */
export function getPriceColor(category) {
  switch (category) {
    case 'high':
      return '#ef4444'; // Red
    case 'average':
      return '#eab308'; // Yellow
    case 'base':
      return '#22c55e'; // Green
    default:
      return '#6b7280'; // Gray
  }
}
