package com.ssaenggojip.property.controller;


import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.property.dto.request.*;
import com.ssaenggojip.property.dto.response.*;
import com.ssaenggojip.property.service.PropertyFacade;
import com.ssaenggojip.property.service.PropertyService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyFacade propertyFacade;


    @PostMapping("/search")
    public ApiResponse<SearchResponse> searchProperty(@RequestBody SearchRequest searchRequest, @AuthUser(required = false) User user) {
        return ApiResponse.onSuccess(propertyFacade.searchProperties(searchRequest, user));
    }

    @GetMapping("/{propertyId}")
    public ApiResponse<DetailResponse> getPropertyDetail(@PathVariable Long propertyId) {
        return ApiResponse.onSuccess(propertyFacade.getDetail(propertyId));
    }

    @PostMapping("/get-transport-time")
    public ApiResponse<TransportTimeResponse> getTransportTime(@RequestBody TransportTimeRequest transportTimeRequest) {
        return ApiResponse.onSuccess(propertyFacade.getTransportTime(transportTimeRequest));
    }

    @PostMapping("/coordinates")
    public ApiResponse<List<CoordinateResponse>> getCoordinates(@RequestBody CoordinateGetRequest coordinateGetRequest) {
        return ApiResponse.onSuccess(propertyService.getCoordinates(coordinateGetRequest));
    }

    @PostMapping("/recommend-search")
    public ApiResponse<RecommendSearchResponse> searchRecommend(@RequestBody RecommendSearchRequest recommendSearchRequest, @AuthUser(required = false) User user) {
        return ApiResponse.onSuccess(propertyFacade.searchRecommend(recommendSearchRequest, user));
    }

    @PostMapping("/recommend-detail")
    public ApiResponse<RecommendDetailResponse> getRecommendDetail(@RequestBody RecommendDetailRequest recommendDetailRequest) {
        return ApiResponse.onSuccess(propertyFacade.getRecommendDetail(recommendDetailRequest));
    }


}
