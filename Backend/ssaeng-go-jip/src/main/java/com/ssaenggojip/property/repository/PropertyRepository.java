package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.request.SearchRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    // TODO: 공간인덱스 적용
    @Query(value = """
        SELECT *
        FROM (
            SELECT *, (
                6371 * acos(
                    cos(radians(:lat)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(latitude))
                )
            ) AS distance
            FROM property
        ) AS p
        WHERE (:#{#request.dealType} IS NULL OR deal_type = :#{#request.dealType.name()})
          AND (:#{#request.propertyTypes == null || #request.propertyTypes.isEmpty()} IS TRUE OR property_type = ANY(:#{#request.propertyTypes.![name()]}))
          AND (:#{#request.price} IS NULL OR price <= :#{#request.price})
          AND (:#{#request.rentPrice} IS NULL OR rent_price <= :#{#request.rentPrice})
          AND (
              (:isStationSearch = TRUE AND p.distance <= 1)
              OR
              (:isStationSearch = FALSE AND (:#{#request.search} IS NULL OR address ILIKE CONCAT('%', :#{#request.search}, '%') OR name ILIKE CONCAT('%', :#{#request.search}, '%')))
          )
        """, nativeQuery = true)
    List<Property> searchFilteredProperties(@Param("request") SearchRequest request,
                                            @Param("lat") Double lat,
                                            @Param("lng") Double lng,
                                            @Param("isStationSearch") Boolean isStationSearch);
}

