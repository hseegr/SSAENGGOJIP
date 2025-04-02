package com.ssaenggojip.station.entity;

import com.ssaenggojip.common.enums.Line;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "near_station")
public class NearStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long propertyId;

    @Column(nullable = false)
    private Long stationId;

    @Column(nullable = false)
    private Integer walk_time;
}