package com.ssaenggojip.facility.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "facility")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point geom;

    @ManyToOne
    @JoinColumn(name = "facility_type_id")
    private FacilityType facilityType;
}
