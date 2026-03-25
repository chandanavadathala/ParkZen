package com.parkzen.Parkzen_stress_free_parking_experience.controller;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.PaymentRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import com.parkzen.Parkzen_stress_free_parking_experience.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public Payment makePayment(@RequestBody PaymentRequest request) {

        return paymentService.makePayment(request);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getUserPayments(@PathVariable Long userId) {

        return paymentService.getUserPayments(userId);
    }
}