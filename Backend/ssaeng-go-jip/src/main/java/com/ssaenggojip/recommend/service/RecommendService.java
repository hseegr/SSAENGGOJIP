package com.ssaenggojip.recommend.service;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.request.RecommendByLocationRequest;
import com.ssaenggojip.recommend.dto.response.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.request.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.dto.response.RecommendPropertyListResponse;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

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

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findTopKByPreferences(User user, int k) {
        String preferences = Arrays.toString(user.getFacilityPreferences().toArray());
        List<Property> properties = propertyRepository.findTopKByFacilityNearness(preferences, k);
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findByLocation(RecommendByLocationRequest request) {
        Double latitude = request.getLatitude();
        Double longitude = request.getLongitude();
        Double radius = request.getRadius();
        List<Property> properties = propertyRepository.findByFacilityNearness(longitude, latitude, radius);
        return RecommendPropertyListResponse.from(properties);
    }

}
