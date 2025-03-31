package com.ssaenggojip.station.repository;

import com.ssaenggojip.station.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {
    Optional<Station> findByName(String substring);
    @Query(value = """
    SELECT *
    FROM station
    WHERE
      6371 * acos(
        cos(radians(:lat)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(:lng)) +
        sin(radians(:lat)) * sin(radians(latitude))
      ) <= 1
""", nativeQuery = true)
    List<Station> findStationsWithin1km(@Param("lng") Double lng, @Param("lat") Double lat);


}
