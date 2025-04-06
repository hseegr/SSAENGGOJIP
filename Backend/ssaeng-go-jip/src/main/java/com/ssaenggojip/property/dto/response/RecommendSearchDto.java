package com.ssaenggojip.property.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RecommendSearchDto {
    Long id;
    Boolean isRecommend = false;
    String dealType;
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
    Integer totalTime;
    //List<Integer> transportTimes;
    //LocalDateTime createdAt;

}
