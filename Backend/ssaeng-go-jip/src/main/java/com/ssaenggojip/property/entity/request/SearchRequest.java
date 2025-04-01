package com.ssaenggojip.property.entity.request;
import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.FacilityType;
import com.ssaenggojip.common.enums.PropertyType;
import lombok.Data;

import java.util.List;

@Data
public class SearchRequest {
    String search;
    List<PropertyType> propertyTypes;
    DealType dealType;
    Long minPrice;
    Long maxPrice;
    Long minRentPrice;
    Long maxRentPrice;
    List<FacilityType> facilityTypes;
}
