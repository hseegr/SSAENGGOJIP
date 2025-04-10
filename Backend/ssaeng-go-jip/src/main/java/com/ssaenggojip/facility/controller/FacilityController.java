package com.ssaenggojip.facility.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.facility.dto.FacilitiesListResponse;
import com.ssaenggojip.facility.dto.FacilityTypeListResponse;
import com.ssaenggojip.facility.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
public class FacilityController {
    private final FacilityService facilityService;

    @GetMapping("/types")
    public ApiResponse<FacilityTypeListResponse> facilityTypes() {
        return ApiResponse.onSuccess(facilityService.getAllFacilityTypes());
    }

    @GetMapping("/nearby")
    public ApiResponse<FacilitiesListResponse> nearbyFacilityTypes(
            @RequestParam("lat") Double lat,
            @RequestParam("lng") Double lng
    ) {
        return ApiResponse.onSuccess(facilityService.findNearbyFacilities(lat, lng));
    }
}
