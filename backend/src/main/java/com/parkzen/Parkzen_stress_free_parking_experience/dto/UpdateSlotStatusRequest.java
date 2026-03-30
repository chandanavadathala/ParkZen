package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSlotStatusRequest {

    private Long slotId;

    private SlotStatus status;

}