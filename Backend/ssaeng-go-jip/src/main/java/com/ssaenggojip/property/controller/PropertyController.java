package com.ssaenggojip.property.controller;


import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.property.entity.request.RecommendDetailRequest;
import com.ssaenggojip.property.entity.request.RecommendSearchRequest;
import com.ssaenggojip.property.entity.request.SearchRequest;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.DetailResponse;
import com.ssaenggojip.property.entity.response.RecommendSearchResponse;
import com.ssaenggojip.property.entity.response.SearchResponse;
import com.ssaenggojip.property.service.PropertyFacade;
import com.ssaenggojip.property.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyFacade propertyFacade;


    @PostMapping("/search")
    public ApiResponse<?> searchProperty(@RequestBody SearchRequest searchRequest) {
        SearchResponse response = propertyFacade.searchProperties(searchRequest);
        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{propertyId}")
    public ApiResponse<?> getPropertyDetail(@PathVariable Long propertyId) {
        DetailResponse detailResponse = propertyFacade.getDetail(propertyId);
        return ApiResponse.onSuccess(detailResponse);
    }

    @PostMapping("/get-transport-time")
    public ApiResponse<?> getTransportTime(@RequestBody TransportTimeRequest transportTimeRequest) {
        return null;
    }

    @PostMapping("/recommend-search")
    public ApiResponse<?> searchRecommend(RecommendSearchRequest recommendSearchRequest) {
        return null;
    }

    @PostMapping("/recommend-detail")
    public ApiResponse<?> getRecommendDetail(RecommendDetailRequest recommendDetailRequest) {
        return null;
    }


}
