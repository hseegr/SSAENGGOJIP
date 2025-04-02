package com.ssaenggojip.station.repository;

import com.ssaenggojip.station.entity.StationDetail;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StationDetailRepository extends JpaRepository<StationDetail,Long> {
    List<StationDetail> findAllByStationId(@NotNull Long stationId);
}
