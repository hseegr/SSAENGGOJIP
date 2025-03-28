package com.ssaenggojip.recommend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class UpdateFacilityPreferencesRequest {
    @NotNull
    private List<Double> facilityPreferences;
}
