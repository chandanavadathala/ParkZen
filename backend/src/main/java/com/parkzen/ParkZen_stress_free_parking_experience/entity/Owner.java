package com.parkzen.ParkZen_stress_free_parking_experience.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "owners")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String parkingName;

    @Column(nullable = false)
    private String parkingAddress;

    private Double latitude;

    private Double longitude;

    @Column(unique = true, nullable = false)
    private String mobile;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // Record creation time
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Record update time
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}