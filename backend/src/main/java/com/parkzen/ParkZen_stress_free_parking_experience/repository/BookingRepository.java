package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findBySlotId(Long slotId);

    List<Booking> findBySlotParkingId(Long parkingId);
}