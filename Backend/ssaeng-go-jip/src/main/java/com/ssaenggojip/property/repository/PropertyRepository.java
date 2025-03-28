package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {


    //TODO: 공간 인덱스 적용
    @Query(value = """
    SELECT *
    FROM (
        SELECT *, (
            6371 * acos(
                cos(radians(:centerLat)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(:centerLng)) +
                sin(radians(:centerLat)) * sin(radians(latitude))
            )
        ) AS distance
        FROM property
    ) AS p
    WHERE (:dealType IS NULL OR deal_type = :dealType)
      AND (:#{#propertyTypes == null || #propertyTypes.isEmpty()} IS TRUE OR property_type = ANY(:propertyTypes))
      AND (:price IS NULL OR price <= :price)
      AND (:rentPrice IS NULL OR rent_price <= :rentPrice)
      AND (:search IS NULL OR address ILIKE CONCAT('%', :search, '%') OR name ILIKE CONCAT('%', :search, '%'))
      AND (:distance IS NULL OR p.distance <= :distance)
""", nativeQuery = true)
    List<Property> searchFilteredProperties(
            @Param("dealType") String dealType,
            @Param("propertyTypes") List<String> propertyTypes,
            @Param("price") Integer price,
            @Param("rentPrice") Integer rentPrice,
            @Param("search") String search,
            @Param("distance") Double distance,
            @Param("centerLat") Double centerLat,
            @Param("centerLng") Double centerLng
    );

}
