package com.ssaenggojip.facility.entity;

import com.ssaenggojip.facilitytype.entity.FacilityType;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "facility_type_id")
    private FacilityType facilityType;
}
