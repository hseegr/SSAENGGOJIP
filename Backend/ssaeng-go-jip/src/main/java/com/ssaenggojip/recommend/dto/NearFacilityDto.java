package com.ssaenggojip.recommend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NearFacilityDto {
    private Long id;
    private Long facilityTypeId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double distance;
}
