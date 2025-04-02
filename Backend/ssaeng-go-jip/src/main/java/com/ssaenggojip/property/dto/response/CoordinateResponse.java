package com.ssaenggojip.property.dto.response;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import lombok.*;

@Data
@NoArgsConstructor
public class CoordinateResponse {
    private Long propertyId;
    private Double longitude;
    private Double latitude;
    private PropertyType propertyType;
    private DealType dealType;
    private Long price;
    private Long rentPrice;
    private Long maintenancePrice;
    private String floor;
    private Integer totalFloor;
    private Double area;
    private String imageUrl;

    //JPA Projection
    public CoordinateResponse(Long propertyId, Double longitude, Double latitude,
                              PropertyType propertyType, DealType dealType, Long price,
                              Long rentPrice, Long maintenancePrice, String floor,
                              String totalFloor, Double area, String imageUrl) {
        this.propertyId = propertyId;
        this.longitude = longitude;
        this.latitude = latitude;
        this.propertyType = propertyType;
        this.dealType = dealType;
        this.price = price;
        this.rentPrice = rentPrice;
        this.maintenancePrice = maintenancePrice;
        this.floor = floor;
        this.totalFloor = Integer.valueOf(totalFloor);;
        this.area = area;
        this.imageUrl = imageUrl;
    }
}
