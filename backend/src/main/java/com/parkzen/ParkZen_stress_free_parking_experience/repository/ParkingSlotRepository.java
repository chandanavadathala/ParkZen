package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByOwnerId(Long ownerId);
}
