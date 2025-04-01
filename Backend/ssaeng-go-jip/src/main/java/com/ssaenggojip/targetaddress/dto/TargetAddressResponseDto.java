package com.ssaenggojip.targetaddress.dto;

import com.ssaenggojip.common.enums.TransportMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TargetAddressResponseDto {
    Long id;
    String address;
    String name;
    Boolean isDefault;
    BigDecimal latitude;
    BigDecimal longitude;
    TransportMode transportMode;
    Integer travelTime;
    Integer walkTime;
}
