package com.ssaenggojip.user.dto;

import com.ssaenggojip.common.enums.SocialLoginType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    String nickname;
    String email;
    Boolean emailVerified;
    SocialLoginType socialLoginType;
}
