package com.ssaenggojip.facility.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacilityLocationResponse {
    private Long facilityTypeId;
    private Double latitude;
    private Double longitude;
}
