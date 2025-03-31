package com.ssaenggojip.property.service;

import com.ssaenggojip.common.enums.TransportationType;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.*;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PropertyFacade {

    private final StationService stationService;
    private final PropertyService propertyService;

    public SearchResponse searchProperties(SearchRequest request) {
        String search = request.getSearch();
        boolean isStationSearch = false;
        Double lat = null;
        Double lng = null;

        // 역으로 끝나면 isStationSearch 업데이트
        if (search != null && search.endsWith("역")) {
            Optional<Station> stationOpt =  stationService.findByName(search);
            if (stationOpt.isEmpty()) {
                return SearchResponse.builder()
                        .total(0)
                        .properties(new SearchProperty[0])
                        .build();
            }
            Station station = stationOpt.get();
            isStationSearch = true;
            lat = station.getLatitude();
            lng = station.getLongitude();
        }

        return propertyService.searchWithFilter(request, isStationSearch, lat, lng);
    }

    public DetailResponse getDetail(Long id) {
        Property property = propertyService.getDetail(id);
        if (property == null)
            return null;

        // TODO:편의 시설 구하는 로직
        List<DetailFacility> detailFacilities = new ArrayList<>();

        List<DetailStation> detailStations = new ArrayList<>();
        for(Station station: stationService.findStationsWithin1km(property.getLongitude(), property.getLatitude())){
            detailStations.add(
                    DetailStation.builder()
                            .id(station.getId())
                            .name(station.getName())
                            .line(station.getLine())
                            .build()
            );
        }

        List<String> imageUrls = propertyService.getDetailImage(property.getId());

        return DetailResponse.builder()
                .id(property.getId())
                .name(property.getName())
                .propertyType(property.getPropertyType())
                .dealType(property.getDealType())
                .price(property.getPrice())
                .rentPrice(property.getRentPrice())
                .totalFloor(property.getTotalFloor())
                .floor(property.getFloor())
                .area(property.getExclusiveArea())
                .address(property.getAddress())
                .stations(detailStations)
                .facilities(detailFacilities)
                .imageUrls(imageUrls)
                .build();
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        TransportTimeResponse response = new TransportTimeResponse();
        switch (request.getTransportationType()) {
            case WALK -> response = propertyService.getTransportTime(request);
            case SUBWAY -> response = stationService.getTransportTime(requset);
            default -> response = null; // TODO: 예외처리로 변경
        }

        return response;
    }


}