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
    @Enumerated(EnumType.STRING)
    @Column(name = "up_down")
    private UpDownType upDown;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "day_type")
    private DayType dayType;

    @NotNull
    @Column(name = "next_station_id", nullable = false)
    private Long nextStationId;

    @Column(name = "time_0530")
    private Double time0530;

    @Column(name = "time_0600")
    private Double time0600;

    @Column(name = "time_0630")
    private Double time0630;

    @Column(name = "time_0700")
    private Double time0700;

    @Column(name = "time_0730")
    private Double time0730;

    @Column(name = "time_0800")
    private Double time0800;

    @Column(name = "time_0830")
    private Double time0830;

    @Column(name = "time_0900")
    private Double time0900;

    @Column(name = "time_0930")
    private Double time0930;

    @Column(name = "time_1000")
    private Double time1000;

    @Column(name = "time_1030")
    private Double time1030;

    @Column(name = "time_1100")
    private Double time1100;

    @Column(name = "time_1130")
    private Double time1130;

    @Column(name = "time_1200")
    private Double time1200;

    @Column(name = "time_1230")
    private Double time1230;

    @Column(name = "time_1300")
    private Double time1300;

    @Column(name = "time_1330")
    private Double time1330;

    @Column(name = "time_1400")
    private Double time1400;

    @Column(name = "time_1430")
    private Double time1430;

    @Column(name = "time_1500")
    private Double time1500;

    @Column(name = "time_1530")
    private Double time1530;

    @Column(name = "time_1600")
    private Double time1600;

    @Column(name = "time_1630")
    private Double time1630;

    @Column(name = "time_1700")
    private Double time1700;

    @Column(name = "time_1730")
    private Double time1730;

    @Column(name = "time_1800")
    private Double time1800;

    @Column(name = "time_1830")
    private Double time1830;

    @Column(name = "time_1900")
    private Double time1900;

    @Column(name = "time_1930")
    private Double time1930;

    @Column(name = "time_2000")
    private Double time2000;

    @Column(name = "time_2030")
    private Double time2030;

    @Column(name = "time_2100")
    private Double time2100;

    @Column(name = "time_2130")
    private Double time2130;

    @Column(name = "time_2200")
    private Double time2200;

    @Column(name = "time_2230")
    private Double time2230;

    @Column(name = "time_2300")
    private Double time2300;

    @Column(name = "time_2330")
    private Double time2330;

    @Column(name = "time_0000")
    private Double time0000;

    @Column(name = "time_0030")
    private Double time0030;


}
