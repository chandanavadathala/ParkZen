package com.parkzen.Parkzen_stress_free_parking_experience.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String emailOrMobile;

    private String password;

}
