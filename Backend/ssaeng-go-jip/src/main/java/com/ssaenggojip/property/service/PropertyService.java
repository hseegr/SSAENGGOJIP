package com.ssaenggojip.property.service;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.request.RecommendDetailRequest;
import com.ssaenggojip.property.entity.request.RecommendSearchRequest;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.*;
import com.ssaenggojip.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public SearchResponse searchProperty(SearchRequest request) {
        String search = request.getSearch();
        Double searchLat = null;
        Double searchLng = null;
        boolean isStationSearch = false;

        if (search != null && search.endsWith("역")) {
            isStationSearch = true;

            // 역 이름 기반 좌표 검색
            Station station = stationRepository.findByName(search);
            if (station == null) {
                return SearchResponse.builder()
                        .total(0)
                        .properties(new SearchProperty[0])
                        .build(); // 존재하지 않는 역이면 바로 빈 결과
            }

            searchLat = station.getLatitude();
            searchLng = station.getLongitude();
        }

        List<Property> properties = propertyRepository.searchFilteredProperties(
                request, searchLat, searchLng, isStationSearch
        );

        List<SearchProperty> searchProperties = properties.stream()
                .map(this::mapToDto)
                .toList();

        return SearchResponse.builder()
                .total(searchProperties.size())
                .properties(searchProperties.toArray(new SearchProperty[0]))
                .build();

        //TODO: 유저가 관심 등록했는지 확인하는 로직 추가

        //TODO: 추천 라벨 박는 로직 추가

        return null;
    }

    public DetailResponse getPropertyDetail(Long id) {
        return null;
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {
        return null;
    }

    public RecommendSearchResponse searchRecommend(RecommendSearchRequest request) {
        return null;
    }

    public RecommendSearchResponse getRecommendDetail(RecommendDetailRequest request) {
        return null;
    }

}
