package com.ssaenggojip.property.dto.request;
import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.FacilityType;
import com.ssaenggojip.common.enums.PropertyType;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SearchRequest {

    String search = "";
    List<PropertyType> propertyTypes = new ArrayList<>();
    DealType dealType = null;
    Long minPrice = 0L;
    Long maxPrice = Long.MAX_VALUE;
    Long minRentPrice = 0L;
    Long maxRentPrice = Long.MAX_VALUE;
    List<FacilityType> facilityTypes = new ArrayList<>();
}
