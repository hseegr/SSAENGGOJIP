package com.ssaenggojip.targetaddress.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.targetaddress.dto.TargetAddressRequestDto;
import com.ssaenggojip.targetaddress.dto.TargetAddressResponseDto;
import com.ssaenggojip.targetaddress.service.TargetAddressService;
import com.ssaenggojip.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ApiResponse<List<TargetAddressResponseDto>> addTargetAddress(
            @AuthUser User user,
            @RequestBody @Valid TargetAddressRequestDto request) {
        return ApiResponse.onSuccess(targetAddressService.createTargetAddress(user, request));
    }

    @PatchMapping("/{targetAddressId}/default")
    public ApiResponse<List<TargetAddressResponseDto>> setDefaultTargetAddress(
            @AuthUser User user,
            @PathVariable Long targetAddressId) {
        return ApiResponse.onSuccess(targetAddressService.updateDefaultTargetAddress(user, targetAddressId));
    }

    @PatchMapping("/{targetAddressId}")
    public ApiResponse<List<TargetAddressResponseDto>> modifyTargetAddress(
            @AuthUser User user,
            @PathVariable Long targetAddressId,
            @RequestBody @Valid TargetAddressRequestDto request) {
        return ApiResponse.onSuccess(targetAddressService.updateTargetAddress(user, targetAddressId, request));
    }

    @DeleteMapping("/{targetAddressId}")
    public ApiResponse<List<TargetAddressResponseDto>> removeTargetAddress(
            @AuthUser User user,
            @PathVariable Long targetAddressId) {
        return ApiResponse.onSuccess(targetAddressService.deleteTargetAddress(user, targetAddressId));
    }
}
