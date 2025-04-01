package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query(nativeQuery = true,
            value = "SELECT * " +
                    "FROM properties " +
                    "ORDER BY facility_nearness <=> cast(? as vector) " +
                    "LIMIT ? "
    )
    List<Property> findTopKByFacilityNearness(String facilityPreferences,Integer limit);

    @Query(nativeQuery = true,
            value = "SELECT * " +
                    "FROM properties " +
                    "WHERE ST_DWithin(" +
                    "geography(ST_SetSRID(ST_Point(longitude, latitude), 4326)), " +
                    "geography(ST_SetSRID(ST_Point(:lng, :lat), 4326)), " +
                    ":radius) "
    )
    List<Property> findByFacilityNearness(@Param("lng") Double lng, @Param("lat") Double lat, @Param("radius") Double radius);
}
