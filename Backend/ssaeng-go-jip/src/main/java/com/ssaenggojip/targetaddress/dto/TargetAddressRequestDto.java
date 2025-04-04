package com.ssaenggojip.targetaddress.dto;

import com.ssaenggojip.common.enums.TransportMode;
import jakarta.validation.constraints.*;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class TargetAddressRequestDto {

    @NotBlank
    @Size(max = 200)
    String address;

    @NotBlank
    @Size(max = 10)
    String name;

    @NotNull
    @Digits(integer = 3, fraction = 6)
    BigDecimal latitude;

    @NotNull
    @Digits(integer = 3, fraction = 6)
    BigDecimal longitude;

    @NotNull
    TransportMode transportMode;

    @NotNull
    @Min(0)
    Integer travelTime;

    @NotNull
    @Min(0)
    Integer walkTime;
}
