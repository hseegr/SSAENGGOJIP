package com.ssaenggojip.recommend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RecommendPropertyListResponse {
    private int total;
    private List<PropertyResponse> properties;
}
