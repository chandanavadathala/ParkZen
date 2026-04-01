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

        // 1. Fetch User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Fetch Slot
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 3. Check Slot Availability (BEST PRACTICE ✅)
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot not available");
        }

        // 4. Validate Time
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Invalid time range");
        }

        // 5. Create Booking
        Booking booking = Booking.builder()
                .vehicleNumber(request.getVehicleNumber())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .bookingStatus(BookingStatus.ACTIVE)
                .paymentStatus(PaymentStatus.PENDING)
                .user(user)
                .slot(slot)
                .build();

        // 6. Update Slot Status
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // 7. Save Booking
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {

        // Optional improvement (safe check)
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserId(userId);
    }
}