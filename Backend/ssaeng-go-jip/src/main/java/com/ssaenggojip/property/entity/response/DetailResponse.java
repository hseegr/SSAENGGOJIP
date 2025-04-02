package com.ssaenggojip.property.entity.response;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Builder
@Data
public class DetailResponse {
    private Long id;
    private String name;
    private PropertyType propertyType; // 원룸, etc.
    private DealType dealType;     // 월세, etc.
    private Long price;       // 월세 or 전세/매매 금액
    private Long rentPrice;   // 월세 금액
    private Long maintenancePrice;
    private String totalFloor;
    private String floor;
    private Double area;
    private String address;

    private List<DetailStation> stations;

    private List<DetailFacility> facilities;

    private List<String> imageUrls;
}
