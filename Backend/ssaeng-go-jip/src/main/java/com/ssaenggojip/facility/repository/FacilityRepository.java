package com.ssaenggojip.facility.repository;

import com.ssaenggojip.facility.entity.Facility;
import com.ssaenggojip.facility.dto.NearFacilityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    @Query(nativeQuery = true,
            value = "SELECT DISTINCT ON (facility_type_id) id, " +
                    "facility_type_id , name, address, latitude, longitude, " +
                    "ST_Distance( " +
                    "   geom, " +
                    "   geography(" +
                    "       ST_SetSRID(ST_Point(:lon, :lat), 4326)" +
                    "   )" +
                    ") AS distance " +
                    "FROM facility " +
                    "WHERE ST_DWithin(" +
                    "   geom, " +
                    "   ST_SetSRID(ST_Point(:lon, :lat), 4326), " +
                    "   2000" +
                    ") " +
                    "ORDER BY facility_type_id, distance ASC"
    )
    List<NearFacilityResponse> findNearFacilities(
            @Param("lat") Double lat,
            @Param("lon") Double lon
    );
}
