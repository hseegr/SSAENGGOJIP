package com.ssaenggojip.recommend.controller;

import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.recommend.dto.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.service.RecommendService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recommends")
public class RecommendController {
    private final RecommendService recommendService;

    @GetMapping("/facility-preferences")
    public ApiResponse<FacilityPreferencesResponse> getFacilityPreferences(@AuthUser User user) {
        return ApiResponse.onSuccess(recommendService.getPreferences(user));
    }

    @PatchMapping("/facility-preferences")
    public ApiResponse<Void> updateFacilityPreferences(
            UpdateFacilityPreferencesRequest request,
            @AuthUser User user
    ) {
        recommendService.updatePreferences(request, user);
        return ApiResponse.onSuccess(null);
    }
}
