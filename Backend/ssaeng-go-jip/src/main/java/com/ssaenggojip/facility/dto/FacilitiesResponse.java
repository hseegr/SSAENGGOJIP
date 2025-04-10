package com.ssaenggojip.facility.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FacilitiesResponse {
    private String facilityTypeName;
    private Integer facilityCount;
    private List<FacilityLocationResponse> locations;

    public void count() {
        this.facilityCount++;
    }
}
