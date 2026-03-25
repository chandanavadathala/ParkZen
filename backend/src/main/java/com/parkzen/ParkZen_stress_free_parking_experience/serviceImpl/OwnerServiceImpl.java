package com.parkzen.Parkzen_stress_free_parking_experience.serviceImpl;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.AddSlotRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.OwnerSlotDashboardResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.UpdateSlotStatusRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Parking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Slot;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.enums.SlotStatus;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.BookingRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.ParkingRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.PaymentRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.repository.SlotRepository;
import com.parkzen.Parkzen_stress_free_parking_experience.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerServiceImpl implements OwnerService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    @Override
    public Slot addSlot(AddSlotRequest request) {

        Parking parking = parkingRepository.findById(request.getParkingId())
                .orElseThrow(() -> new RuntimeException("Parking not found"));

        Slot slot = Slot.builder()
                .slotNumber(request.getSlotNumber())
                .vehicleSize(request.getVehicleSize())
                .slotType(request.getSlotType())
                .ratePerHour(request.getRatePerHour())
                .status(SlotStatus.AVAILABLE)
                .parking(parking)
                .build();

        return slotRepository.save(slot);
    }

    @Override
    public List<Slot> getSlotsByParking(Long parkingId) {

        return slotRepository.findByParkingId(parkingId);
    }

    @Override
    public Slot updateSlotStatus(UpdateSlotStatusRequest request) {

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setStatus(request.getStatus());

        return slotRepository.save(slot);
    }

    @Override
    public List<OwnerSlotDashboardResponse> getDashboardSlots(Long parkingId) {

        List<Slot> slots = slotRepository.findByParkingId(parkingId);

        return slots.stream().map(slot -> OwnerSlotDashboardResponse.builder()
                .slotId(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .vehicleSize(slot.getVehicleSize())
                .slotType(slot.getSlotType())
                .ratePerHour(slot.getRatePerHour())
                .status(slot.getStatus())
                .build()
        ).toList();
    }

    @Override
    public double getOccupancyRate(Long parkingId) {

        List<Slot> slots = slotRepository.findByParkingId(parkingId);

        long occupied = slots.stream()
                .filter(s -> s.getStatus().name().equals("OCCUPIED"))
                .count();

        if(slots.isEmpty()) return 0;

        return (occupied * 100.0) / slots.size();
    }

    @Override
    public List<Booking> getOwnerBookings(Long parkingId) {

        return bookingRepository.findBySlotParkingId(parkingId);
    }

    @Override
    public List<Payment> getOwnerPayments(Long parkingId) {

        return paymentRepository.findByBookingSlotParkingId(parkingId);
    }

    @Override
    public Double getOwnerRevenue(Long parkingId) {

        List<Payment> payments = paymentRepository.findByBookingSlotParkingId(parkingId);

        double total = 0;

        for (Payment payment : payments) {
            total += payment.getAmount();
        }

        return total;
    }
}