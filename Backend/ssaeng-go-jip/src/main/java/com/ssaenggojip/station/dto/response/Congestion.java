package com.ssaenggojip.station.dto.response;

import com.ssaenggojip.station.entity.StationDetail;

import java.math.BigDecimal;
import java.util.List;

public class Congestion {
    List<Double> weekDays;
    List<Double> saturday;
    List<Double> sunday;

    public Congestion(StationDetail weekDaysDetail, StationDetail saturdayDetail, StationDetail sundayDetail) {
        this.weekDays = toDoubleList(weekDaysDetail);
        this.saturday = toDoubleList(saturdayDetail);
        this.sunday = toDoubleList(sundayDetail);
    }

    private List<Double> toDoubleList(StationDetail detail) {
        return List.of(
                get(detail.getTime0530()), get(detail.getTime0600()), get(detail.getTime0630()), get(detail.getTime0700()),
                get(detail.getTime0730()), get(detail.getTime0800()), get(detail.getTime0830()), get(detail.getTime0900()),
                get(detail.getTime0930()), get(detail.getTime1000()), get(detail.getTime1030()), get(detail.getTime1100()),
                get(detail.getTime1130()), get(detail.getTime1200()), get(detail.getTime1230()), get(detail.getTime1300()),
                get(detail.getTime1330()), get(detail.getTime1400()), get(detail.getTime1430()), get(detail.getTime1500()),
                get(detail.getTime1530()), get(detail.getTime1600()), get(detail.getTime1630()), get(detail.getTime1700()),
                get(detail.getTime1730()), get(detail.getTime1800()), get(detail.getTime1830()), get(detail.getTime1900()),
                get(detail.getTime1930()), get(detail.getTime2000()), get(detail.getTime2030()), get(detail.getTime2100()),
                get(detail.getTime2130()), get(detail.getTime2200()), get(detail.getTime2230()), get(detail.getTime2300()),
                get(detail.getTime2330()), get(detail.getTime0000()), get(detail.getTime0030())
        );
    }

    private Double get(BigDecimal value) {
        return value != null ? value.doubleValue() : 0.0;
    }
}
