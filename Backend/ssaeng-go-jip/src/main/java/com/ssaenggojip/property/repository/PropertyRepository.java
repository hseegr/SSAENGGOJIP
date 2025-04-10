package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.dto.response.RecommendSearchDto;
import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

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
            @Param("dist") Integer dist
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
                    "WHERE " +
                    "   geom <-> geography(ST_Point(127.1, 37.5)) <= 1000 " +
                    "ORDER BY " +
                    "   geom <-> geography(ST_Point(127.1, 37.5)) ASC " +
                    "LIMIT 100 "
    )
    List<Property> findByLocation(
            @Param("lng") Double lng,
            @Param("lat") Double lat,
            @Param("radius") Double radius
    );

    @Query(nativeQuery = true,
            value = "SELECT id " +
                    "FROM property " +
                    "WHERE id IN (:ids) " +
                    "AND 1 - (cast(:pref as vector) <=> facility_nearness * cast(:pref as vector)) > 0.996 "
    )
    Set<Long> findIdsByIsRecommended(
            @Param("ids") Set<Long> ids,
            @Param("pref") String pref
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
        SELECT ST_SetSRID(ST_MakePoint(:lng, :lat), 4326) AS geom
    ),
    station_a AS (
        SELECT
            s.id AS station_a_id,
            ST_DistanceSphere(ST_MakePoint(s.longitude, s.latitude), up.geom) / 80 AS t1
        FROM station s, user_point up
        WHERE ST_DistanceSphere(ST_MakePoint(s.longitude, s.latitude), up.geom) <= :walkTime * 80
    ),
    station_b AS (
        SELECT
            sm.destination_station_id AS station_b_id,
            sa.station_a_id,
            sa.t1,
            sm.transport_time AS t2
        FROM station_route sm
        JOIN station_a sa ON sm.departure_station_id = sa.station_a_id
        WHERE sm.transport_time <= (:totalTime - sa.t1)
    ),
    property_candidates AS (
        SELECT
            sb.station_b_id,
            sb.station_a_id,
            sb.t1,
            sb.t2,
            ns.property_id,
            ns.walk_time AS t3,
            (sb.t1 + sb.t2 + ns.walk_time) AS total_time
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
        CAST(pc.total_time AS INTEGER)
    FROM property_candidates pc
    JOIN property p ON pc.property_id = p.id
    WHERE (:dealType IS NULL OR p.deal_type::text = :dealType)
      AND (:propertyTypesEmpty OR p.property_type::text IN (:propertyTypes))
      AND p.price BETWEEN :minPrice AND :maxPrice
      AND p.rent_price BETWEEN :minRentPrice AND :maxRentPrice
      AND pc.total_time <= :totalTime
    ORDER BY pc.total_time ASC
""", nativeQuery = true)
    List<RecommendSearchDto> findReachableProperties(
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
            @Param("maxRentPrice") Long maxRentPrice
    );





}

