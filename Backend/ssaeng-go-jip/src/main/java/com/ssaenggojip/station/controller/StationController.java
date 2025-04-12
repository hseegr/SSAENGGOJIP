package com.ssaenggojip.station.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.station.dto.request.ShortestStationTimeGetRequest;
import com.ssaenggojip.station.dto.response.CongestionGetResponse;
import com.ssaenggojip.station.dto.response.ShortestStationTimeGetResponse;
import com.ssaenggojip.station.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;


    @GetMapping("/congestion/{stationId}")
    public ApiResponse<CongestionGetResponse> getPropertyDetail(@PathVariable Long stationId) {
        return ApiResponse.onSuccess(stationService.getCongestion(stationId));
    }

    @PostMapping("/to-station-get")
    public ApiResponse<ShortestStationTimeGetResponse> getShortestStationTime(@RequestBody ShortestStationTimeGetRequest request){
        return ApiResponse.onSuccess(stationService.getShortestStationTime(request));
    }

}
