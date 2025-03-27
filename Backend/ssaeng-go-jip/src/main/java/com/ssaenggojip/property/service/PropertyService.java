package com.ssaenggojip.property.service;

import com.ssaenggojip.property.entity.request.RecommendDetailRequest;
import com.ssaenggojip.property.entity.request.RecommendSearchRequest;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.DetailResponse;
import com.ssaenggojip.property.entity.response.RecommendSearchResponse;
import com.ssaenggojip.property.entity.response.SearchResponse;
import com.ssaenggojip.property.entity.response.TransportTimeResponse;
import com.ssaenggojip.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public SearchResponse searchProperty(SearchRequest request) {
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
