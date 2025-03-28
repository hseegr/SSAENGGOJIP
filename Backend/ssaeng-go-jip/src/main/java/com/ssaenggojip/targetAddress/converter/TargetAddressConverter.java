package com.ssaenggojip.targetAddress.converter;

import com.ssaenggojip.targetAddress.dto.TargetAddressRequestDto;
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

    public static TargetAddress toTargetAddress(TargetAddressRequestDto targetAddressRequestDto) {
        return TargetAddress.builder()
                .address(targetAddressRequestDto.getAddress())
                .name(targetAddressRequestDto.getName())
                .latitude(targetAddressRequestDto.getLatitude())
                .longitude(targetAddressRequestDto.getLongitude())
                .transportMode(targetAddressRequestDto.getTransportMode())
                .travelTime(targetAddressRequestDto.getTravelTime())
                .walkTime(targetAddressRequestDto.getWalkTime())
                .build();
    }
}
