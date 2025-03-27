package com.ssaenggojip.recommend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class FacilityPreferencesResponse {
    private float[] facilityPreferences;
}
