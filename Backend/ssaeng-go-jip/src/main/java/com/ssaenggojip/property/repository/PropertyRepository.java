package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query(nativeQuery = true,
            value = "SELECT * " +
                    "FROM properties " +
                    "ORDER BY facility_nearness <=> cast(? as vector) " +
                    "LIMIT ? "
    )
    List<Property> findTopKByFacilityNearness(String facilityPreferences,Integer limit);
}
