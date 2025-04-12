package com.ssaenggojip.station.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShortestStationTimeGetRequest {
    @NotBlank
    String startStationName;
    @NotBlank
    String startStationLineName;
    @NotBlank
    String endStationName;
    @NotBlank
    String endStationLineName;
}
