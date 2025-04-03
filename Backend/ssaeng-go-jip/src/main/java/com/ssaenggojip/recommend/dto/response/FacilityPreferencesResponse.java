package com.ssaenggojip.recommend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class FacilityPreferencesResponse {
    private List<String> facilityTypeList;
    private List<Double> facilityPreferences;

    public static FacilityPreferencesResponse from(
            List<String> facilityTypeList,
            List<Double> facilityPreferences
    ) {
        return FacilityPreferencesResponse.builder()
                .facilityTypeList(facilityTypeList)
                .facilityPreferences(facilityPreferences)
                .build();
    }
}
