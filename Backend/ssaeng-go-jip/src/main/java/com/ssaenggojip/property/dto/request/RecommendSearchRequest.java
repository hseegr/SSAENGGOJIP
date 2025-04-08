package com.ssaenggojip.property.dto.request;
import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.FacilityType;
import com.ssaenggojip.common.enums.PropertyType;
import com.ssaenggojip.common.enums.TransportationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecommendSearchRequest {
    @NotNull
    private List<SearchSet> addresses;
    private List<PropertyType> propertyType = new ArrayList<>();
    private DealType dealType = null;
    private Long minPrice = 0L;
    private Long maxPrice = Long.MAX_VALUE;
    private Long minRentPrice = 0L;
    private Long maxRentPrice = Long.MAX_VALUE;
    private List<FacilityType> facility = new ArrayList<>();

    @Data
    public static class SearchSet {
        private Double latitude;
        private Double longitude;
        private TransportationType transportationType;
        private Integer totalTransportTime;
        private Integer walkTime;
    }
}
