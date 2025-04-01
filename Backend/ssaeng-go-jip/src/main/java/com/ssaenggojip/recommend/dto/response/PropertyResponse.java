package com.ssaenggojip.recommend.dto.response;

import com.ssaenggojip.property.entity.Property;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PropertyResponse {
    private Long id;
    private String name;
    private int price;
    private double area;
    private String address;
    private int floor;
    private double latitude;
    private double longitude;

    public static PropertyResponse from(Property p) {
        return PropertyResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .area(p.getArea())
                .address(p.getAddress())
                .floor(p.getFloor())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .build();
    }
}
