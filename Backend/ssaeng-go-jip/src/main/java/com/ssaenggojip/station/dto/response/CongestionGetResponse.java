package com.ssaenggojip.station.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CongestionGetResponse {
    Boolean isUpAndDown = true;
    List<Congestion> congestionList;
}
