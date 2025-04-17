package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.FacilityType;
import com.ssaenggojip.common.enums.TransportationType;
import com.ssaenggojip.common.util.RoutingUtil;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.property.converter.PropertyConverter;
import com.ssaenggojip.property.dto.request.CoordinateGetRequest;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.property.dto.response.*;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyImage;
import com.ssaenggojip.property.repository.PropertyImageRepository;
import com.ssaenggojip.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final TransportTimeProvider transportTimeProvider;
    private final RoutingUtil routingUtil;

    @Transactional(readOnly = true)
    public SearchResponse searchWithFilter(SearchRequest request, Boolean isStationSearch, Double lng, Double lat) {
        // lat, lng 기준 반경 1KM, 설정한 조건 기준으로 검색
        Integer SEARCH_DISTANCE = 1250;
        List<Property> properties = propertyRepository.searchFilteredProperties(
                request.getDealType() != null ? request.getDealType().name() : null,
                request.getPropertyTypes().stream().map(Enum::name).toList(),
                request.getPropertyTypes().isEmpty(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRentPrice(),
                request.getMaxRentPrice(),
                request.getSearch().isEmpty() ? null : request.getSearch(),
                lng != null ? BigDecimal.valueOf(lng) : null,
                lat != null ? BigDecimal.valueOf(lat) : null,
                isStationSearch,
                SEARCH_DISTANCE,

                // 사설 필터
                request.getFacilityTypes().contains(FacilityType.병원) ? true : null,
                request.getFacilityTypes().contains(FacilityType.약국) ? true : null,
                request.getFacilityTypes().contains(FacilityType.동물병원) ? true : null,
                request.getFacilityTypes().contains(FacilityType.공원) ? true : null,
                request.getFacilityTypes().contains(FacilityType.관공서) ? true : null,
                request.getFacilityTypes().contains(FacilityType.편의점) ? true : null,
                request.getFacilityTypes().contains(FacilityType.대형마트) ? true : null,
                request.getFacilityTypes().contains(FacilityType.세탁소) ? true : null
        );

        if(properties.size()>20000)
            throw new GeneralException(ErrorStatus.TOO_MANY_PROPERTY_SEARCH);

        // dto로 변경
        List<SearchProperty> result = properties.stream()
                .map(property -> PropertyConverter.mapToDto(property, false, false))
                .toList();

        // 최종 dto로 변경
        return SearchResponse.builder()
                .total(result.size())
                .properties(result)
                .build();
    }

    @Transactional(readOnly = true)
    public Property getDetail(Long id) {
        return propertyRepository.findById(id).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));
    }
    @Transactional(readOnly = true)
    public List<String> getDetailImage(Long id) {
        List<String> imageUrls = new ArrayList<>();
        for (PropertyImage propertyImage : propertyImageRepository.findByProperty_Id(id))
            imageUrls.add(propertyImage.getImageUrl());
        return imageUrls;
    }
    @Transactional(readOnly = true)
    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId()).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));

        Double lat1 = request.getLatitude();
        Double lng1 = request.getLongitude();
        Double lat2 = property.getLatitude();
        Double lng2 = property.getLongitude();

        Integer ans = routingUtil.getRoute(lat1, lng1, lat2, lng2, request.getTransportationType());

        List<Integer> transportTimeList = new ArrayList<>();
        transportTimeList.add(ans);

        return TransportTimeResponse.builder()
                .totalTransportTime(ans)
                .transportTimeList(transportTimeList)
                .transferCount(0)
                .build();
    }
    @Transactional(readOnly = true)
    public Property getPropertyById(Long propertyId) {
        return propertyRepository.findById(propertyId).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));
    }
    @Transactional(readOnly = true)
    public List<CoordinateResponse> getCoordinates(CoordinateGetRequest coordinateGetRequest) {
        Double minY = Math.min(coordinateGetRequest.getLeftDown().get(0), coordinateGetRequest.getRightUp().get(0));
        Double maxY = Math.max(coordinateGetRequest.getLeftDown().get(0), coordinateGetRequest.getRightUp().get(0));
        Double minX = Math.min(coordinateGetRequest.getLeftDown().get(1), coordinateGetRequest.getRightUp().get(1));
        Double maxX = Math.max(coordinateGetRequest.getLeftDown().get(1), coordinateGetRequest.getRightUp().get(1));
        return propertyRepository.findAllCoordinatesBySquareScope(minX, minY, maxX, maxY).stream()
                .map(p -> new CoordinateResponse(
                        p.getId(),
                        p.getLongitude(),
                        p.getLatitude(),
                        p.getPropertyType(),
                        p.getDealType(),
                        p.getPrice(),
                        p.getRentPrice(),
                        p.getMaintenancePrice(),
                        p.getFloor(),
                        p.getTotalFloor(),
                        p.getExclusiveArea(),
                        p.getMainImage()
                ))
                .toList();

    }
    @Transactional(readOnly = true)
    public List<RecommendSearchDto> searchPropertiesWithinTime(RecommendSearchRequest request, Integer targetNum){
        // 주소 기준 K시간 이내 도보권 매물 - p
        Double lat = request.getAddresses().get(targetNum).getLatitude();
        Double lng = request.getAddresses().get(targetNum).getLongitude();
        Integer dist = transportTimeProvider.walkTimeToDistance(request.getAddresses().get(targetNum).getWalkTime());

        List<Property> properties = propertyRepository.searchFilteredProperties(
                request.getDealType() != null ? request.getDealType().name() : null,
                request.getPropertyType().stream().map(Enum::name).toList(),
                request.getPropertyType().isEmpty(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRentPrice(),
                request.getMaxRentPrice(),
                null,
                lng != null ? BigDecimal.valueOf(lng) : null,
                lat != null ? BigDecimal.valueOf(lat) : null,
                true,
                dist,
                // 사설 필터
                request.getFacility().contains(FacilityType.병원) ? true : null,
                request.getFacility().contains(FacilityType.약국) ? true : null,
                request.getFacility().contains(FacilityType.동물병원) ? true : null,
                request.getFacility().contains(FacilityType.공원) ? true : null,
                request.getFacility().contains(FacilityType.관공서) ? true : null,
                request.getFacility().contains(FacilityType.편의점) ? true : null,
                request.getFacility().contains(FacilityType.대형마트) ? true : null,
                request.getFacility().contains(FacilityType.세탁소) ? true : null


        );

        if(properties.size()>20000)
            throw new GeneralException(ErrorStatus.TOO_MANY_PROPERTY_SEARCH);

        List<RecommendSearchDto> recommendSearchProperties = new ArrayList<>();
        // 도보 시간 정밀 검사 후 교체
        for (Property p: properties){
            TransportationType transportationType =  request.getAddresses().get(targetNum).getTransportationType();
            if (transportationType == TransportationType.지하철)
                transportationType = TransportationType.도보;
            int totalTime = routingUtil.getRoute(lat, lng, p.getLatitude(), p.getLongitude(), transportationType);
            // 도보 시간 초과시 추가 하지 않음
            if (totalTime > request.getAddresses().get(targetNum).getWalkTime())
                continue;
            recommendSearchProperties.add(
                    RecommendSearchDto.builder()
                            .id(p.getId())
                            .isRecommend(false)
                            .dealType(p.getDealType().name())
                            .price(p.getPrice())
                            .rentPrice(p.getRentPrice())
                            .maintenancePrice(p.getMaintenancePrice())
                            .totalFloor(p.getTotalFloor())
                            .floor(p.getFloor())
                            .area(p.getExclusiveArea())
                            .address(p.getAddress())
                            .latitude(p.getLatitude())
                            .longitude(p.getLongitude())
                            .isInterest(false)
                            .imageUrl(p.getMainImage())
                            .totalTime(totalTime)
                            .build()
            );
        }
        return recommendSearchProperties;
    }
    @Transactional(readOnly = true)
    public List<RecommendSearchDto> getRecommendedProperties(RecommendSearchRequest request, Integer targetNum) {
        Double pointLatitude = request.getAddresses().get(targetNum).getLatitude();
        Double pointLongitude = request.getAddresses().get(targetNum).getLongitude();
        List<PointStationPropertyDto> pointStationPropertyDtos = propertyRepository.findReachableProperties(
                pointLongitude,
                pointLatitude,
                request.getAddresses().get(targetNum).getWalkTime(),
                request.getAddresses().get(targetNum).getTotalTransportTime(),
                request.getDealType() != null ? request.getDealType().name() : null,
                request.getPropertyType().stream().map(Enum::name).toList(),
                request.getPropertyType() == null || request.getPropertyType().isEmpty(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRentPrice(),
                request.getMaxRentPrice(),
                // 사설 필터
                request.getFacility().contains(FacilityType.병원) ? true : null,
                request.getFacility().contains(FacilityType.약국) ? true : null,
                request.getFacility().contains(FacilityType.동물병원) ? true : null,
                request.getFacility().contains(FacilityType.공원) ? true : null,
                request.getFacility().contains(FacilityType.관공서) ? true : null,
                request.getFacility().contains(FacilityType.편의점) ? true : null,
                request.getFacility().contains(FacilityType.대형마트) ? true : null,
                request.getFacility().contains(FacilityType.세탁소) ? true : null
                );
//        System.out.println("LLL");
//        System.out.println(pointStationPropertyDtos.size());
//        long uniqueCount = pointStationPropertyDtos.stream()
//                .map(PointStationPropertyDto::getId) // 또는 getPropertyId()
//                .distinct()
//                .count();
//        System.out.println("고유 propertyId 수: " + uniqueCount);
        if (pointStationPropertyDtos.size() > 20000)
            throw new GeneralException(ErrorStatus.TOO_MANY_PROPERTY_SEARCH);


        // 정밀계산

        // stationA까지의 도보 시간 캐싱
        Map<Long, Integer> stationARouteCache = new ConcurrentHashMap<>();

        List<RecommendSearchDto> result = pointStationPropertyDtos.parallelStream()
                .map(dto -> {
                    try {
                        long stationAId = dto.getStationAId();

                        // 캐시에 존재하면 계산 안함, 존재 안하면 계산하고 넣음
                        int route1 = stationARouteCache.computeIfAbsent(stationAId, id -> {
                            return routingUtil.getRoute(
                                    pointLatitude,
                                    pointLongitude,
                                    dto.getStationALatitude(),
                                    dto.getStationALongitude(),
                                    TransportationType.도보
                            );
                        });

                        int route2 = routingUtil.getRoute(
                                dto.getStationBLatitude(),
                                dto.getStationBLongitude(),
                                dto.getLatitude(),
                                dto.getLongitude(),
                                TransportationType.도보
                        );

                        int walkTime = request.getAddresses().get(targetNum).getWalkTime();
                        int totalTime = request.getAddresses().get(targetNum).getTotalTransportTime();

                        if (route1 + route2 > walkTime || route1 + route2 + dto.getTotalTime() > totalTime) {
                            return null;
                        }

                        return new RecommendSearchDto(
                                dto.getId(),
                                dto.getIsRecommend(),
                                dto.getDealType(),
                                dto.getPropertyType(),
                                dto.getPrice(),
                                dto.getRentPrice(),
                                dto.getMaintenancePrice(),
                                dto.getTotalFloor(),
                                dto.getFloor(),
                                dto.getArea(),
                                dto.getAddress(),
                                dto.getLatitude(),
                                dto.getLongitude(),
                                false,
                                dto.getImageUrl(),
                                route1 + dto.getTotalTime() + route2
                        );
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();

//        List<RecommendSearchDto> result = new ArrayList<>();
//        for (PointStationPropertyDto dto : pointStationPropertyDtos) {
//            int route1 = routingUtil.getRoute(pointLatitude, pointLongitude, dto.getStationALatitude(), dto.getStationALongitude(), TransportationType.도보);
//            int route2 = routingUtil.getRoute(dto.getStationBLatitude(), dto.getStationBLongitude(), dto.getLatitude(), dto.getLongitude(), TransportationType.도보);
//            // 시간 초과시 추가 하지 않음
//            if(route1+route2 > request.getAddresses().get(targetNum).getWalkTime()
//                    || route1+route2+dto.getTotalTime() > request.getAddresses().get(targetNum).getTotalTransportTime())
//                continue;
//            RecommendSearchDto recommendSearchDto = new RecommendSearchDto(
//                    dto.getId(),
//                    dto.getIsRecommend(),
//                    dto.getDealType(),
//                    dto.getPrice(),
//                    dto.getRentPrice(),
//                    dto.getMaintenancePrice(),
//                    dto.getTotalFloor(),
//                    dto.getFloor(),
//                    dto.getArea(),
//                    dto.getAddress(),
//                    dto.getLatitude(),
//                    dto.getLongitude(),
//                    false,
//                    dto.getImageUrl(),
//                    route1 + dto.getTotalTime() + route2
//            );
//            result.add(recommendSearchDto);
//        }
    return result;

    }

}
