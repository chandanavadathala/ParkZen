package com.parkzen.ParkZen_stress_free_parking_experience.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parkzen.ParkZen_stress_free_parking_experience.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByMobile(String mobile);

}