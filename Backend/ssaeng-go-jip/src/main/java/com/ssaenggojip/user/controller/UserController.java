package com.ssaenggojip.user.controller;

import com.ssaenggojip.apiPayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.user.converter.UserConverter;
import com.ssaenggojip.user.dto.UserRequestDto;
import com.ssaenggojip.user.dto.UserResponseDto;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<UserResponseDto> getUserInfo(@AuthUser User user) {
        return ApiResponse.onSuccess(UserConverter.toUserResponseDto(user));
    }

    @PatchMapping
    public ApiResponse<UserResponseDto> modifyUserEmail(@AuthUser User user, @RequestBody @Valid UserRequestDto userRequestDto) {
        return ApiResponse.onSuccess(userService.updateUser(user, userRequestDto));
    }

    @DeleteMapping
    public ApiResponse<Void> withdrawUser(@AuthUser User user) {
        userService.deleteUser(user);
        return ApiResponse.onSuccess(null);
    }
}
