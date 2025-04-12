package com.ssaenggojip.station.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.DayType;
import com.ssaenggojip.common.enums.TransportationType;
import com.ssaenggojip.common.enums.UpDownType;
import com.ssaenggojip.common.util.RoutingUtil;
import com.ssaenggojip.property.dto.response.TransportTimeResponse;
import com.ssaenggojip.station.dto.request.ShortestStationTimeGetRequest;
import com.ssaenggojip.station.dto.request.TransportTimeGetRequest;
import com.ssaenggojip.station.dto.response.Congestion;
import com.ssaenggojip.station.dto.response.CongestionGetResponse;
import com.ssaenggojip.station.dto.response.ShortestStationTimeGetResponse;
import com.ssaenggojip.station.dto.response.TransportTimeGetResponse;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.entity.StationDetail;
import com.ssaenggojip.station.entity.StationRoute;
import com.ssaenggojip.station.repository.StationDetailRepository;
import com.ssaenggojip.station.repository.StationRepository;
import com.ssaenggojip.station.repository.StationRouteReporitory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;
    private final StationRouteReporitory stationRouteReporitory;
    private final StationDetailRepository stationDetailRepository;
    private final RoutingUtil routingUtil;

    public Station findByName(String search) {
        if (search.endsWith("역"))
            return stationRepository.findTopByNameOrderByIdAsc(search.substring(0, search.length() - 1)).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
        return stationRepository.findTopByNameOrderByIdAsc(search).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
    }

    public List<Station> findStationsWithin1km(Double longitude, Double latitude) {
        return stationRepository.findStationsWithinKm(longitude, latitude,1);
    }

    public TransportTimeResponse getTransportTime(Double pointLongitude, Double pointLatitude, Double propertyLongitude, Double propertyLatitude) {

        List<Station> stationsNearPoint = stationRepository.findStationsWithinKm(pointLongitude, pointLatitude,2);
        List<Station> stationsNearProperty = stationRepository.findStationsWithinKm(propertyLongitude, propertyLatitude,2);

        if (stationsNearProperty.isEmpty() || stationsNearPoint.isEmpty())
            return null;

        Integer transferCount = -1;
        List<Integer> answer = List.of(Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE);

        for (Station pointStation : stationsNearPoint){
            for (Station propertyStation : stationsNearProperty) {
                if(propertyStation.getId().equals(pointStation.getId()))
                    continue;

                int pointToStationTime = routingUtil.getRoute(pointLatitude,pointLongitude, pointStation.getLatitude(), pointStation.getLongitude(), TransportationType.도보);
                // StationRoute stationRoute = stationRouteRepository.findByDepartureStationIdAndDestinationStationId(pointStation.getId(), propertyStation.getId()).orElseThrow(() -> new GeneralException(ErrorStatus.NO_STATION_TO_STATION_MAPPER));
                StationRoute stationRoute = stationRouteReporitory.findByDepartureStationIdAndDestinationStationId(pointStation.getId(), propertyStation.getId()).orElse(null);
                if (stationRoute == null)
                    continue;

                int stationToStationTime = stationRoute.getTransportTime();
                int stationToPropertyTime = routingUtil.getRoute(propertyLatitude,propertyLongitude,propertyStation.getLatitude(),propertyStation.getLongitude(), TransportationType.도보);
                if(answer.stream().mapToInt(Integer::intValue).sum() > pointToStationTime + stationToStationTime + stationToPropertyTime) {
                    answer = List.of(pointToStationTime, stationToStationTime, stationToPropertyTime);
                    transferCount = stationRoute.getTransferCount();
                }
            }
        }
        return TransportTimeResponse.builder()
                .transferCount(transferCount)
                .transportTimeList(answer)
                .totalTransportTime(answer.stream().mapToInt(Integer::intValue).sum())
                .build();
    }

    public CongestionGetResponse getCongestion(Long stationId) {
        List<StationDetail> stationDetails = stationDetailRepository.findAllByStationId(stationId);
        if(stationDetails.isEmpty())
            return null;

        Boolean isUpDown = stationDetails.get(0).getUpDown() == UpDownType.상선 || stationDetails.get(0).getUpDown() == UpDownType.하선;
        UpDownType firstUpDownType = isUpDown ? UpDownType.상선 : UpDownType.내선;
        UpDownType secondUpDownType = isUpDown ? UpDownType.하선 : UpDownType.외선;


        CongestionGetResponse congestionGetResponse;
        List<Congestion> congestions = new ArrayList<>();
        // 상선/내선
        StationDetail upWeekday = findDetail(stationDetails, firstUpDownType, DayType.평일);
        StationDetail upSaturday = findDetail(stationDetails, firstUpDownType, DayType.토요일);
        StationDetail upSunday = findDetail(stationDetails, firstUpDownType, DayType.일요일);
        congestions.add(new Congestion(upWeekday, upSaturday, upSunday));

        // 하선/외선
        StationDetail downWeekday = findDetail(stationDetails, secondUpDownType, DayType.평일);
        StationDetail downSaturday = findDetail(stationDetails, secondUpDownType, DayType.토요일);
        StationDetail downSunday = findDetail(stationDetails, secondUpDownType, DayType.일요일);
        congestions.add(new Congestion(downWeekday, downSaturday, downSunday));


        congestionGetResponse = CongestionGetResponse.builder()
                .isUpAndDown(isUpDown)
                .congestionList(congestions)
                .build();

        return congestionGetResponse;
    }
    private StationDetail findDetail(List<StationDetail> list, UpDownType upDownType, DayType dayType) {
        return list.stream()
                .filter(d -> d.getUpDown() == upDownType && d.getDayType() == dayType)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
    }

    public List<List<Long>> findStationToStation(Long id, Integer totalTransportTime) {
        List<StationRoute> stationRoutes = stationRouteReporitory.findByDepartureStationIdAndTransportTime(id, totalTransportTime);
        return stationRoutes.stream()
                .map(it -> List.of(it.getId(), it.getTransportTime().longValue()))
                .collect(Collectors.toList());
    }

    public ShortestStationTimeGetResponse getShortestStationTime(ShortestStationTimeGetRequest request) {
        Station startStation = stationRepository.findByNameAndLineName(request.getStartStationName(), request.getStartStationLineName()).orElseThrow(()-> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
        Station endStation = stationRepository.findByNameAndLineName(request.getStartStationName(), request.getStartStationLineName()).orElseThrow(()-> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
        StationRoute stationRoute = stationRouteReporitory.findByDepartureStationIdAndDestinationStationId(startStation.getId(),endStation.getId()).orElseThrow(() -> new GeneralException(ErrorStatus.NO_STATION_TO_STATION_MAPPER));

        return new ShortestStationTimeGetResponse(stationRoute.getTransportTime());
    }


    @Transactional(readOnly = true)
    public TransportTimeGetResponse getTransportTimeSuper(TransportTimeGetRequest request) {

        // 도보만 이용하는 경우
        TransportTimeGetResponse answer = new TransportTimeGetResponse(routingUtil.getRoute(request.getStartLatitude(), request.getStartLongitude(), request.getEndLatitude(), request.getEndLongitude(), TransportationType.도보));
        if(request.getTransportationType() == TransportationType.도보)
            return answer;

        // 2KM 내로 이동 가능한 역들
        List<Station> stationsNearStart = null;
        List<Station> stationsNearEnd = null;
        for (int i = 1; i<5;i++){
            stationsNearStart = stationRepository.findStationsWithinKm(request.getStartLongitude(), request.getStartLatitude(), i);
            if(stationsNearStart!=null)
                break;
        }
        for (int i = 1; i<5;i++){
            stationsNearEnd = stationRepository.findStationsWithinKm(request.getEndLongitude(), request.getEndLatitude(), i);
            if(stationsNearEnd!=null)
                break;
        }

        // 없는 경우 도보만 응답
        if(stationsNearStart.isEmpty() || stationsNearEnd.isEmpty())
            return answer;

        // 지하철 이용시 최소 시간 구하기
        Map<Long, Integer> endStationWalkTime = new HashMap<>();

        for (Station startStation : stationsNearStart){
            Integer startStationTime = routingUtil.getRoute(request.getStartLatitude(), request.getStartLongitude(), startStation.getLatitude(),startStation.getLongitude(), TransportationType.도보);
            for (Station endStation : stationsNearEnd) {
                System.out.println(startStation.getName()+" "+endStation.getName());
                if(startStation.getId().equals(endStation.getId()))
                    continue;

                StationRoute stationRoute = stationRouteReporitory.findByDepartureStationIdAndDestinationStationId(startStation.getId(), endStation.getId()).orElse(null);
                if (stationRoute == null)
                    continue;

                Integer stationToStationTime = stationRoute.getTransportTime();
                if (!endStationWalkTime.containsKey(endStation.getId()))
                    endStationWalkTime.put(endStation.getId(), routingUtil.getRoute(endStation.getLatitude(), endStation.getLongitude(), request.getEndLatitude(), request.getEndLongitude(), TransportationType.도보));

                if(answer.getTimeList().stream().mapToInt(Integer::intValue).sum() > startStationTime + stationToStationTime + endStationWalkTime.get(endStation.getId())) {
                    answer = TransportTimeGetResponse.builder()
                            .startStation(startStation.getName())
                            .startLineName(startStation.getLineName())
                            .endStation(endStation.getName())
                            .endLineName(endStation.getLineName())
                            .timeList(new ArrayList<>(List.of(startStationTime, stationToStationTime, endStationWalkTime.get(endStation.getId()))))
                            .build();
                }
            }
        }

        return answer;

    }
}
