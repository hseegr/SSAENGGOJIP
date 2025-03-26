package com.ssaenggojip.recommend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FacilityPreferencesResponse {
    private float[] facilityPreferences;
}
