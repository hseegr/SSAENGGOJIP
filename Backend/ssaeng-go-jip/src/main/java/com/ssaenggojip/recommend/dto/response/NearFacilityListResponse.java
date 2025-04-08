package com.ssaenggojip.recommend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NearFacilityListResponse {
    private Long propertyId;
    private List<NearFacilityResponse> facilities;
}
