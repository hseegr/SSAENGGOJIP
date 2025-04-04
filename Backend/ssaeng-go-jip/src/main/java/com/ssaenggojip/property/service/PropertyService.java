package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.property.converter.PropertyConverter;
import com.ssaenggojip.property.dto.response.CoordinateResponse;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyImage;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.property.dto.response.SearchProperty;
import com.ssaenggojip.property.dto.response.SearchResponse;
import com.ssaenggojip.property.dto.response.TransportTimeResponse;
import com.ssaenggojip.property.repository.PropertyImageRepository;
import com.ssaenggojip.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final TransportTimeProvider transportTimeProvider;


    public SearchResponse searchWithFilter(SearchRequest request, Boolean isStationSearch, Double lng, Double lat) {
        // lat, lng 기준 반경 1KM, 설정한 조건 기준으로 검색

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
                isStationSearch
        );

        // dto로 변경
        List<SearchProperty> result = properties.stream()
                .map(property -> PropertyConverter.mapToDto(property, false, false))
                .toList();

        // 최종 dto로 변경
        return SearchResponse.builder()
                .total(result.size())
                .properties(result.toArray(new SearchProperty[0]))
                .build();
    }

    public Property getDetail(Long id) {
        return propertyRepository.findById(id).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));
    }

    public List<String> getDetailImage(Long id) {
        List<String> imageUrls = new ArrayList<>();
        for (PropertyImage propertyImage : propertyImageRepository.findByProperty_Id(id))
            imageUrls.add(propertyImage.getImageUrl());
        return imageUrls;
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId()).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));


        Double lat1 = request.getLatitude();
        Double lng1 = request.getLongitude();
        Double lat2 = property.getLatitude();
        Double lng2 = property.getLongitude();

        Integer ans = transportTimeProvider.getWalkMinutes(lat1, lng1, lat2, lng2);

        List<Integer> transportTimeList = new ArrayList<>();
        transportTimeList.add(ans);

        return TransportTimeResponse.builder()
                .totalTransportTime(ans)
                .transportTimeList(transportTimeList)
                .transferCount(0)
                .build();
    }

    public Property getPropertyById(Long propertyId) {
        return propertyRepository.findById(propertyId).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));
    }

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
}
