package com.ssaenggojip.recommend.service;

import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.request.RecommendByPreferencesRequest;
import com.ssaenggojip.facility.entity.NearFacilityListResponse;
import com.ssaenggojip.facility.entity.NearFacilityResponse;
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

    @Transactional
    public void updateFacilityNearness(Long propertyId) {
        Property property = propertyRepository.getReferenceById(propertyId);
        List<NearFacilityResponse> nearFacilities = findNearestFacilities(property).getFacilities();
        List<Double> facilityNearness = Arrays.asList(0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d);
        for (NearFacilityResponse dto : nearFacilities) {
            Double distance = dto.getDistance();
            Double nearness = (1200d - Math.min(distance, 1200d)) / 1200d;
            facilityNearness.set((int) (dto.getFacilityTypeId() - 1), nearness);
        }
        property.setFacilityNearness(facilityNearness);
        propertyRepository.save(property);
    }

    @Transactional
    public NearFacilityListResponse findNearestFacilities(Property property) {
        return NearFacilityListResponse.builder()
                .propertyId(property.getId())
                .facilities(facilityRepository.findNearFacilities(
                        property.getLatitude(),
                        property.getLongitude()))
                .build();
    }

}
