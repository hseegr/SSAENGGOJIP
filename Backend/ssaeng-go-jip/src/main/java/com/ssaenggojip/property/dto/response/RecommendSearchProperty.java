package com.ssaenggojip.property.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
public class RecommendSearchProperty {
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
    List<Integer> transportTimes;
    //LocalDateTime createdAt;

    public RecommendSearchProperty(RecommendSearchDto dto) {
        this.id = dto.getId();
        this.isRecommend = dto.getIsRecommend();
        this.dealType = dto.getDealType();
        this.price = dto.getPrice();
        this.rentPrice = dto.getRentPrice();
        this.maintenancePrice = dto.getMaintenancePrice();
        this.totalFloor = dto.getTotalFloor();
        this.floor = dto.getFloor();
        this.area = dto.getArea();
        this.address = dto.getAddress();
        this.latitude = dto.getLatitude();
        this.longitude = dto.getLongitude();
        this.isInterest = dto.getIsInterest();
        this.imageUrl = dto.getImageUrl();
        this.transportTimes = new ArrayList<>();
        this.transportTimes.add(dto.getTotalTime());
        this.propertyType = dto.getPropertyType();
    }
}
