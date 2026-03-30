package com.parkzen.Parkzen_stress_free_parking_experience.serviceImpl;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.PaymentRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.PaymentStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.BookingRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.PaymentRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Payment makePayment(PaymentRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.SUCCESS)
                .booking(booking)
                .build();

        booking.setPaymentStatus(PaymentStatus.SUCCESS);

        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getUserPayments(Long userId) {

        return paymentRepository.findByBookingUserId(userId);
    }
}