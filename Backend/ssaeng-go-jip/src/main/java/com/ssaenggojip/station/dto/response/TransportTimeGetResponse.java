package com.ssaenggojip.station.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class TransportTimeGetResponse {
    String startStation = null;
    String startLineName = null;
    String endStation = null;
    String endLineName = null;
    List<Integer> timeList;
    public TransportTimeGetResponse(Integer time){
        this.timeList = new ArrayList<>(List.of(time));
    }
}
