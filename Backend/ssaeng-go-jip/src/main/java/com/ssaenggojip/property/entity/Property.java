package com.ssaenggojip.property.entity;

import com.ssaenggojip.common.enums.DealType;
import com.ssaenggojip.common.enums.PropertyType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@ToString
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
    @Type(value = JsonType.class)
    @Column(name = "facility_nearness", columnDefinition = "vector(8)")
    private List<Double> facilityNearness;

}
