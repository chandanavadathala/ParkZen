package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
}
