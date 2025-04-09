package com.ssaenggojip.property.dto.response;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.FacilityType;
import com.ssaenggojip.common.enums.PropertyType;
import com.ssaenggojip.station.entity.Station;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendDetailResponse {
    private Long id;
    private String name;
    private PropertyType propertyType;
    private DealType dealType;
    private Long price;
    private Long rentPrice;
    private String floor;
    private String totalFloor;
    private Double area;
    private String address;
    private Long maintenancePrice;
    private List<String> imageUrls;

    private List<TransportInfo> transportInfos;
    private List<StationInfo> stations;
    private List<FacilityInfo> facilities;
    @Data
    public static class TransportInfo{
        Integer totalTransportTime;
        List<Integer> transportTimeList;
        Integer transferCount;

        public TransportInfo(TransportTimeResponse response){
            this.totalTransportTime = response.getTotalTransportTime();
            this.transportTimeList = response.getTransportTimeList();
            this.transferCount = response.getTransferCount();
        }
    }

    @Data
    public static class StationInfo{
        Long id;
        String name;
        String line;

        public StationInfo(Station station){
            this.id = station.getId();
            this.name = station.getName();
            this.line = station.getLineName();
        }
    }

    @Data
    public static class FacilityInfo{
        FacilityType facilityType;
        Double latitude;
        Double longitude;
    }

}
