package com.ssaenggojip.station.repository;

import com.ssaenggojip.station.entity.StationRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StationRouteReporitory extends JpaRepository<StationRoute, Long> {
    Optional<StationRoute> findByDepartureStationIdAndDestinationStationId(Long id, Long id1);

    List<StationRoute> findByDepartureStationIdAndTransportTime(Long id, Integer totalTransportTime);
}
