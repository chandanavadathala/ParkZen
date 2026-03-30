import { calculateOverstayCharges } from './pricingLogic.js';

/**
 * Booking Management Logic for ParkZen
 * Handles overstay calculations and wallet deductions
 */

export class BookingManager {
  constructor(authContext) {
    this.auth = authContext;
  }

  /**
   * Process booking completion and handle overstay charges
   * @param {Object} booking - Booking object
   * @param {number} booking.bookedDuration - Booked duration in minutes
   * @param {number} booking.actualDuration - Actual duration in minutes
   * @param {number} booking.baseRate - Base rate per hour
   * @param {Date} booking.endTime - Booking end time
   */
  processBookingCompletion(booking) {
    const { bookedDuration, actualDuration, baseRate } = booking;
    
    // Calculate overstay charges
    const overstayCharges = calculateOverstayCharges(
      bookedDuration, 
      actualDuration, 
      baseRate
    );

    if (overstayCharges > 0) {
      // Deduct from wallet
      const currentBalance = this.auth.user?.walletBalance || 0;
      const newBalance = currentBalance - overstayCharges;
      
      // Update wallet balance
      this.auth.updateWalletBalance(newBalance);
      
      return {
        success: true,
        overstayCharges,
        previousBalance: currentBalance,
        newBalance,
        isBlocked: newBalance < 0
      };
    }

    return {
      success: true,
      overstayCharges: 0,
      message: 'No overstay charges'
    };
  }

  /**
   * Start a live parking session
   * @param {string} bookingId - Unique booking identifier
   * @param {number} durationHours - Duration of booking in hours
   */
  startLiveSession(bookingId, durationHours) {
    const startTime = new Date().toISOString();
    const expiryTime = new Date(Date.now() + (durationHours * 60 * 60 * 1000)).toISOString();
    
    // Update booking in localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = 'Active';
      bookings[bookingIndex].startTime = startTime;
      bookings[bookingIndex].expiryTime = expiryTime;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    
    // Store active session
    const activeSession = {
      bookingId,
      startTime,
      expiryTime,
      durationHours,
      status: 'Active'
    };
    localStorage.setItem('activeSession', JSON.stringify(activeSession));
    
    return {
      success: true,
      session: activeSession
    };
  }

  /**
   * Get active session from localStorage
   */
  getActiveSession() {
    const session = localStorage.getItem('activeSession');
    return session ? JSON.parse(session) : null;
  }

  /**
   * Calculate time remaining for active session
   * @param {string} expiryTime - ISO string of expiry time
   */
  getTimeRemaining(expiryTime) {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const difference = expiry - now;
    
    if (difference <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: true
      };
    }
    
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return {
      hours,
      minutes,
      seconds,
      totalSeconds: difference,
      isExpired: false
    };
  }

  /**
   * Calculate overdue charges when timer expires
   * @param {string} bookingId - Booking identifier
   */
  calculateOverdue(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return null;
    
    // Mark as overstaying
    booking.status = 'Overstaying';
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Calculate overstay charges (start with 1 hour overstay)
    const overstayCharges = calculateOverstayCharges(
      booking.duration * 60, // original booked duration in minutes
      (booking.duration + 1) * 60, // actual duration + 1 hour
      booking.baseRate || 50
    );
    
    return {
      bookingId,
      overstayCharges,
      hourlyRate: booking.baseRate || 50
    };
  }

  /**
   * End active session
   */
  endActiveSession() {
    localStorage.removeItem('activeSession');
  }

  /**
   * Check if user can make new booking
   * @returns {Object} Booking eligibility status
   */
  checkBookingEligibility() {
    const user = this.auth.user;
    
    if (!user) {
      return {
        eligible: false,
        reason: 'User not authenticated'
      };
    }

    if (user.isBlocked) {
      return {
        eligible: false,
        reason: 'Account blocked due to negative wallet balance',
        walletBalance: user.walletBalance
      };
    }

    return {
      eligible: true,
      walletBalance: user.walletBalance
    };
  }

  /**
   * Add funds to user wallet
   * @param {number} amount - Amount to add
   */
  addFunds(amount) {
    const currentBalance = this.auth.user?.walletBalance || 0;
    const newBalance = currentBalance + amount;
    this.auth.updateWalletBalance(newBalance);
    
    return {
      success: true,
      amount,
      previousBalance: currentBalance,
      newBalance
    };
  }

  /**
   * Settle negative balance (unblock user)
   * @param {number} paymentAmount - Amount to pay
   */
  settleBalance(paymentAmount) {
    const currentBalance = this.auth.user?.walletBalance || 0;
    
    if (currentBalance >= 0) {
      return {
        success: false,
        reason: 'No negative balance to settle'
      };
    }

    const newBalance = currentBalance + paymentAmount;
    this.auth.updateWalletBalance(newBalance);
    
    return {
      success: true,
      paymentAmount,
      previousBalance: currentBalance,
      newBalance,
      isUnblocked: newBalance >= 0
    };
  }
}

/**
 * Create a booking instance
 * @param {Object} bookingData - Booking details
 * @returns {Object} Complete booking object
 */
export function createBooking(bookingData) {
  return {
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: null,
    endTime: new Date(Date.now() + (bookingData.duration * 60 * 1000)),
    bookedDuration: bookingData.duration,
    actualDuration: null, // Will be set when booking ends
    baseRate: bookingData.baseRate || 50,
    slotNumber: bookingData.slotNumber,
    userId: bookingData.userId,
    status: 'Booked',
    ...bookingData
  };
}

/**
 * Get booking status based on time
 * @param {Object} booking - Booking object
 * @returns {string} Booking status
 */
export function getBookingStatus(booking) {
  const now = new Date();
  const endTime = new Date(booking.endTime);
  
  if (now < endTime) {
    return booking.status === 'Active' ? 'Active' : 'Booked';
  } else if (booking.actualDuration) {
    return 'Completed';
  } else {
    return 'Overstaying';
  }
}
