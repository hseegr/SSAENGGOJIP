package com.ssaenggojip.facility.controller;

import com.ssaenggojip.facility.dto.FacilityListResponse;
import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.facility.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
public class FacilityController {
    private final FacilityService facilityService;
    @GetMapping("/types")
    public ApiResponse<FacilityListResponse> facilityTypes() {
        return null;
    }
}
