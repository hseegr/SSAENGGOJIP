package com.ssaenggojip.property.dto.request;


import com.ssaenggojip.common.enums.TransportationType;
import lombok.Data;

import java.util.List;


@Data
public class RecommendDetailRequest {
    private Long propertyId;
    private List<Search> addresses;

    @Data
    public static class Search{
        private Double latitude;
        private Double longitude;
        private TransportationType transportationType;
//        private Integer totalTransportTime;
//        private Integer walkTime;
    }


}
