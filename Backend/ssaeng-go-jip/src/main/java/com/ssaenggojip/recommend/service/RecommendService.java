package com.ssaenggojip.recommend.service;

import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.NearFacilityDto;
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

    @Transactional
    public void updateFacilityNearness(Long propertyId) {
        Property property = propertyRepository.getReferenceById(propertyId);
        List<NearFacilityDto> nearFacilities = facilityRepository.findNearFacilities(
                property.getLatitude(),
                property.getLongitude()
        );
        List<Double> facilityNearness = Arrays.asList(0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d);
        for (NearFacilityDto dto : nearFacilities) {
            Double distance = dto.getDistance();
            Double nearness = (1200d - Math.min(distance, 1200d)) / 1200d;
            facilityNearness.set((int) (dto.getFacilityTypeId() - 1), nearness);
        }
        property.setFacilityNearness(facilityNearness);
        propertyRepository.save(property);
    }

}
