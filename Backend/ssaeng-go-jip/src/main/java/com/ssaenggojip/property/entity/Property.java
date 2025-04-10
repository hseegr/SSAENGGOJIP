package com.ssaenggojip.property.entity;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;
import org.hibernate.annotations.Type;

import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, name = "deal_type", columnDefinition = "deal_type_enum")
    private DealType dealType;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, name = "property_type", columnDefinition = "property_type_enum")
    private PropertyType propertyType;

    @Column(nullable = false)
    private Long price;

    private Long rentPrice;

    private Long maintenancePrice;

    @Column(nullable = false)
    private Double exclusiveArea;

    @Column(nullable = false)
    private Double supplyArea;

    @Column(nullable = false, length = 8)
    private String floor;

    @Column(nullable = false, length = 8)
    private String totalFloor;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 32)
    private String sido;

    @Column(nullable = false, length = 32)
    private String sigungu;

    @Column(nullable = false, length = 32)
    private String dong;

    @Column(nullable = false, length = 256)
    private String address;

    @Column(length = 1024)
    private String mainImage;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point geom;

    @Setter
    @Type(value = JsonType.class)
    @Column(name = "facility_nearness", columnDefinition = "vector(8)")
    private List<Double> facilityNearness;

    private Boolean isHospitalNear;
    private Boolean isPharmacyNear;
    private Boolean isVetNear;
    private Boolean isParkNear;
    private Boolean isGovernmentNear;
    private Boolean isConvenienceStoreNear;
    private Boolean isMartNear;
    private Boolean isLaundryNear;

}
