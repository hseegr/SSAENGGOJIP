package com.ssaenggojip.recommend.service;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public void findTopKByPreferences(User user, int k) {
        String preferences = user.getFacilityPreferences().toString();
        List<Property> properties = propertyRepository.findTopKByFacilityNearness(preferences, k);
        for (Property property : properties) {
            System.out.println(property.toString());
        }
    }

}
