package com.ssaenggojip.recommend.service;

import com.ssaenggojip.recommend.dto.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public FacilityPreferencesResponse getPreferences(User user) {
        return FacilityPreferencesResponse.builder()
                .facilityPreferences(user.getFacilityPreferences())
                .build();
    }

    @Transactional
    public void updatePreferences(UpdateFacilityPreferencesRequest request, User user) {
        user.setFacilityPreferences(request.getFacilityPreferences());
        userRepository.save(user);
    }
}
