package com.ssaenggojip.property.repository;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import com.ssaenggojip.property.dto.response.CoordinateResponse;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.dto.request.SearchRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query(value = """
    SELECT * FROM property p
    WHERE (:dealType IS NULL OR p.deal_type::text = :dealType)
      AND (:propertyTypesEmpty = true OR p.property_type::text IN (:propertyTypes))
      AND p.price BETWEEN :minPrice AND :maxPrice
      AND p.rent_price BETWEEN :minRentPrice AND :maxRentPrice
      AND (
        (:isStationSearch = true AND
         ST_DWithin(
            ST_Transform(p.geom, 3857),
            ST_Transform(
              ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
              3857
            ),
            1000
         )
        ) OR
        (:isStationSearch = false AND (
            :search IS NULL OR p.address LIKE :search OR p.name LIKE :search
        ))
      )
    """, nativeQuery = true)
    List<Property> searchFilteredProperties(
            @Param("dealType") String dealType,
            @Param("propertyTypes") List<String> propertyTypes,
            @Param("propertyTypesEmpty") boolean propertyTypesEmpty,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("minRentPrice") Long minRentPrice,
            @Param("maxRentPrice") Long maxRentPrice,
            @Param("search") String search,
            @Param("lng") BigDecimal lng,
            @Param("lat") BigDecimal lat,
            @Param("isStationSearch") boolean isStationSearch
    );







    @Query(value = "SELECT * FROM property LIMIT 20000", nativeQuery = true)
    List<Property> findAllCoordinates();

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
    @Query(value = """
    SELECT 
        *
    FROM property
    WHERE geom && ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326)
    """, nativeQuery = true)
    List<Property> findAllCoordinatesBySquareScope(
            @Param("minX") Double minX,
            @Param("minY") Double minY,
            @Param("maxX") Double maxX,
            @Param("maxY") Double maxY
    );
}

