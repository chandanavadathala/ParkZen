package com.parkzen.Parkzen_stress_free_parking_experience.controller;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.LoginRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterOwnerRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterUserRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.User;
import com.parkzen.Parkzen_stress_free_parking_experience.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    // Register User
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request) {

        User user = authService.registerUser(request);

        return ResponseEntity.ok(user);
    }


    // Register Owner
    @PostMapping("/register/owner")
    public ResponseEntity<?> registerOwner(@RequestBody RegisterOwnerRequest request) {

        User owner = authService.registerOwner(request);

        return ResponseEntity.ok(owner);
    }


    // Login (User / Owner / Admin)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = authService.login(request);

        return ResponseEntity.ok(user);
    }

}
