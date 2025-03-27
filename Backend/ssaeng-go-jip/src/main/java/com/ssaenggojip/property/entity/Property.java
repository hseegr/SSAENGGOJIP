package com.ssaenggojip.property.entity;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "property")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealType dealType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType propertyType;

    @Column(nullable = false)
    private Integer price;

    private Integer rentPrice;

    private Integer maintenancePrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double exclusiveArea;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double supplyArea;

    @Column(nullable = false, length = 8)
    private String floor;

    @Column(nullable = false, length = 8)
    private String totalFloor;

    @Column(nullable = false, precision = 9, scale = 6)
    private Double latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private Double longitude;

    @Column(nullable = false, length = 32)
    private String sido;

    @Column(nullable = false, length = 32)
    private String sigungu;

    @Column(nullable = false, length = 32)
    private String dong;

    @Column(nullable = false, length = 256)
    private String address;

}
