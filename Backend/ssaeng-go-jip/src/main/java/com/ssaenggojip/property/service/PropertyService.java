package com.ssaenggojip.property.service;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyImage;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.response.SearchProperty;
import com.ssaenggojip.property.entity.response.SearchResponse;
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
}
