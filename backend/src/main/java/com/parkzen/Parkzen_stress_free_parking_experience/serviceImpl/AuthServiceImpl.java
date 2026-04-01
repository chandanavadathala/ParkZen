package com.parkzen.Parkzen_stress_free_parking_experience.serviceImpl;


import com.parkzen.Parkzen_stress_free_parking_experience.config.JwtUtil;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.LoginRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.LoginResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterOwnerRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.RegisterUserRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Parking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.User;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.Role;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.ParkingRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.UserRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public User registerUser(RegisterUserRequest request) {


        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }


        User user = User.builder()
                .fullName(request.getFullName())
                .vehicleNumber(request.getVehicleNumber())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    @Override
    public User registerOwner(RegisterOwnerRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }


        User owner = User.builder()
                .fullName(request.getFullName())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.OWNER)
                .build();

        User savedOwner = userRepository.save(owner);

        Parking parking = Parking.builder()
                .parkingName(request.getParkingName())
                .parkingAddress(request.getParkingAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .owner(savedOwner)
                .build();

        parkingRepository.save(parking);

        return savedOwner;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmailOrMobile());

        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByMobile(request.getEmailOrMobile());
        }

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token);
    }
}