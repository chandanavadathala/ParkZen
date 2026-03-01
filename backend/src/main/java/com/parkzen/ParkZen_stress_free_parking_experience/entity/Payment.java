package com.parkzen.ParkZen_stress_free_parking_experience.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private double amount;

    private String paymentMethod;   // UPI, Card, Cash

    private String paymentStatus;   // Success, Failed

    private String transactionId;

    private LocalDateTime paymentTime;
}