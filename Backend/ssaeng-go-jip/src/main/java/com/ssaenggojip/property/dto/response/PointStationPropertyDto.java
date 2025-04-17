package com.ssaenggojip.property.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PointStationPropertyDto {
    Long id;
    Boolean isRecommend = false;
    String dealType;
    String propertyType;
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
    Long stationAId;
    Double stationALatitude;
    Double stationALongitude;
    Long stationBId;
    Double stationBLatitude;
    Double stationBLongitude;

}
