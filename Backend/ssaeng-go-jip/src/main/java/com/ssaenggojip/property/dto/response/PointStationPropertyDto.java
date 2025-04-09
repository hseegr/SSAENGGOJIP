package com.ssaenggojip.property.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PointStationPropertyDto {
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
    Double stationALatitude;
    Double stationALongitude;
    Double stationBLatitude;
    Double stationBLongitude;

}
