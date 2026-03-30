package com.parkzen.Parkzen_stress_free_parking_experience.repository;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.Parking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<Parking, Long> {

}
