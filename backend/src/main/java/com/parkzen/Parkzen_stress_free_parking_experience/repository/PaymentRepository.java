package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingUserId(Long userId);

    List<Payment> findByBookingSlotParkingId(Long parkingId);
    @Query("""
SELECT p FROM Payment p
JOIN FETCH p.booking b
JOIN FETCH b.user
JOIN FETCH b.slot s
WHERE s.parking.id = :parkingId
""")
    List<Payment> findByParkingId(@Param("parkingId") Long parkingId);

}