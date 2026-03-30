package com.parkzen.Parkzen_stress_free_parking_experience.entity;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parking extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String parkingName;

    private String parkingAddress;

    private Double latitude;

    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

}