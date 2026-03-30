package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.VehicleSize;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSlotRequest {

    private Long parkingId;

    private String slotNumber;

    private VehicleSize vehicleSize;

    private SlotType slotType;

    private Double ratePerHour;

}