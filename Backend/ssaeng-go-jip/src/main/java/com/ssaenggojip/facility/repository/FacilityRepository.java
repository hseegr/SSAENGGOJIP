package com.ssaenggojip.facility.repository;

import com.ssaenggojip.facility.entity.Facility;
import com.ssaenggojip.facility.dto.FacilityLocationResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    @Query(nativeQuery = true,
            value = "SELECT " +
                    "   facility_type_id, " +
                    "   latitude, " +
                    "   longitude " +
                    "FROM facility " +
                    "WHERE geography(geom) <-> ST_Point(:lon, :lat) < 500 "
    )
    List<FacilityLocationResponse> findNearFacilities(
            @Param("lat") Double lat,
            @Param("lon") Double lon
    );
}
