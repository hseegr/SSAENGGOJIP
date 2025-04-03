package com.ssaenggojip.auth.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.auth.entity.UserTokens;
import com.ssaenggojip.auth.entity.response.AccessTokenResponse;
import com.ssaenggojip.auth.service.LoginService;
import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class LoginController {

    private static final int ONE_WEEK_SECONDS = 604800;
    private final LoginService loginService;

    @PostMapping("/login/{provider}")
    public ApiResponse<AccessTokenResponse> socialLogin(
            @PathVariable("provider") String provider,
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        SocialLoginType loginType = SocialLoginType.valueOf(provider.toUpperCase());
        UserTokens tokens = loginService.login(code, loginType);

        ResponseCookie cookie = ResponseCookie.from("refresh-token", tokens.getRefreshToken())
                .maxAge(ONE_WEEK_SECONDS)
                .httpOnly(true)
                .sameSite("None")
                .secure(true)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ApiResponse.onSuccess(new AccessTokenResponse(tokens.getIsNew(), tokens.getAccessToken()));
    }

    @PostMapping("/reissue")
    @Operation(summary = "Access Token 재발급 API", description = "Refresh Token을 기반으로 Access Token을 재발급하는 API 입니다.")
    public ApiResponse<AccessTokenResponse> reissueToken(
            @CookieValue("refresh-token") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) {
        String reissuedToken = loginService.reissueAccessToken(refreshToken, authHeader);
        return ApiResponse.onSuccess(new AccessTokenResponse(false, reissuedToken));
    }

    @PostMapping(value = "/logout")
    @Operation(summary = "로그아웃 API", description = "소셜 로그인으로부터 로그아웃하는 API 입니다.")
    public ApiResponse<Long> logout(@AuthUser User user) {
        return ApiResponse.onSuccess(loginService.logout(user));
    }
}
