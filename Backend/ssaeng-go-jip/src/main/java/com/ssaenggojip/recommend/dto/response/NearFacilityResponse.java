package com.ssaenggojip.recommend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NearFacilityResponse {
    private Long id;
    private Long facilityTypeId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double distance;
}
