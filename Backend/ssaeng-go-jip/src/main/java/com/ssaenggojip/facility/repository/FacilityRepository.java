package com.ssaenggojip.facility.repository;

import com.ssaenggojip.facility.entity.Facility;
import com.ssaenggojip.facility.dto.NearFacilityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    @Query(nativeQuery = true,
            value = "SELECT DISTINCT ON (f.facility_type_id) \n" +
                    "       f.id, \n" +
                    "       f.facility_type_id, \n" +
                    "       ft.name AS facility_type_name \n" +
                    "       f.name, \n" +
                    "       f.address, \n" +
                    "       f.latitude, \n" +
                    "       f.longitude, \n" +
                    "       ST_Distance( \n" +
                    "           f.geom, \n" +
                    "           geography(\n" +
                    "               ST_SetSRID(ST_Point(:lon, :lat), 4326)\n" +
                    "           )\n" +
                    "       ) AS distance,\n" +
                    "FROM facility f\n" +
                    "JOIN facility_type ft ON f.facility_type_id = ft.id \n" +
                    "WHERE ST_DWithin(\n" +
                    "           f.geom, \n" +
                    "           ST_SetSRID(ST_Point(:lon, :lat), 4326), \n" +
                    "           2000\n" +
                    "       ) \n" +
                    "ORDER BY f.facility_type_id, distance ASC"
    )
    List<NearFacilityResponse> findNearFacilities(
            @Param("lat") Double lat,
            @Param("lon") Double lon
    );
}
