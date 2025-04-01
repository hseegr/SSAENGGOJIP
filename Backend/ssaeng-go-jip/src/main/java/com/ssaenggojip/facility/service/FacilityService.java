package com.ssaenggojip.facility.service;

import com.ssaenggojip.facility.dto.FacilityTypeListResponse;
import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facilitytype.entity.FacilityType;
import com.ssaenggojip.facilitytype.repository.FacilityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FacilityService {
    private final FacilityRepository facilityRepository;
    private final FacilityTypeRepository facilityTypeRepository;

    @Transactional(readOnly = true)
    public FacilityTypeListResponse getAllFacilityTypes() {
        List<FacilityType> facilityTypeList = facilityTypeRepository.findAll();
        return FacilityTypeListResponse.from(facilityTypeList);
    }
}
