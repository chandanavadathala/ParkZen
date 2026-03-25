package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequest {

    private Long userId;

    private Long slotId;

    private String vehicleNumber;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

}