package com.ssaenggojip.recommend.controller;

import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.recommend.dto.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.service.RecommendService;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            UpdateFacilityPreferencesRequest request,
            @AuthUser User user
    ) {
        recommendService.updatePreferences(request, user);
        return ApiResponse.onSuccess(null);
    }

    private final UserRepository userRepository;
    @GetMapping("/test")
    public ApiResponse<Void> test() {
        List<Double> test1 = new ArrayList<Double>();
        List<Double> test2 = new ArrayList<Double>();
        test1.add(0.1);
        test1.add(0.1);
        test1.add(0.1);
        test1.add(0.1);
        test1.add(0.1);
        test1.add(0.1);
        test2.add(0.2);
        test2.add(0.2);
        test2.add(0.2);
        test2.add(0.2);
        test2.add(0.2);
        test2.add(0.2);
        System.out.println(test1.toString());
        System.out.println(test2.toString());
        float[] test1f = new float[] {0.1f, 0.1f, 0.1f, 0.1f, 0.1f, 0.1f};
        float[] test2f = new float[] {0.2f, 0.2f, 0.2f, 0.2f, 0.2f, 0.2f};

        User user = User.builder()
                .nickname("test")
                .email("test@example.com")
                .socialLoginId("test")
                .socialLoginType(SocialLoginType.GOOGLE)
                .facilityPreferences(test1f)
                .build();
        userRepository.save(user);
        System.out.println(recommendService.getPreferences(user).toString());
        UpdateFacilityPreferencesRequest request = UpdateFacilityPreferencesRequest.builder()
                .facilityPreferences(test2f)
                .build();
        recommendService.updatePreferences(request, user);
        System.out.println(recommendService.getPreferences(user).toString());
        return ApiResponse.onSuccess(null);
    }

}
