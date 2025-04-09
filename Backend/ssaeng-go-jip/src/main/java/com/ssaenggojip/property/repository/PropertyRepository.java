package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.dto.response.PointStationPropertyDto;
import com.ssaenggojip.property.dto.response.RecommendSearchDto;
import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    // ** 성능 테스트 용으로 남겨둘 것
//    @Query(value = """
//    SELECT * FROM property p
//    WHERE (:dealType IS NULL OR p.deal_type::text = :dealType)
//      AND (:propertyTypesEmpty = true OR p.property_type::text IN (:propertyTypes))
//      AND p.price BETWEEN :minPrice AND :maxPrice
//      AND p.rent_price BETWEEN :minRentPrice AND :maxRentPrice
//      AND (
//        (:isStationSearch = true AND
//         ST_DWithin(
//            ST_Transform(p.geom, 3857),
//            ST_Transform(
//              ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
//              3857
//            ),
//            :dist
//         )
//        ) OR
//        (:isStationSearch = false AND (
//            :search IS NULL OR p.address LIKE :search OR p.name LIKE :search
//        ))
//      )
//    """, nativeQuery = true)
//    List<Property> searchFilteredProperties(
//            @Param("dealType") String dealType,
//            @Param("propertyTypes") List<String> propertyTypes,
//            @Param("propertyTypesEmpty") boolean propertyTypesEmpty,
//            @Param("minPrice") Long minPrice,
//            @Param("maxPrice") Long maxPrice,
//            @Param("minRentPrice") Long minRentPrice,
//            @Param("maxRentPrice") Long maxRentPrice,
//            @Param("search") String search,
//            @Param("lng") BigDecimal lng,
//            @Param("lat") BigDecimal lat,
//            @Param("isStationSearch") boolean isStationSearch,
//            @Param("dist") Integer dist
//    );
    @Query(value = """
SELECT * FROM property p
WHERE (:dealType IS NULL OR p.deal_type::text = :dealType)
  AND (:propertyTypesEmpty = true OR p.property_type::text IN (:propertyTypes))
  AND p.price BETWEEN :minPrice AND :maxPrice
  AND p.rent_price BETWEEN :minRentPrice AND :maxRentPrice
  AND (:isHospitalNear IS NULL OR p.is_hospital_near = :isHospitalNear)
  AND (:isPharmacyNear IS NULL OR p.is_pharmacy_near = :isPharmacyNear)
  AND (:isVetNear IS NULL OR p.is_vet_near = :isVetNear)
  AND (:isParkNear IS NULL OR p.is_park_near = :isParkNear)
  AND (:isGovernmentNear IS NULL OR p.is_government_near = :isGovernmentNear)
  AND (:isConvenienceStoreNear IS NULL OR p.is_convenience_store_near = :isConvenienceStoreNear)
  AND (:isMartNear IS NULL OR p.is_mart_near = :isMartNear)
  AND (:isLaundryNear IS NULL OR p.is_laundry_near = :isLaundryNear)
  AND (
    (:isStationSearch = true AND
     ST_DWithin(
        p.geom_3857,
        ST_Transform(
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
          3857
        ),
        :dist
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
            @Param("isStationSearch") boolean isStationSearch,
            @Param("dist") Integer dist,
            @Param("isHospitalNear") Boolean isHospitalNear,
            @Param("isPharmacyNear") Boolean isPharmacyNear,
            @Param("isVetNear") Boolean isVetNear,
            @Param("isParkNear") Boolean isParkNear,
            @Param("isGovernmentNear") Boolean isGovernmentNear,
            @Param("isConvenienceStoreNear") Boolean isConvenienceStoreNear,
            @Param("isMartNear") Boolean isMartNear,
            @Param("isLaundryNear") Boolean isLaundryNear
    );







    @Query(value = "SELECT * FROM property LIMIT 20000", nativeQuery = true)
    List<Property> findAllCoordinates();

    @Query(nativeQuery = true,
            value = "SELECT * " +
                    "FROM property " +
                    "WHERE ST_DWithin(" +
                    "geography(ST_SetSRID(ST_Point(longitude, latitude), 4326)), " +
                    "geography(ST_SetSRID(ST_Point(:lng, :lat), 4326)), " +
                    ":radius) " +
                    "ORDER BY facility_nearness <=> cast(:vector as vector) " +
                    "LIMIT :limit "
    )
    List<Property> findTopKByVector(
            @Param("lng") Double lng,
            @Param("lat") Double lat,
            @Param("radius") Double radius,
            @Param("vector") String vector,
            @Param("limit") Integer limit
    );


    @Query(nativeQuery = true,
            value = "SELECT * " +
                    "FROM property " +
                    "WHERE ST_DWithin(" +
                    "geography(ST_SetSRID(ST_Point(longitude, latitude), 4326)), " +
                    "geography(ST_SetSRID(ST_Point(:lng, :lat), 4326)), " +
                    ":radius) " +
                    "ORDER BY ST_Distance(" +
                    "   geom, " +
                    "   geography(" +
                    "       ST_SetSRID(ST_Point(:lng, :lat), 4326)" +
                    "   )" +
                    ") ASC " +
                    "LIMIT 100 "
    )
    List<Property> findByLocation(
            @Param("lng") Double lng,
            @Param("lat") Double lat,
            @Param("radius") Double radius
    );

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

    @Query(value = """
WITH user_point AS (
    SELECT ST_Transform(ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), 3857) AS geom_3857
),
station_a AS (
    SELECT
        s.id AS station_a_id,
        s.latitude AS station_a_latitude,
        s.longitude AS station_a_longitude,
        ST_Distance(s.geom_3857, up.geom_3857) / 80 AS t1
    FROM station s, user_point up
    WHERE ST_DWithin(s.geom_3857, up.geom_3857, :walkTime * 80)
),
station_b AS (
    SELECT
        sm.destination_station_id AS station_b_id,
        s.latitude AS station_b_latitude,
        s.longitude AS station_b_longitude,
        sa.station_a_id,
        sa.t1,
        sa.station_a_latitude,
        sa.station_a_longitude,
        sm.transport_time AS t2
    FROM station_route sm
    JOIN station_a sa ON sm.departure_station_id = sa.station_a_id
    JOIN station s ON sm.destination_station_id = s.id
    WHERE sm.transport_time <= (:totalTime - sa.t1)
),
property_candidates AS (
    SELECT
        sb.station_b_id,
        sb.station_a_id,
        sb.t1,
        sb.t2,
        sb.station_a_latitude,
        sb.station_a_longitude,
        sb.station_b_latitude,
        sb.station_b_longitude,
        ns.property_id,
        ns.walk_time AS t3
    FROM station_b sb
    JOIN near_station ns ON sb.station_b_id = ns.station_id
    WHERE ns.walk_time <= (:walkTime - sb.t1)
)
SELECT
    p.id,
    false AS is_recommend,
    p.deal_type,
    p.price,
    p.rent_price,
    p.maintenance_price,
    p.total_floor,
    p.floor,
    p.exclusive_area AS area,
    p.address,
    p.latitude,
    p.longitude,
    false AS is_interest,
    p.main_image AS image_url,
    pc.t2 AS transport_time,
    pc.station_a_latitude,
    pc.station_a_longitude,
    pc.station_b_latitude,
    pc.station_b_longitude
