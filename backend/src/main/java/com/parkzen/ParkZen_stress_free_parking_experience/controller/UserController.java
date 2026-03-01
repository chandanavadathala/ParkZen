package com.parkzen.ParkZen_stress_free_parking_experience.controller;



import com.parkzen.ParkZen_stress_free_parking_experience.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.User;
import com.parkzen.ParkZen_stress_free_parking_experience.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.User;
import com.parkzen.ParkZen_stress_free_parking_experience.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {
            User savedUser = service.register(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = service.login(request.getLogin(), request.getPassword());
            return new ResponseEntity<>(user, HttpStatus.OK);

        } catch (RuntimeException e) {

            if (e.getMessage().equals("User not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}


