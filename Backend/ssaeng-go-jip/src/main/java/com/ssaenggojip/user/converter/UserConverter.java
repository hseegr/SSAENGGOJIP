package com.ssaenggojip.user.converter;

import com.ssaenggojip.user.dto.UserResponseDto;
import com.ssaenggojip.user.entity.User;

public class UserConverter {

    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
                .nickname(user.getNickname())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .socialLoginType(user.getSocialLoginType())
                .build();
    }
}
