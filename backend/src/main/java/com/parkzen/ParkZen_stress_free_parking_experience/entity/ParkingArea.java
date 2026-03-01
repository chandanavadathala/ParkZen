package com.parkzen.ParkZen_stress_free_parking_experience.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "parking_areas")
public class ParkingArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String areaName;

    private String city;

    private String address;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;
}