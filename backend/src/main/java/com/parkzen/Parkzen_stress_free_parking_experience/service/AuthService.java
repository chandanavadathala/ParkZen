package com.parkzen.Parkzen_stress_free_parking_experience.service;


import com.parkzen.Parkzen_stress_free_parking_experience.dto.LoginRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.LoginResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterOwnerRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterUserRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.User;

public interface AuthService {

    User registerUser(RegisterUserRequest request);

    User registerOwner(RegisterOwnerRequest request);

    LoginResponse login(LoginRequest request);

}