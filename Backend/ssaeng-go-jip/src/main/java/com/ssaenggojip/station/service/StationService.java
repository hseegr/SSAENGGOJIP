package com.ssaenggojip.station.service;

import com.ssaenggojip.station.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;

}
