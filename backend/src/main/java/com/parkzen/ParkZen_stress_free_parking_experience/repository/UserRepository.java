package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.parkzen.ParkZen_stress_free_parking_experience.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);

}
