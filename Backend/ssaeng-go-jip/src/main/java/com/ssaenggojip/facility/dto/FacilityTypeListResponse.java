package com.ssaenggojip.facility.dto;

import com.ssaenggojip.facilitytype.entity.FacilityType;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class FacilityTypeListResponse {
    private List<String> facilityTypeList;

    public static FacilityTypeListResponse from(List<FacilityType> facilityTypeList) {
        List<String> facilityTypesString = new ArrayList<>();
        for (FacilityType facilityType : facilityTypeList) {
            facilityTypesString.add(facilityType.getName());
        }
        return FacilityTypeListResponse.builder()
                .facilityTypeList(facilityTypesString)
                .build();
    }
}
