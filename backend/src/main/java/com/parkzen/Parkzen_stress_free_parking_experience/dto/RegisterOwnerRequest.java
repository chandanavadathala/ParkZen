package com.parkzen.Parkzen_stress_free_parking_experience.dto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterOwnerRequest {

    private String fullName;

    private String parkingName;

    private String parkingAddress;

    private Double latitude;

    private Double longitude;

    private String mobile;

    private String email;

    private String password;

}