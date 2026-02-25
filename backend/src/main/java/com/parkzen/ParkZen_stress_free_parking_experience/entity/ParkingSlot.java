package com.parkzen.ParkZen_stress_free_parking_experience.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "parking_slots")
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slotNumber;

    private String category;   // Car, Bike

    private double pricePerHour;

    private String status;     // Available, Occupied

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;
}