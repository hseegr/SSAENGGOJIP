package com.ssaenggojip.common.util;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.util.shapes.GHPoint;
import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.TransportationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoutingUtil {

    private final GraphHopper graphHopper;

    /**
     * 위도/경도 쌍으로 경로 거리/시간 계산
     * @param fromLat 출발지 위도
     * @param fromLon 출발지 경도
     * @param toLat 도착지 위도
     * @param toLon 도착지 경도
     * @return 거리(m), 시간(ms)
     */
    public Integer getRoute(double fromLat, double fromLon, double toLat, double toLon, TransportationType transportationType) {
        GHRequest request = new GHRequest(fromLat, fromLon, toLat, toLon)
                .setLocale(Locale.KOREA);
        String vehicle;
        switch (transportationType) {
            case 차 -> vehicle = "car";
            case 도보 -> vehicle = "foot";
            case 자전거 -> vehicle = "bike";
            default -> throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }
        request.getHints().put("vehicle", vehicle); // ✅ 1.0에서는 이렇게 설정

        GHResponse response = graphHopper.route(request);

        if (response.hasErrors())
            throw new GeneralException(ErrorStatus._BAD_REQUEST);

        var path = response.getBest();

        return (int) Math.ceil(path.getTime() / 1000.0 / 60.0);
    }

    public record RouteResult(double distanceInMeters, int timeInMillis) {}
}
