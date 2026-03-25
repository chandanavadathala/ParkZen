package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserRequest {

    private String fullName;

    private String vehicleNumber;

    private String mobile;

    private String email;

    private String password;

}