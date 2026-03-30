package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApiResponse<T> {

    private int status;

    private String message;

    private T data;
}