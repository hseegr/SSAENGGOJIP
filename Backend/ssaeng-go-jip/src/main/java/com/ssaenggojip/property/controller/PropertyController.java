package com.ssaenggojip.property.controller;


import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.property.dto.request.CoordinateGetRequest;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
import com.ssaenggojip.property.dto.response.CoordinateResponse;
import com.ssaenggojip.property.dto.response.DetailResponse;
import com.ssaenggojip.property.dto.response.SearchResponse;
import com.ssaenggojip.property.dto.response.TransportTimeResponse;
import com.ssaenggojip.property.service.PropertyFacade;
import com.ssaenggojip.property.service.PropertyService;
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
    public ApiResponse<SearchResponse> searchProperty(@RequestBody SearchRequest searchRequest) {
        return ApiResponse.onSuccess(propertyFacade.searchProperties(searchRequest));
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
    public ApiResponse<?> searchRecommend(RecommendSearchRequest recommendSearchRequest) {
        return null;
    }
//
//    @PostMapping("/recommend-detail")
//    public ApiResponse<?> getRecommendDetail(RecommendDetailRequest recommendDetailRequest) {
//        return null;
//    }


}
