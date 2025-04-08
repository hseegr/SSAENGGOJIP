package com.ssaenggojip.facility.entity;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NearFacilityListResponse {
    private Long propertyId;
    private List<NearFacilityResponse> facilities;
}
