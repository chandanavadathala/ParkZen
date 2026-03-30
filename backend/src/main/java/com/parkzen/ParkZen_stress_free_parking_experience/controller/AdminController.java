package com.parkzen.Parkzen_stress_free_parking_experience.controller;


import com.parkzen.Parkzen_stress_free_parking_experience.entity.User;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;


    // View all users
    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

}