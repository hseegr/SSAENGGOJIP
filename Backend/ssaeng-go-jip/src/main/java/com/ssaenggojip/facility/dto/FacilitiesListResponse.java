package com.ssaenggojip.facility.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FacilitiesListResponse {
    private List<FacilitiesResponse> facilitiesList;
}
