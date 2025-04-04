package com.ssaenggojip.recommend.dto.response;

import com.ssaenggojip.property.entity.Property;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class RecommendPropertyListResponse {
    private int total;
    private List<PropertyResponse> properties;

    public static RecommendPropertyListResponse from(List<Property> properties) {
        List<PropertyResponse> responses = new ArrayList<>();
        for (Property property : properties) {
            responses.add(PropertyResponse.from(property));
        }
        return RecommendPropertyListResponse.builder()
                .total(properties.size())
                .properties(responses)
                .build();
    }
}
