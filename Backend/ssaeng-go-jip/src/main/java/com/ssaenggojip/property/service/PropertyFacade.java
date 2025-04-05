package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.response.*;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class PropertyFacade {

    private final StationService stationService;
    private final PropertyService propertyService;
    private final TransportTimeProvider transportTimeProvider;

    public SearchResponse searchProperties(SearchRequest request) {
        String search = request.getSearch();
        boolean isStationSearch = false;
        Double lat = null;
        Double lng = null;

        // 역으로 끝나면 isStationSearch 업데이트
        if (search.endsWith("역")) {
            Station station =  stationService.findByName(search);
            isStationSearch = true;
            lat = station.getLatitude();
            lng = station.getLongitude();
        }

        return propertyService.searchWithFilter(request, isStationSearch, lng, lat);
    }

    public DetailResponse getDetail(Long id) {
        Property property = propertyService.getDetail(id);

        // TODO:편의 시설 구하는 로직
        List<DetailFacility> detailFacilities = new ArrayList<>();

        List<DetailStation> detailStations = new ArrayList<>();
        for(Station station: stationService.findStationsWithin1km(property.getLongitude(), property.getLatitude())){
            detailStations.add(
                    DetailStation.builder()
                            .id(station.getId())
                            .name(station.getName())
                            .line(station.getLineName())
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
                .maintenancePrice(property.getMaintenancePrice())
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
        TransportTimeResponse response;

        switch (request.getTransportationType()) {
            case 도보 -> response = propertyService.getTransportTime(request);
            case 지하철 -> {
                Property property = propertyService.getPropertyById(request.getPropertyId());
                response = stationService.getTransportTime(request.getLongitude(), request.getLatitude(), property.getLongitude(), property.getLatitude());
            }
            default -> throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }

        return response;
    }


    public RecommendSearchResponse searchRecommend(RecommendSearchRequest request) {

        // 1 주소 기준 K시간 이내 도보권 매물 - p
        List<RecommendSearchDto> properties1 = propertyService.searchPropertiesWithWalkTime(request
                , 0);
        // 2 지하철 이용시
        List<RecommendSearchDto> response = propertyService.getRecommendedProperties(request, 0);

        Map<Long, RecommendSearchProperty> merged = new HashMap<>();
        for (RecommendSearchDto p : properties1) {
            merged.put(p.getId(), new RecommendSearchProperty(p));
        }
        for (RecommendSearchDto p : response) {
            RecommendSearchProperty existing = merged.get(p.getId());
            if (existing == null || p.getTotalTime() < existing.getTransportTimes().get(0)) {
                merged.put(p.getId(),  new RecommendSearchProperty(p));
            }
        }
        // 결과 리스트
        List<RecommendSearchProperty> result = new ArrayList<>(merged.values());
        if(result.size()>5000)
            throw new GeneralException(ErrorStatus.TOO_MANY_PROPERTY_SEARCH);


        return RecommendSearchResponse.builder()
                .total(result.size())
                .properties(result)
                .build();


    }
}
