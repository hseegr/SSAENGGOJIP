package com.ssaenggojip.property.converter;

import com.ssaenggojip.property.dto.response.SearchProperty;
import com.ssaenggojip.property.entity.Property;

public class PropertyConverter {

    public static SearchProperty mapToDto(Property p, Boolean isLiked, Boolean isRecommend) {
        return SearchProperty.builder()
                .id(p.getId())
                .dealType(p.getDealType())
                .price(p.getPrice())
                .rentPrice(p.getRentPrice())
                .totalFloor(p.getTotalFloor())
                .floor(p.getFloor())
                .area(p.getExclusiveArea())
                .address(p.getAddress())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .maintenancePrice(p.getMaintenancePrice())
                .isInterest(isLiked)     // TODO:관심 매물 여부: 추후 구현
                .isRecommend(isRecommend)    // TODO:추천 여부: 추후 구현
                .imageUrl(p.getMainImage())
                .build();
    }
}
