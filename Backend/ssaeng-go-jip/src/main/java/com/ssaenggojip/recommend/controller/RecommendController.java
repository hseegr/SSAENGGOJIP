package com.ssaenggojip.recommend.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.recommend.dto.request.RecommendByPreferencesRequest;
import com.ssaenggojip.recommend.dto.response.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.request.RecommendByLocationRequest;
import com.ssaenggojip.recommend.dto.request.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.dto.response.RecommendPropertyListResponse;
import com.ssaenggojip.recommend.service.RecommendService;
import com.ssaenggojip.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recommends")
public class RecommendController {
    private final RecommendService recommendService;

    @GetMapping("/facility-preferences")
    public ApiResponse<FacilityPreferencesResponse> getFacilityPreferences(
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(recommendService.getPreferences(user));
    }

    @PatchMapping("/facility-preferences")
    public ApiResponse<Void> updateFacilityPreferences(
            @RequestBody @Valid UpdateFacilityPreferencesRequest request,
            @AuthUser User user
    ) {
        recommendService.updatePreferences(request, user);
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/by-preferences")
    public ApiResponse<RecommendPropertyListResponse> recommendByPreferences(
            @RequestBody @Valid RecommendByPreferencesRequest request,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(recommendService.findTopKByPreferences(user, request));
    }

    @PostMapping("/by-locations")
    public ApiResponse<RecommendPropertyListResponse> recommendByLocation(
            @RequestBody @Valid RecommendByLocationRequest request
    ) {
        return ApiResponse.onSuccess(recommendService.findByLocation(request));
    }

}
