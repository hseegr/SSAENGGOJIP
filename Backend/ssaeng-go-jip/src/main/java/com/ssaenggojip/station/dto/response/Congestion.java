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

    private List<Double> toDoubleList(StationDetail d) {
        return List.of(
                d.getTime0530(), d.getTime0600(), d.getTime0630(), d.getTime0700(),
                d.getTime0730(), d.getTime0800(), d.getTime0830(), d.getTime0900(),
                d.getTime0930(), d.getTime1000(), d.getTime1030(), d.getTime1100(),
                d.getTime1130(), d.getTime1200(), d.getTime1230(), d.getTime1300(),
                d.getTime1330(), d.getTime1400(), d.getTime1430(), d.getTime1500(),
                d.getTime1530(), d.getTime1600(), d.getTime1630(), d.getTime1700(),
                d.getTime1730(), d.getTime1800(), d.getTime1830(), d.getTime1900(),
                d.getTime1930(), d.getTime2000(), d.getTime2030(), d.getTime2100(),
                d.getTime2130(), d.getTime2200(), d.getTime2230(), d.getTime2300(),
                d.getTime2330(), d.getTime0000(), d.getTime0030()
        );
    }
}
