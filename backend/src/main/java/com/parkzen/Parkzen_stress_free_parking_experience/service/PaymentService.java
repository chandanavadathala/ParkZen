package com.parkzen.Parkzen_stress_free_parking_experience.service;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.PaymentRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;

import java.util.List;

public interface PaymentService {

    Payment makePayment(PaymentRequest request);

    List<Payment> getUserPayments(Long userId);

}