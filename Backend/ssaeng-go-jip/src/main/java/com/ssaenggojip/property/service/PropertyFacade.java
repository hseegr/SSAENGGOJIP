package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.TransportationType;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.facility.dto.NearFacilityResponse;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.dto.request.RecommendDetailRequest;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.response.*;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.service.StationService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PropertyFacade {

    private final StationService stationService;
    private final PropertyService propertyService;
    private final FacilityService facilityService;
    private final TransportTimeProvider transportTimeProvider;
    private final PropertyLikeService propertyLikeService;

    public SearchResponse searchProperties(SearchRequest request, User user) {
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
        SearchResponse searchResponse = propertyService.searchWithFilter(request, isStationSearch, lng, lat);;
        List<Long> LikePropertyIds = propertyLikeService.getLikePropertyIds(user);
//        if (!LikePropertyIds.isEmpty()){
//            for(int i = 0; i < searchResponse.getProperties().size(); i++){
//
//            }
//        }
        return searchResponse;
        // return propertyService.searchWithFilter(request, isStationSearch, lng, lat);
    }

    public DetailResponse getDetail(Long id) {
        Property property = propertyService.getDetail(id);

        List<NearFacilityResponse> nearFacilities =  facilityService.findNearestFacilities(
                property.getLatitude(),
                property.getLongitude()
        );

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
                .facilities(nearFacilities)
                .imageUrls(imageUrls)
                .build();
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        TransportTimeResponse response;
        switch (request.getTransportationType()) {
            case 도보, 차, 자전거 -> response = propertyService.getTransportTime(request);
            case 지하철 -> {
                Property property = propertyService.getPropertyById(request.getPropertyId());
                TransportTimeResponse responseWalk = propertyService.getTransportTime(request);
                response = stationService.getTransportTime(request.getLongitude(), request.getLatitude(), property.getLongitude(), property.getLatitude());
                response = response.getTotalTransportTime()< responseWalk.getTotalTransportTime() ? response: responseWalk;
            }
            default -> throw new GeneralException(ErrorStatus.NOT_SUPPORTED_ENUM_TYPE);
        }

        return response;
    }


    public RecommendSearchResponse searchRecommend(RecommendSearchRequest request) {

        Map<Long, RecommendSearchProperty> merged1 = getMergedPropertiesByIndex(request,0);

        List<RecommendSearchProperty> result;
        // 결과 리스트
        if(request.getAddresses().size() == 1) {
            result = new ArrayList<>(merged1.values());
        }
        else if(request.getAddresses().size() == 2){ // 주소가 2개인 경우
            Map<Long, RecommendSearchProperty> merged2 = getMergedPropertiesByIndex(request, 1);
            result = merged1.entrySet().stream()
                    .filter(entry -> merged2.containsKey(entry.getKey()))
                    .map(entry -> {
                        RecommendSearchProperty first = entry.getValue();
                        RecommendSearchProperty second = merged2.get(entry.getKey());
                        first.setTransportTimes(List.of(
                                first.getTransportTimes().get(0),
                                second.getTransportTimes().get(0)
                        ));
                        return first;
                    }).collect(Collectors.toList());
        }
        else
            throw new GeneralException(ErrorStatus.MISSING_ADDRESS_INFO_RECOMMEND);

        if (result.size() > 5000)
            throw new GeneralException(ErrorStatus.TOO_MANY_PROPERTY_SEARCH);


        return RecommendSearchResponse.builder()
                .total(result.size())
                .properties(result)
                .build();


    }

    public Map<Long, RecommendSearchProperty> getMergedPropertiesByIndex(RecommendSearchRequest request, int index) {
        Map<Long, RecommendSearchProperty> merged = new HashMap<>();

        // 도보/차/자전거 만
        List<RecommendSearchDto> walkOnly = propertyService.searchPropertiesWithinTime(request, index);
        for (RecommendSearchDto dto : walkOnly) {
            merged.put(dto.getId(), new RecommendSearchProperty(dto));
        }

        // 지하철 포함
        if (request.getAddresses().get(index).getTransportationType() == TransportationType.지하철) {
            List<RecommendSearchDto> subwayIncluded = propertyService.getRecommendedProperties(request, index);
            for (RecommendSearchDto dto : subwayIncluded) {
                RecommendSearchProperty existing = merged.get(dto.getId());
                if (existing == null || dto.getTotalTime() < existing.getTransportTimes().get(0)) {
                    merged.put(dto.getId(), new RecommendSearchProperty(dto));
                }
            }
        }

        return merged;
    }

    public RecommendDetailResponse getRecommendDetail(RecommendDetailRequest request) {
        Property property = propertyService.getPropertyById(request.getPropertyId());

        List<String> imageUrls = propertyService.getDetailImage(request.getPropertyId());
        List<RecommendDetailResponse.StationInfo> stationInfos = stationService
                .findStationsWithin1km(property.getLongitude(), property.getLatitude())
                .stream()
                .map(RecommendDetailResponse.StationInfo::new)
                .collect(Collectors.toList());
        List<RecommendDetailResponse.TransportInfo> transportInfos = new ArrayList<>();

        Double latB = property.getLatitude();
        Double lngB = property.getLongitude();
        for(int i = 0; i < request.getAddresses().size(); i++){
            Double latA = request.getAddresses().get(i).getLatitude();
            Double lngA = request.getAddresses().get(i).getLongitude();
            TransportTimeRequest transportTimeRequest = new TransportTimeRequest(latA, lngA, property.getId(),TransportationType.도보);
            TransportTimeResponse response = propertyService.getTransportTime(transportTimeRequest);

            if(request.getAddresses().get(i).getTransportationType() == TransportationType.지하철) {
                TransportTimeResponse responseSub = stationService.getTransportTime(lngA, latA, property.getLongitude(), property.getLatitude());
                response = responseSub.getTotalTransportTime() < response.getTotalTransportTime() ? responseSub : response;
            }
            transportInfos.add(new RecommendDetailResponse.TransportInfo(response));
        }

        //TODO: 주변 시설정보 추가 하기
        List<RecommendDetailResponse.FacilityInfo> facilityInfos = new ArrayList<>();

        return RecommendDetailResponse.builder()
                .id(property.getId())
                .name(property.getName())
                .propertyType(property.getPropertyType())
                .dealType(property.getDealType())
                .price(property.getPrice())
                .rentPrice(property.getRentPrice())
                .totalFloor(property.getTotalFloor())
                .floor(property.getFloor())
                .totalFloor(property.getTotalFloor())
                .area(property.getExclusiveArea())
                .address(property.getAddress())
                .maintenancePrice(property.getMaintenancePrice())
                .imageUrls(imageUrls)
                .transportInfos(transportInfos)
                .stations(stationInfos)
                .facilities(facilityInfos)
                .build();
    }
}
