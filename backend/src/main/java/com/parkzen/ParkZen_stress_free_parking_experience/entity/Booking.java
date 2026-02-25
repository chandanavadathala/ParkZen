package com.parkzen.ParkZen_stress_free_parking_experience.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private ParkingSlot slot;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String vehicleNumber;

    private String bookingStatus; // Booked, Active, Completed

    private LocalDateTime createdAt;
}