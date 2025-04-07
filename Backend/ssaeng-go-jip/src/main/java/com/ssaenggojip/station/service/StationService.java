package com.ssaenggojip.station.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.common.enums.DayType;
import com.ssaenggojip.common.enums.UpDownType;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.property.dto.response.TransportTimeResponse;
import com.ssaenggojip.station.dto.response.Congestion;
import com.ssaenggojip.station.dto.response.CongestionGetResponse;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.entity.StationDetail;
import com.ssaenggojip.station.entity.StationRoute;
import com.ssaenggojip.station.repository.NearStationRepository;
import com.ssaenggojip.station.repository.StationDetailRepository;
import com.ssaenggojip.station.repository.StationRepository;
import com.ssaenggojip.station.repository.StationRouteReporitory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;
    private final NearStationRepository nearStationRepository;
    private final StationRouteReporitory stationRouteReporitory;
    private final TransportTimeProvider transportTimeProvider;
    private final StationDetailRepository stationDetailRepository;

    public Station findByName(String search) {
        if (search.endsWith("역"))
            return stationRepository.findTopByNameOrderByIdAsc(search.substring(0, search.length() - 1)).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
        return stationRepository.findTopByNameOrderByIdAsc(search).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
    }

    public List<Station> findStationsWithin1km(Double longitude, Double latitude) {
        return stationRepository.findStationsWithin1km(longitude, latitude);
    }

    public TransportTimeResponse getTransportTime(Double pointLongitude, Double pointLatitude, Double propertyLongitude, Double propertyLatitude) {

        List<Station> stationsNearPoint = stationRepository.findStationsWithin1km(pointLongitude, pointLatitude);
        List<Station> stationsNearProperty = stationRepository.findStationsWithin1km(propertyLongitude, propertyLatitude);

        if (stationsNearProperty.isEmpty() || stationsNearPoint.isEmpty())
            throw new GeneralException(ErrorStatus.NO_STATION_NEAR_POINT);

        Integer transferCount = -1;
        List<Integer> answer = List.of(Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE);

        for (Station pointStation : stationsNearPoint){
            for (Station propertyStation : stationsNearProperty) {
                if(propertyStation.getId().equals(pointStation.getId()))
                    continue;

                int pointToStationTime = transportTimeProvider.getWalkMinutes(pointLongitude, pointLatitude, pointStation.getLongitude(), pointStation.getLatitude());
                StationRoute stationRoute = stationRouteReporitory.findByDepartureStationIdAndDestinationStationId(pointStation.getId(), propertyStation.getId()).orElseThrow(() -> new GeneralException(ErrorStatus.NO_STATION_TO_STATION_MAPPER));

                int stationToStationTime = stationRoute.getTransportTime();
                int stationToPropertyTime = transportTimeProvider.getWalkMinutes(propertyLongitude, propertyLatitude,propertyStation.getLongitude(),propertyStation.getLatitude());
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
}
