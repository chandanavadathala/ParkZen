package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByParkingId(Long parkingId);

}