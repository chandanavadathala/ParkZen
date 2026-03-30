package com.parkzen.Parkzen_stress_free_parking_experience.serviceImpl;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.BookingRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Slot;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.User;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.BookingStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.PaymentStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.BookingRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.SlotRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.UserRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Override
    public Booking createBooking(BookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getStatus().name().equals("AVAILABLE")) {
            throw new RuntimeException("Slot not available");
        }

        Booking booking = Booking.builder()
                .vehicleNumber(request.getVehicleNumber())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .bookingStatus(BookingStatus.ACTIVE)
                .paymentStatus(PaymentStatus.PENDING)
                .user(user)
                .slot(slot)
                .build();

        slot.setStatus(SlotStatus.BOOKED);

        slotRepository.save(slot);

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {

        return bookingRepository.findByUserId(userId);
    }
}