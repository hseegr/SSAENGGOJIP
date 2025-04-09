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

@Component
@RequiredArgsConstructor
public class RoutingUtil {

    private final GraphHopper graphHopper;

    /**
     * 위도/경도 쌍으로 경로 소요 시간 계산 (분 단위, 올림 처리)
     * @param fromLat 출발지 위도
     * @param fromLon 출발지 경도
     * @param toLat 도착지 위도
     * @param toLon 도착지 경도
     * @param transportationType 한글 교통 수단 enum
     * @return 분 단위 소요 시간
     */
    public Integer getRoute(double fromLat, double fromLon, double toLat, double toLon, TransportationType transportationType) {
        try {
            String vehicle = switch (transportationType) {
                case 차 -> "car";
                case 도보 -> "foot";
                case 자전거 -> "bike";
                case 지하철 -> "foot";
                default -> throw new GeneralException(ErrorStatus.NOT_SUPPORTED_ENUM_TYPE);
            };

            GHRequest request = new GHRequest(fromLat, fromLon, toLat, toLon)
                    .setLocale(Locale.KOREA)
                    .setProfile(vehicle);

            GHResponse response = graphHopper.route(request);

            if (response.hasErrors()) {
                System.err.println("GraphHopper 오류: " + response.getErrors());
                throw new GeneralException(ErrorStatus._BAD_REQUEST);
            }

            var path = response.getBest();
            return (int) Math.ceil(path.getTime() / 1000.0 / 60.0); // ms → 분 단위 (올림)

        } catch (Exception e) {
            System.err.println("GraphHopper 예외 발생: " + e.getMessage());
            e.printStackTrace();
            throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }
    }

}
