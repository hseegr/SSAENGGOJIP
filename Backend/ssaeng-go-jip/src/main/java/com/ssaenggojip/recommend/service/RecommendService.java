package com.ssaenggojip.recommend.service;

import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.request.RecommendByPreferencesRequest;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final FacilityService facilityService;
    private final FacilityRepository facilityRepository;

    private static final Double DEFAULT_RADIUS = 2000d;

    @Transactional(readOnly = true)
    public FacilityPreferencesResponse getPreferences(User user) {
        return FacilityPreferencesResponse.from(
                facilityService.getAllFacilityTypes().getFacilityTypeList(),
                user.getFacilityPreferences());
    }

    @Transactional
    public void updatePreferences(UpdateFacilityPreferencesRequest request, User user) {
        user.setFacilityPreferences(request.getFacilityPreferences());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findByLocation(RecommendByLocationRequest request) {
        Double latitude = request.getLatitude();
        Double longitude = request.getLongitude();
        Double radius = request.getRadius();
        List<Property> properties = propertyRepository.findByLocation(longitude, latitude, radius);
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findTopKByPreferences(
            User user,
            RecommendByPreferencesRequest request
    ) {
        String preferences = Arrays.toString(user.getFacilityPreferences().toArray());
        List<Property> properties = propertyRepository.findTopKByVector(
                request.getLongitude(),
                request.getLatitude(),
                request.getRadius(),
                preferences,
                request.getK()
        );
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findTopKByProperty(Long propertyId, Integer k) {
        Property property = propertyRepository.getReferenceById(propertyId);
        String facilityNearness = Arrays.toString(property.getFacilityNearness().toArray());
        List<Property> properties = propertyRepository.findTopKByVector(
                property.getLongitude(),
                property.getLatitude(),
                DEFAULT_RADIUS,
                facilityNearness,
                k
        );
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public Set<Long> filterRecommendedIds(Set<Long> ids, User user) {
        String preferences = Arrays.toString(user.getFacilityPreferences().toArray());
        return propertyRepository.findIdsByIsRecommended(
                ids,
                preferences
        );
    }
}
