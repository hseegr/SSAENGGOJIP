package com.ssaenggojip.station.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.common.util.TransportTimeProvider;
import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.TransportTimeResponse;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.entity.StationRoute;
import com.ssaenggojip.station.repository.NearStationRepository;
import com.ssaenggojip.station.repository.StationRepository;
import com.ssaenggojip.station.repository.StationRouteReporitory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;
    private final NearStationRepository nearStationRepository;
    private final StationRouteReporitory stationRouteReporitory;
    private final TransportTimeProvider transportTimeProvider;

    public Station findByName(String search) {
        if (search.endsWith("역"))
            return stationRepository.findByName(search.substring(0, search.length() - 1)).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
        return stationRepository.findByName(search).orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_STATION_INFO));
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
}
