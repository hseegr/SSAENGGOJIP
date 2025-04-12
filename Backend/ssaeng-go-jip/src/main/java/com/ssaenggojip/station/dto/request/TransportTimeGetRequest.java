package com.ssaenggojip.station.dto.request;

import com.ssaenggojip.common.enums.TransportationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransportTimeGetRequest {
    @NotNull
    Double startLatitude;
    @NotNull
    Double startLongitude;
    @NotNull
    Double endLatitude;
    @NotNull
    Double endLongitude;
    @NotNull
    TransportationType transportationType;
}
