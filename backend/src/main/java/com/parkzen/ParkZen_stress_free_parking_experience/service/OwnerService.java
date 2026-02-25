package com.parkzen.ParkZen_stress_free_parking_experience.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.Owner;
import com.parkzen.ParkZen_stress_free_parking_experience.repository.OwnerRepository;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER OWNER
    public Owner register(Owner owner) {

        // check duplicate email
        Owner existingEmail = repo.findByEmail(owner.getEmail()).orElse(null);
        if (existingEmail != null) {
            throw new RuntimeException("Email already registered");
        }

        // check duplicate mobile
        Owner existingMobile = repo.findByMobile(owner.getMobile()).orElse(null);
        if (existingMobile != null) {
            throw new RuntimeException("Mobile already registered");
        }

        // encrypt password
        owner.setPassword(passwordEncoder.encode(owner.getPassword()));

        return repo.save(owner);
    }


    // ✅ LOGIN OWNER (Email OR Mobile)
    public Owner login(String loginInput, String password) {

        Owner owner = null;

        // check email or mobile
        if (loginInput.contains("@")) {
            owner = repo.findByEmail(loginInput).orElse(null);
        } else {
            owner = repo.findByMobile(loginInput).orElse(null);
        }

        if (owner == null) {
            throw new RuntimeException("Owner not found");
        }

        // verify password
        if (!passwordEncoder.matches(password, owner.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return owner;
    }
}