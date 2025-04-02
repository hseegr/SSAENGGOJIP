package com.ssaenggojip.station.entity;

import com.ssaenggojip.common.enums.DayType;
import com.ssaenggojip.common.enums.UpDownType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import java.util.List;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "station_route")
public class StationRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "departure_station_id", nullable = false)
    private Long departureStationId;

    @NotNull
    @Column(name = "destination_station_id", nullable = false)
    private Long destinationStationId;

    @Type(type = "long-array")
    @Column(name = "subway_route", columnDefinition = "bigint[]", nullable = false)
    private Long[] subwayRoute;

    @NotNull
    @Column(name = "message", nullable = false, length = Integer.MAX_VALUE)
    private String message;

    @NotNull
    @Column(name = "stop_count", nullable = false)
    private Integer stopCount;

    @NotNull
    @Column(name = "transport_time", nullable = false)
    private Integer transportTime;

    @NotNull
    @Column(name = "transfer_count", nullable = false)
    private Integer transferCount;

}