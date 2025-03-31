package com.ssaenggojip.recommend.controller;

import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.recommend.dto.response.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.request.RecommendByLocationRequest;
import com.ssaenggojip.recommend.dto.request.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.dto.response.RecommendPropertyListResponse;
import com.ssaenggojip.recommend.service.RecommendService;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
            @RequestBody @Valid UpdateFacilityPreferencesRequest request,
            @AuthUser User user
    ) {
        recommendService.updatePreferences(request, user);
        return ApiResponse.onSuccess(null);
    }

    private final UserRepository userRepository;
    @GetMapping("/test")
    public ApiResponse<Void> test() {
        List<Double> vec1 = new ArrayList<>();
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        vec1.add(0.1);
        List<Double> vec2 = new ArrayList<>();
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);
        vec2.add(0.2);

        User user = User.builder()
                .nickname("test")
                .email("test@example.com")
                .emailVerified(true)
                .socialLoginId("test")
                .socialLoginType(SocialLoginType.GOOGLE)
                .build();
        user.setFacilityPreferences(vec1);
        userRepository.save(user);
        System.out.println(recommendService.getPreferences(user).toString());
        user.setFacilityPreferences(vec2);
        userRepository.save(user);
        System.out.println(recommendService.getPreferences(user).toString());
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("/topk")
    public ApiResponse<Void> topk() {
        User user = userRepository.getReferenceById(1L);
        recommendService.findTopKByPreferences(user, 10);
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("/locations")
    public ApiResponse<RecommendPropertyListResponse> recommendByLocation(
            @RequestBody @Valid RecommendByLocationRequest request
    ) {
        return ApiResponse.onSuccess(recommendService.findByLocation(request));
    }

}
