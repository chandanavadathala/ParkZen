package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parkzen.ParkZen_stress_free_parking_experience.entity.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    Optional<Owner> findByEmail(String email);
    Optional<Owner> findByMobile(String mobile);

}
