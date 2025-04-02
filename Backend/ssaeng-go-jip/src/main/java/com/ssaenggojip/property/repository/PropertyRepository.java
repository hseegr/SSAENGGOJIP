package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.dto.request.SearchRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query(value = """
    SELECT *
    FROM property
    WHERE (:#{#request.dealType} IS NULL OR deal_type = :#{#request.dealType.name()})
      AND (:#{#request.propertyTypes == null || #request.propertyTypes.isEmpty()} IS TRUE 
            OR property_type = ANY(:#{#request.propertyTypes.![name()]}))
      AND (:#{#request.minPrice} IS NULL OR price >= :#{#request.minPrice})
      AND (:#{#request.maxPrice} IS NULL OR price <= :#{#request.maxPrice})
      AND (:#{#request.minRentPrice} IS NULL OR rent_price >= :#{#request.minRentPrice})
      AND (:#{#request.maxRentPrice} IS NULL OR rent_price <= :#{#request.maxRentPrice})
      AND (
          (:isStationSearch = TRUE AND 
              ST_DWithin(
                  ST_Transform(geom, 3857),
                  ST_Transform(ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), 3857),
                  1000
              )
          )
          OR
          (:isStationSearch = FALSE AND 
              (:#{#request.search} IS NULL 
              OR address ILIKE CONCAT('%', :#{#request.search}, '%') 
              OR name ILIKE CONCAT('%', :#{#request.search}, '%'))
          )
      )
    """, nativeQuery = true)
    List<Property> searchFilteredProperties(@Param("request") SearchRequest request,
                                            @Param("lat") Double lat,
                                            @Param("lng") Double lng,
                                            @Param("isStationSearch") Boolean isStationSearch);

}

