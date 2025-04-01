package com.ssaenggojip.property.entity.response;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

import java.util.List;


@Builder
@RequiredArgsConstructor
public class TransportTimeResponse {
    private Integer totalTransportTime;
    private List<Integer> transportTimeList;
    private Integer transferCount;
}
