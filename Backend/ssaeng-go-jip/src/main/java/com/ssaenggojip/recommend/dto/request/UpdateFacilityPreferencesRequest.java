package com.ssaenggojip.recommend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class UpdateFacilityPreferencesRequest {
    @NotNull
    private List<Double> facilityPreferences;
}
