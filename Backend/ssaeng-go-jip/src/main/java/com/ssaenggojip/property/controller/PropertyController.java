package com.ssaenggojip.property.controller;


import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.property.dto.request.RecommendDetailRequest;
import com.ssaenggojip.property.dto.request.RecommendSearchRequest;
import com.ssaenggojip.property.dto.request.SearchRequest;
import com.ssaenggojip.property.dto.request.TransportTimeRequest;
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
        return ApiResponse.onSuccess(propertyFacade.searchProperties(searchRequest));
    }

    @GetMapping("/{propertyId}")
    public ApiResponse<?> getPropertyDetail(@PathVariable Long propertyId) {
        return ApiResponse.onSuccess(propertyFacade.getDetail(propertyId));
    }

    @PostMapping("/get-transport-time")
    public ApiResponse<?> getTransportTime(@RequestBody TransportTimeRequest transportTimeRequest) {
        return ApiResponse.onSuccess(propertyFacade.getTransportTime(transportTimeRequest));
    }

    @GetMapping("/coordinates")
    public ApiResponse<?> getCoordinates() {
        return ApiResponse.onSuccess(propertyService.getCoordinates());
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
