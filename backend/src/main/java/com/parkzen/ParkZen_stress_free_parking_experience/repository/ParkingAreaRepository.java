package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.ParkingArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParkingAreaRepository extends JpaRepository<ParkingArea, Long> {
    List<ParkingArea> findByCity(String city);
}