FROM property_candidates pc
JOIN property p ON pc.property_id = p.id
WHERE (:dealType IS NULL OR p.deal_type::text = :dealType)
    AND (:propertyTypesEmpty OR p.property_type::text IN (:propertyTypes))
    AND p.price BETWEEN :minPrice AND :maxPrice
    AND p.rent_price BETWEEN :minRentPrice AND :maxRentPrice
    AND (:isHospitalNear IS NULL OR p.is_hospital_near = :isHospitalNear)
    AND (:isPharmacyNear IS NULL OR p.is_pharmacy_near = :isPharmacyNear)
    AND (:isVetNear IS NULL OR p.is_vet_near = :isVetNear)
    AND (:isParkNear IS NULL OR p.is_park_near = :isParkNear)
    AND (:isGovernmentNear IS NULL OR p.is_government_near = :isGovernmentNear)
    AND (:isConvenienceStoreNear IS NULL OR p.is_convenience_store_near = :isConvenienceStoreNear)
    AND (:isMartNear IS NULL OR p.is_mart_near = :isMartNear)
    AND (:isLaundryNear IS NULL OR p.is_laundry_near = :isLaundryNear)
ORDER BY pc.t2 ASC
""", nativeQuery = true)
    List<PointStationPropertyDto> findReachableProperties(
            @Param("lng") Double lng,
            @Param("lat") Double lat,
            @Param("walkTime") Integer walkTime,
            @Param("totalTime") Integer totalTime,
            @Param("dealType") String dealType,
            @Param("propertyTypes") List<String> propertyTypes,
            @Param("propertyTypesEmpty") boolean propertyTypesEmpty,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("minRentPrice") Long minRentPrice,
            @Param("maxRentPrice") Long maxRentPrice,
            @Param("isHospitalNear") Boolean isHospitalNear,
            @Param("isPharmacyNear") Boolean isPharmacyNear,
            @Param("isVetNear") Boolean isVetNear,
            @Param("isParkNear") Boolean isParkNear,
            @Param("isGovernmentNear") Boolean isGovernmentNear,
            @Param("isConvenienceStoreNear") Boolean isConvenienceStoreNear,
            @Param("isMartNear") Boolean isMartNear,
            @Param("isLaundryNear") Boolean isLaundryNear
    );








}

