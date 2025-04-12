package com.ssaenggojip.station.repository;

import com.ssaenggojip.station.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {
    Optional<Station> findTopByNameOrderByIdAsc(String substring);
    @Query(value = """
    SELECT *
    FROM station
    WHERE ST_DWithin(
       geom_3857,
       ST_Transform(ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), 3857),
       :km * 1250
     )
     
    """, nativeQuery = true)
    List<Station> findStationsWithin1km(@Param("lng") Double lng, @Param("lat") Double lat, @Param("km") Integer km);

    Optional<Long> findByNameAndLineName(String startStationName, String startStationLineName);


//    @Query(value = """
//        SELECT
//            s."stationId",
//            snc."stationName",
//            snc."lineName",
//            ceiling(s.distance / 80) as "walkMinute"
//        FROM (
//            SELECT
//                "stationId",
//                ST_Distance(
//                    ST_Transform("geom", 3857),
//                    ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857)
//                ) AS distance
//            FROM "StationCoordinate"
//            WHERE ST_DWithin(
//                    ST_Transform("geom", 3857),
//                    ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857),
//                    1000
//            )
//        ) s
//        JOIN "StationNametoCode" snc USING("stationId")
//        """, nativeQuery = true)
//    List<NearbyStationResult> findNearbyStationsWithWalkTime(@Param("latitude") double lat, @Param("longitude") double lon);
// }


}
