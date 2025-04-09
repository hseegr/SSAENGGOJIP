package com.ssaenggojip.facility.service;

import com.ssaenggojip.facility.dto.FacilityTypeListResponse;
import com.ssaenggojip.facility.dto.NearFacilityResponse;
import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facility.entity.FacilityType;
import com.ssaenggojip.facility.repository.FacilityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {
    private final FacilityRepository facilityRepository;
    private final FacilityTypeRepository facilityTypeRepository;

    @Transactional(readOnly = true)
    public FacilityTypeListResponse getAllFacilityTypes() {
        List<FacilityType> facilityTypeList = facilityTypeRepository.findAll();
        return FacilityTypeListResponse.from(facilityTypeList);
    }

    @Transactional
    public List<NearFacilityResponse> findNearestFacilities(Double latitude, Double longitude) {
        List<NearFacilityResponse> nearFacilities = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            nearFacilities.add(null);
        }
        for(NearFacilityResponse facility : facilityRepository.findNearFacilities(latitude, longitude)) {
            nearFacilities.set((int) (facility.getFacilityTypeId() - 1), facility);
        }
        return nearFacilities;
    }
}
