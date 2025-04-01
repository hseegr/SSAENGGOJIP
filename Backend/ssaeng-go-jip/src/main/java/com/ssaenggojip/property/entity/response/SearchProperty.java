package com.ssaenggojip.property.entity.response;

import com.ssaenggojip.common.enums.DealType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SearchProperty {
    Long id;
    Boolean isRecommend;
    DealType dealType;
    Integer price;
    Integer rentPrice;
    String totalFloor;
    String floor;
    Double area;
    String address;
    Double latitude;
    Double longitude;
    Boolean isInterest;
    String imageUrl;
    LocalDateTime createdAt;
    Integer maintenancePrice;
}
