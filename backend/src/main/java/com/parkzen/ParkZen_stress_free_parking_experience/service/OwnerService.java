package com.parkzen.Parkzen_stress_free_parking_experience.service;

import com.parkzen.Parkzen_stress_free_parking_experience.dto.AddSlotRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.OwnerSlotDashboardResponse;
import com.parkzen.Parkzen_stress_free_parking_experience.dto.UpdateSlotStatusRequest;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Booking;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Payment;
import com.parkzen.Parkzen_stress_free_parking_experience.entity.Slot;

import java.util.List;

public interface OwnerService {

    Slot addSlot(AddSlotRequest request);

    List<Slot> getSlotsByParking(Long parkingId);

    Slot updateSlotStatus(UpdateSlotStatusRequest request);

    List<OwnerSlotDashboardResponse> getDashboardSlots(Long parkingId);

    double getOccupancyRate(Long parkingId);

    List<Booking> getOwnerBookings(Long parkingId);

    List<Payment> getOwnerPayments(Long parkingId);

    Double getOwnerRevenue(Long parkingId);

}