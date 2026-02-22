package com.parkzen.ParkZen_stress_free_parking_experience.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.User;
import com.parkzen.ParkZen_stress_free_parking_experience.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER USER
    public User register(User user) {

        // check duplicate email
        User existingEmail = repo.findByEmail(user.getEmail()).orElse(null);
        if (existingEmail != null) {
            throw new RuntimeException("Email already registered");
        }

        // check duplicate mobile
        User existingMobile = repo.findByMobile(user.getMobile()).orElse(null);
        if (existingMobile != null) {
            throw new RuntimeException("Mobile already registered");
        }

        // encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repo.save(user);
    }


    // ✅ LOGIN USER (Email OR Mobile)
    public User login(String loginInput, String password) {

        User user = null;

        // check if input is email or mobile
        if (loginInput.contains("@")) {
            user = repo.findByEmail(loginInput).orElse(null);
        } else {
            user = repo.findByMobile(loginInput).orElse(null);
        }

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // match encrypted password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}