package com.parkzen.ParkZen_stress_free_parking_experience.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.parkzen.ParkZen_stress_free_parking_experience.entity.Admin;
import com.parkzen.ParkZen_stress_free_parking_experience.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER ADMIN
    public Admin register(Admin admin) {

        Admin existingEmail = repo.findByEmail(admin.getEmail()).orElse(null);
        if (existingEmail != null) {
            throw new RuntimeException("Email already registered");
        }

        Admin existingMobile = repo.findByMobile(admin.getMobile()).orElse(null);
        if (existingMobile != null) {
            throw new RuntimeException("Mobile already registered");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        return repo.save(admin);
    }

    // LOGIN ADMIN
    public Admin login(String loginInput, String password) {

        Admin admin = null;

        if (loginInput.contains("@")) {
            admin = repo.findByEmail(loginInput).orElse(null);
        } else {
            admin = repo.findByMobile(loginInput).orElse(null);
        }

        if (admin == null) {
            throw new RuntimeException("Admin not found");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return admin;
    }
}
