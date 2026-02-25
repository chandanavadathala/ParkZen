package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
