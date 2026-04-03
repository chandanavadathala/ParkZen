package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findBySlotId(Long slotId);

    List<Booking> findBySlotParkingId(Long parkingId);
    @Query("""
SELECT b FROM Booking b
JOIN FETCH b.user
JOIN FETCH b.slot s
JOIN FETCH s.parking
WHERE s.parking.id = :parkingId
""")
    List<Booking> findByParkingId(@Param("parkingId") Long parkingId);
}