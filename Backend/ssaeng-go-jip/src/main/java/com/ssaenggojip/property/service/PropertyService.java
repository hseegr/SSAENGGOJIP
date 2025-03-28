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



        if (request.getSearch().isEmpty()){
            // 필터링 로직만
        }
        else if(request.getSearch().split(" ").length == 1 && request.getSearch().endsWith("역")){
            // 역 주변
        }
        else if(request.getSearch().split(" ").length == 1 && (request.getSearch().endsWith("도") || request.getSearch().startsWith("서울"))){
            // 시
        }
        else if(request.getSearch().split(" ").length == 1 && request.getSearch().endsWith("동")){
            // 동
        }
        else{
            // 군구
        }

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
