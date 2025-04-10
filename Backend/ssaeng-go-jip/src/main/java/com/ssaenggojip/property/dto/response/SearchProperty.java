package com.ssaenggojip.property.dto.response;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class SearchProperty {
    Long id;
    Boolean isRecommend;
    PropertyType propertyType;
    DealType dealType;
    Long price;
    Long rentPrice;
    Long maintenancePrice;
    String totalFloor;
    String floor;
    Double area;
    String address;
    Double latitude;
    Double longitude;
    Boolean isInterest;
    String imageUrl;
    LocalDateTime createdAt;
}
