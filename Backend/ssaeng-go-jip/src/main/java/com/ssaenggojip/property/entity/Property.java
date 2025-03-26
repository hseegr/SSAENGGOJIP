package com.ssaenggojip.property.entity;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import com.ssaenggojip.common.utils.PGVectorConverter;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "properties")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private DealType dealType;

    @Column(nullable = false)
    private PropertyType propertyType;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Double area;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer guCode;

    @Column(nullable = false)
    private Integer dCode;

    @Setter
    @Convert(converter = PGVectorConverter.class)
    @Column
    private float[] facilityNearness;

}
