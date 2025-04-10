package com.ssaenggojip.recommend.dto.response;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import com.ssaenggojip.property.entity.Property;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PropertyResponse {
    private Long id;
    private String name;
    private Long price;
    private Double area;
    private String address;
    private String floor;
    private Double latitude;
    private Double longitude;
    private String mainImage;
    private DealType dealType;
    private PropertyType propertyType;

    public static PropertyResponse from(Property p) {
        return PropertyResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getDealType() == DealType.월세 ? p.getRentPrice() : p.getPrice())
                .area(p.getExclusiveArea())
                .address(p.getAddress())
                .floor(p.getFloor())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .mainImage(p.getMainImage())
                .dealType(p.getDealType())
                .propertyType(p.getPropertyType())
                .build();
    }
}
