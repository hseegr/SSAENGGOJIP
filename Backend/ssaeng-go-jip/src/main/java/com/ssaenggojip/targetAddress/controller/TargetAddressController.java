package com.ssaenggojip.targetAddress.controller;

import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.targetAddress.dto.TargetAddressResponseDto;
import com.ssaenggojip.targetAddress.service.TargetAddressService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/target-addresses")
@RequiredArgsConstructor
public class TargetAddressController {

    private final TargetAddressService targetAddressService;

    @GetMapping
    public ApiResponse<List<TargetAddressResponseDto>> getTargetAddress(@AuthUser User user) {
        return ApiResponse.onSuccess(targetAddressService.getTargetAddress(user));
    }
}
