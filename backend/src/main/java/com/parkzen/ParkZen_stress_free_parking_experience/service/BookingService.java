package com.parkzen.Parkzen_stress_free_parking_experience.service;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.BookingRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(BookingRequest request);

    List<Booking> getUserBookings(Long userId);

}