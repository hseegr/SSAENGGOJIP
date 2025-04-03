package com.ssaenggojip.recommend.dto.response;

import com.ssaenggojip.property.entity.Property;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PropertyResponse {
    private Long id;
    private String name;
    private Long price;
    private double area;
    private String address;
    private String floor;
    private double latitude;
    private double longitude;

    public static PropertyResponse from(Property p) {
        return PropertyResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .area(p.getExclusiveArea())
                .address(p.getAddress())
                .floor(p.getFloor())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .build();
    }
}
