package com.ssaenggojip.facility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearFacilityResponse {
    private Long id;
    private Long facilityTypeId;
    private Long facilityTypeName;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double distance;
}
