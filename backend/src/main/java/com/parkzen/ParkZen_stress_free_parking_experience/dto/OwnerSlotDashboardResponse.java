package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotType;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.VehicleSize;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OwnerSlotDashboardResponse {

    private Long slotId;

    private String slotNumber;

    private VehicleSize vehicleSize;

    private SlotType slotType;

    private Double ratePerHour;

    private SlotStatus status;

}