package com.parkzen.ParkZen_stress_free_parking_experience.repository;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.EntryExitLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntryExitLogRepository extends JpaRepository<EntryExitLog, Long> {
}
