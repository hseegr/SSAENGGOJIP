package com.ssaenggojip.auth;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(AuthUser.class) != null;
    }

    @Override
    public User resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

        //refresh-token 추출
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new GeneralException(ErrorStatus.INVALID_REFRESH_TOKEN);
        }

        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("refresh-token"))
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorStatus.INVALID_REFRESH_TOKEN))
                .getValue();

        //access token 추출
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String accessToken = authHeader.split(" ")[1];
        log.info("AuthUserArgumentResolver access token={}", accessToken);

        //검증
        boolean isAccessTokenValid = jwtUtil.validateAccessToken(accessToken);
        boolean isRefreshTokenValid = jwtUtil.validateRefreshToken(refreshToken);
        if (!isAccessTokenValid || !isRefreshTokenValid) {
            throw new GeneralException(ErrorStatus.FAILED_TO_VALIDATE_TOKEN);
        }

        //Access Token으로 정보 추출
        Long userId = Long.valueOf(jwtUtil.getSubject(accessToken));
        return userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_USER_ID));
    }
}