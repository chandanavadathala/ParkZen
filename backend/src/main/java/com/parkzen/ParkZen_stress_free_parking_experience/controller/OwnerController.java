package com.parkzen.ParkZen_stress_free_parking_experience.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.parkzen.ParkZen_stress_free_parking_experience.dto.LoginRequest;
import com.parkzen.ParkZen_stress_free_parking_experience.entity.Owner;
import com.parkzen.ParkZen_stress_free_parking_experience.service.OwnerService;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "*")
public class OwnerController {

    @Autowired
    private OwnerService service;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Owner owner) {

        try {
            Owner savedOwner = service.register(owner);
            return new ResponseEntity<>(savedOwner, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            Owner owner = service.login(request.getLogin(), request.getPassword());
            return new ResponseEntity<>(owner, HttpStatus.OK);

        } catch (RuntimeException e) {

            if (e.getMessage().equals("Owner not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}