package com.ssaenggojip.property.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyImage;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.SearchProperty;
import com.ssaenggojip.property.entity.response.SearchResponse;
import com.ssaenggojip.property.entity.response.TransportTimeResponse;
import com.ssaenggojip.property.repository.PropertyImageRepository;
import com.ssaenggojip.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;


    public SearchResponse searchWithFilter(SearchRequest request, Boolean isStationSearch, Double lat, Double lng) {
        List<Property> properties = propertyRepository.searchFilteredProperties(
                request, lat, lng, isStationSearch
        );

        List<SearchProperty> result = properties.stream()
                .map(this::mapToDto)
                .toList();

        return SearchResponse.builder()
                .total(result.size())
                .properties(result.toArray(new SearchProperty[0]))
                .build();
    }

    private SearchProperty mapToDto(Property p) {
        return SearchProperty.builder()
                .id(p.getId().intValue())
                .dealType(p.getDealType())
                .price(p.getPrice())
                .rentPrice(p.getRentPrice())
                .totalFloor(p.getTotalFloor())
                .floor(p.getFloor())
                .area(p.getSupplyArea())
                .address(p.getAddress())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .maintenancePrice(p.getMaintenancePrice())
                .isInterest(false)     // TODO:관심 매물 여부: 추후 구현
                .isRecommend(false)    // TODO:추천 여부: 추후 구현
                .build();
    }

    public Property getDetail(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    public List<String> getDetailImage(Long id) {
        List<String> imageUrls = new ArrayList<>();
        for(PropertyImage propertyImage: propertyImageRepository.findByProperty_Id(id))
            imageUrls.add(propertyImage.getImageUrl());
        return imageUrls;
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId()).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));


        //TODO: 도보시간 로직 미적용상태
        final int EARTH_RADIUS_KM = 6371;

        Double lat1 = request.getLatitude();
        Double lng1 = request.getLongitude();
        Double lat2 = property.getLatitude();
        Double lng2 = property.getLongitude();

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double distanceKm = EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        Integer ans =  (int) Math.ceil(distanceKm / (4.8/60.0));

        List<Integer> transportTimeList = new ArrayList<>();
        transportTimeList.add(ans);

        return TransportTimeResponse.builder()
                .totalTransportTime(ans)
                .transportTimeList(transportTimeList)
                .transferCount(0)
                .build();
    }
}
