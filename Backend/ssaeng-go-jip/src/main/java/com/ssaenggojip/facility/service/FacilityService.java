package com.ssaenggojip.facility.service;

import com.ssaenggojip.facility.dto.FacilitiesListResponse;
import com.ssaenggojip.facility.dto.FacilitiesResponse;
import com.ssaenggojip.facility.dto.FacilityTypeListResponse;
import com.ssaenggojip.facility.dto.FacilityLocationResponse;
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
    public FacilitiesListResponse findNearbyFacilities(Double latitude, Double longitude) {
        List<String> facilityTypes = this.getAllFacilityTypes().getFacilityTypeList();
        List<FacilitiesResponse> facilitiesResponseList = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            String facilityType = facilityTypes.get(i);
            List<FacilityLocationResponse> locations = new ArrayList<>();
            facilitiesResponseList.add(FacilitiesResponse.builder()
                    .facilityTypeName(facilityType)
                    .facilityCount(0)
                    .locations(locations)
                    .build());
        }

        List<FacilityLocationResponse> facilityLocations = facilityRepository.findNearFacilities(latitude, longitude);
        for (FacilityLocationResponse facilityLocation : facilityLocations) {
            int idx = (int) (facilityLocation.getFacilityTypeId() - 1L);
            facilitiesResponseList.get(idx).getLocations().add(facilityLocation);
            facilitiesResponseList.get(idx).count();
        }

        return FacilitiesListResponse.builder()
                .facilitiesList(facilitiesResponseList)
                .build();
    }
}
