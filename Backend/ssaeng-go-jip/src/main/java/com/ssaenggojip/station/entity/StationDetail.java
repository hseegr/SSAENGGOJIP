package com.ssaenggojip.station.entity;

import com.ssaenggojip.common.enums.DayType;
import com.ssaenggojip.common.enums.Line;
import com.ssaenggojip.common.enums.UpDownType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "station_detail")
public class StationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "station_id", nullable = false)
    private Long stationId;

    @Size(max = 10)
    @NotNull
    @Column(name = "line_number", nullable = false, length = 10)
    private String lineNumber;

    @NotNull
    @Column(name = "up_down")
    private UpDownType upDown;

    @NotNull
    @Column(name = "day_type")
    private DayType dayType;

    @NotNull
    @Column(name = "next_station_id", nullable = false)
    private Long nextStationId;

    @Column(name = "time_0530", precision = 6, scale = 1)
    private BigDecimal time0530;

    @Column(name = "time_0600", precision = 6, scale = 1)
    private BigDecimal time0600;

    @Column(name = "time_0630", precision = 6, scale = 1)
    private BigDecimal time0630;

    @Column(name = "time_0700", precision = 6, scale = 1)
    private BigDecimal time0700;

    @Column(name = "time_0730", precision = 6, scale = 1)
    private BigDecimal time0730;

    @Column(name = "time_0800", precision = 6, scale = 1)
    private BigDecimal time0800;

    @Column(name = "time_0830", precision = 6, scale = 1)
    private BigDecimal time0830;

    @Column(name = "time_0900", precision = 6, scale = 1)
    private BigDecimal time0900;

    @Column(name = "time_0930", precision = 6, scale = 1)
    private BigDecimal time0930;

    @Column(name = "time_1000", precision = 6, scale = 1)
    private BigDecimal time1000;

    @Column(name = "time_1030", precision = 6, scale = 1)
    private BigDecimal time1030;

    @Column(name = "time_1100", precision = 6, scale = 1)
    private BigDecimal time1100;

    @Column(name = "time_1130", precision = 6, scale = 1)
    private BigDecimal time1130;

    @Column(name = "time_1200", precision = 6, scale = 1)
    private BigDecimal time1200;

    @Column(name = "time_1230", precision = 6, scale = 1)
    private BigDecimal time1230;

    @Column(name = "time_1300", precision = 6, scale = 1)
    private BigDecimal time1300;

    @Column(name = "time_1330", precision = 6, scale = 1)
    private BigDecimal time1330;

    @Column(name = "time_1400", precision = 6, scale = 1)
    private BigDecimal time1400;

    @Column(name = "time_1430", precision = 6, scale = 1)
    private BigDecimal time1430;

    @Column(name = "time_1500", precision = 6, scale = 1)
    private BigDecimal time1500;

    @Column(name = "time_1530", precision = 6, scale = 1)
    private BigDecimal time1530;

    @Column(name = "time_1600", precision = 6, scale = 1)
    private BigDecimal time1600;

    @Column(name = "time_1630", precision = 6, scale = 1)
    private BigDecimal time1630;

    @Column(name = "time_1700", precision = 6, scale = 1)
    private BigDecimal time1700;

    @Column(name = "time_1730", precision = 6, scale = 1)
    private BigDecimal time1730;

    @Column(name = "time_1800", precision = 6, scale = 1)
    private BigDecimal time1800;

    @Column(name = "time_1830", precision = 6, scale = 1)
    private BigDecimal time1830;

    @Column(name = "time_1900", precision = 6, scale = 1)
    private BigDecimal time1900;

    @Column(name = "time_1930", precision = 6, scale = 1)
    private BigDecimal time1930;

    @Column(name = "time_2000", precision = 6, scale = 1)
    private BigDecimal time2000;

    @Column(name = "time_2030", precision = 6, scale = 1)
    private BigDecimal time2030;

    @Column(name = "time_2100", precision = 6, scale = 1)
    private BigDecimal time2100;

    @Column(name = "time_2130", precision = 6, scale = 1)
    private BigDecimal time2130;

    @Column(name = "time_2200", precision = 6, scale = 1)
    private BigDecimal time2200;

    @Column(name = "time_2230", precision = 6, scale = 1)
    private BigDecimal time2230;

    @Column(name = "time_2300", precision = 6, scale = 1)
    private BigDecimal time2300;

    @Column(name = "time_2330", precision = 6, scale = 1)
    private BigDecimal time2330;

    @Column(name = "time_0000", precision = 6, scale = 1)
    private BigDecimal time0000;

    @Column(name = "time_0030", precision = 6, scale = 1)
    private BigDecimal time0030;


}
