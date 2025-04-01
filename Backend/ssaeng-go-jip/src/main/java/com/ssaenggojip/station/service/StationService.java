package com.ssaenggojip.station.service;

import com.ssaenggojip.property.entity.request.TransportTimeRequest;
import com.ssaenggojip.property.entity.response.TransportTimeResponse;
import com.ssaenggojip.station.entity.Station;
import com.ssaenggojip.station.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;

    public Optional<Station> findByName(String search) {
        if (search.endsWith("역"))
            return stationRepository.findByName(search.substring(0, search.length() - 1));
        return stationRepository.findByName(search);
    }

    public List<Station> findStationsWithin1km(Double longitude, Double latitude) {
        return stationRepository.findStationsWithin1km(longitude, latitude);
    }

    public TransportTimeResponse getTransportTime(TransportTimeRequest request) {

    }
}
