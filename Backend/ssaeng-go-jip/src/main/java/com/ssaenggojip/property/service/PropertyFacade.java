package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.TransportationType;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.dto.request.RecommendDetailRequest;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.response.*;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.recommend.service.RecommendService;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.service.StationService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PropertyFacade {

    private final StationService stationService;
    private final PropertyService propertyService;
    private final FacilityService facilityService;
    private final PropertyLikeService propertyLikeService;
    private final RecommendService recommendService;

    @Transactional(readOnly = true)
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

        // 조건으로 필터링
        SearchResponse searchResponse = propertyService.searchWithFilter(request, isStationSearch, lng, lat);;


        // 필터링 한 값에 관심/추천 부여
        if(user != null) {
            Set<Long> ids = new HashSet<>(searchResponse.getProperties().stream()
                    .map(SearchProperty::getId)
                    .toList());
            Set<Long> recommendIds = recommendService.filterRecommendedIds(ids, user);
            Set<Long> likePropertyIds = new HashSet<>(propertyLikeService.getLikePropertyIds(user));
            for (SearchProperty searchProperty:searchResponse.getProperties()) {
                searchProperty.setIsInterest(likePropertyIds.contains(searchProperty.getId()));
                searchProperty.setIsRecommend(recommendIds.contains(searchProperty.getId()));
            }
        }

        return searchResponse;
    }
    @Transactional(readOnly = true)
    public DetailResponse getDetail(Long id) {
        Property property = propertyService.getDetail(id);

        // 주변 역 조립
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
        // 이미지 불러오기
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
                .imageUrls(imageUrls)
                .build();
    }
    @Transactional(readOnly = true)
    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        TransportTimeResponse response = null;
        // 이동 수단별로 처리
        switch (request.getTransportationType()) {
            case 도보, 차, 자전거 -> response = propertyService.getTransportTime(request);
            case 지하철 -> {

                Property property = propertyService.getPropertyById(request.getPropertyId());

                // 도보도 구해줌
                TransportTimeRequest walkRequest = TransportTimeRequest.builder()
                        .propertyId(request.getPropertyId())
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .transportationType(TransportationType.도보)
                        .build();
                TransportTimeResponse responseWalk = propertyService.getTransportTime(walkRequest);
                // 지하철 시간과 도보시간과 비교한 후 짧은 쪽으로 리턴, 동일한 경우에는 도보
                response = stationService.getTransportTime(request.getLongitude(), request.getLatitude(), property.getLongitude(), property.getLatitude());
                response = response != null && response.getTotalTransportTime() < responseWalk.getTotalTransportTime() ? response: responseWalk;
            }
            default -> throw new GeneralException(ErrorStatus.NOT_SUPPORTED_ENUM_TYPE);
        }

        return response;
    }

    @Transactional(readOnly = true)
    public RecommendSearchResponse searchRecommend(RecommendSearchRequest request, User user) {

        Map<Long, RecommendSearchProperty> merged1 = getMergedPropertiesByIndex(request,0);

        List<RecommendSearchProperty> result;
        // 결과 리스트
        if(request.getAddresses().size() == 1) {
            result = new ArrayList<>(merged1.values());
        }
        else if(request.getAddresses().size() == 2){ // 입력 주소가 2개인 경우 결합
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

        RecommendSearchResponse response = RecommendSearchResponse.builder()
                .total(result.size())
                .properties(result)
                .build();
        // 필터링 한 값에 관심/추천 부여
        if(user != null) {
            Set<Long> ids = new HashSet<>(response.getProperties().stream()
                    .map(RecommendSearchProperty::getId)
                    .toList());
            Set<Long> recommendIds = recommendService.filterRecommendedIds(ids, user);
            Set<Long> LikePropertyIds = new HashSet<>(propertyLikeService.getLikePropertyIds(user));
            for (RecommendSearchProperty recommendSearchProperty:response.getProperties()) {
                recommendSearchProperty.setIsInterest(LikePropertyIds.contains(recommendSearchProperty.getId()));
                recommendSearchProperty.setIsRecommend(recommendIds.contains(recommendSearchProperty.getId()));

            }

        }
        return response;

    }
    @Transactional(readOnly = true)
    public Map<Long, RecommendSearchProperty> getMergedPropertiesByIndex(RecommendSearchRequest request, int index) {
        Map<Long, RecommendSearchProperty> merged = new HashMap<>();

        // 도보/차/자전거 만 (정밀 검사까지 수행 완료)
        List<RecommendSearchDto> walkOnly = propertyService.searchPropertiesWithinTime(request, index);
        for (RecommendSearchDto dto : walkOnly) {
            merged.put(dto.getId(), new RecommendSearchProperty(dto));
        }

        // 지하철 포함 (정밀 검사까지 수행 완료)
        if (request.getAddresses().get(index).getTransportationType() == TransportationType.지하철) {
            List<RecommendSearchDto> subwayIncluded = propertyService.getRecommendedProperties(request, index);
            // 빠른 쪽으로
            for (RecommendSearchDto dto : subwayIncluded) {
                RecommendSearchProperty existing = merged.get(dto.getId());
                if (existing == null || dto.getTotalTime() < existing.getTransportTimes().get(0)) {
                    merged.put(dto.getId(), new RecommendSearchProperty(dto));
                }
            }
        }
        for(Long propertyId: merged.keySet())
            if(merged.get(propertyId).getTransportTimes().get(0) > request.getAddresses().get(index).getTotalTransportTime())
                merged.remove(propertyId);


        return merged;
    }
    @Transactional(readOnly = true)
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
                response = responseSub != null && responseSub.getTotalTransportTime() < response.getTotalTransportTime() ? responseSub : response;
            }
            transportInfos.add(new RecommendDetailResponse.TransportInfo(response));
        }

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
                .build();
    }
}
