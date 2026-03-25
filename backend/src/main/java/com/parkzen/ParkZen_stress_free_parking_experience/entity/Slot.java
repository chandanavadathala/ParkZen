package com.parkzen.Parkzen_stress_free_parking_experience.entity;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotType;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.VehicleSize;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slot extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    private VehicleSize vehicleSize;

    @Enumerated(EnumType.STRING)
    private SlotType slotType;

    private Double ratePerHour;

    @Enumerated(EnumType.STRING)
    private SlotStatus status;

    @ManyToOne
    @JoinColumn(name = "parking_id")
    private Parking parking;
}