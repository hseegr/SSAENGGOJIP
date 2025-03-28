package com.ssaenggojip.targetAddress.converter;

import com.ssaenggojip.targetAddress.dto.TargetAddressResponseDto;
import com.ssaenggojip.targetAddress.entity.TargetAddress;

public class TargetAddressConverter {

    public static TargetAddressResponseDto toTargetAddressResponseDto(TargetAddress targetAddress) {
        return TargetAddressResponseDto.builder()
                .id(targetAddress.getId())
                .address(targetAddress.getAddress())
                .name(targetAddress.getName())
                .isDefault(targetAddress.getIsDefault())
                .latitude(targetAddress.getLatitude())
                .longitude(targetAddress.getLongitude())
                .transportMode(targetAddress.getTransportMode())
                .travelTime(targetAddress.getTravelTime())
                .walkTime(targetAddress.getWalkTime())
                .build();
    }
}
