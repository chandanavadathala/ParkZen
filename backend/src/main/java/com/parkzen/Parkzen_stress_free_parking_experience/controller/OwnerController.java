package com.parkzen.Parkzen_stress_free_parking_experience.controller;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.AddSlotRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.ApiResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.OwnerSlotDashboardResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.UpdateSlotStatusRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Slot;
import com.parkzen.Parkzen_stress_free_parking_experience.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;


    @PostMapping("/add-slot")
    public ResponseEntity<ApiResponse<Slot>> addSlot(@RequestBody AddSlotRequest request) {

        Slot slot = ownerService.addSlot(request);

        ApiResponse<Slot> response = ApiResponse.<Slot>builder()
                .status(200)
                .message("Slot added successfully")
                .data(slot)
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/slots/{parkingId}")
    public List<Slot> getSlots(@PathVariable Long parkingId) {

        return ownerService.getSlotsByParking(parkingId);
    }


    @PutMapping("/update-slot-status")
    public Slot updateSlotStatus(@RequestBody UpdateSlotStatusRequest request) {

        return ownerService.updateSlotStatus(request);
    }

    @GetMapping("/dashboard/{parkingId}")
    public List<OwnerSlotDashboardResponse> getDashboard(@PathVariable("parkingId") Long parkingId) {

        return ownerService.getDashboardSlots(parkingId);
    }

    @GetMapping("/occupancy/{parkingId}")
    public double getOccupancy(@PathVariable Long parkingId) {

        return ownerService.getOccupancyRate(parkingId);
    }

    @GetMapping("/bookings/{parkingId}")
    public List<Booking> getOwnerBookings(@PathVariable("parkingId") Long parkingId) {

        return ownerService.getOwnerBookings(parkingId);
    }

    @GetMapping("/payments/{parkingId}")
    public List<Payment> getOwnerPayments(@PathVariable("parkingId") Long parkingId)  {

        return ownerService.getOwnerPayments(parkingId);
    }

    @GetMapping("/revenue/{parkingId}")
    public Double getRevenue(@PathVariable Long parkingId) {

        return ownerService.getOwnerRevenue(parkingId);
    }
}