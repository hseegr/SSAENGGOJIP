package com.ssaenggojip.recommend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateFacilityPreferencesRequest {
    @NotNull
    private float[] facilityPreferences;
}
