package com.parkzen.ParkZen_stress_free_parking_experience.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.parkzen.ParkZen_stress_free_parking_experience.dto.LoginRequest;
import com.parkzen.ParkZen_stress_free_parking_experience.entity.Admin;
import com.parkzen.ParkZen_stress_free_parking_experience.service.AdminService;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService service;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        try {
            Admin saved = service.register(admin);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Admin admin = service.login(request.getLogin(), request.getPassword());
            return new ResponseEntity<>(admin, HttpStatus.OK);

        } catch (RuntimeException e) {

            if (e.getMessage().equals("Admin not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}