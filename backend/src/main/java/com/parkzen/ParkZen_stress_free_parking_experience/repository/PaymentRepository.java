package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingUserId(Long userId);

    List<Payment> findByBookingSlotParkingId(Long parkingId);

}