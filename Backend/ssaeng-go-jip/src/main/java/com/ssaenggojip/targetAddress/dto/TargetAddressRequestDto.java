package com.ssaenggojip.targetAddress.dto;

import com.ssaenggojip.common.enums.TransportMode;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class TargetAddressRequestDto {
    String address;
    String name;
    BigDecimal latitude;
    BigDecimal longitude;
    TransportMode transportMode;
    Integer travelTime;
    Integer walkTime;
}
