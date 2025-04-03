package com.ssaenggojip.auth.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.auth.JwtUtil;
import com.ssaenggojip.auth.entity.RefreshToken;
import com.ssaenggojip.auth.entity.UserTokens;
import com.ssaenggojip.auth.infrastructure.*;
import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.common.service.RedisService;
import com.ssaenggojip.common.util.NicknameWordProvider;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoginService {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private final JwtUtil jwtUtil;
    private final RedisService redisService;
    private final UserRepository userRepository;
    private final NicknameWordProvider nicknameWordProvider;

    private final KakaoOAuthProvider kakaoOAuthProvider;
    private final NaverOAuthProvider naverOAuthProvider;
    private final GoogleOAuthProvider googleOAuthProvider;
    private final SsafyOAuthProvider ssafyOAuthProvider;

    @Transactional
    public UserTokens login(String code, SocialLoginType socialLoginType) {
        String socialLoginId = "";
        String email = "";

        switch (socialLoginType) {
            case KAKAO -> {
                KakaoUserInfo userInfo = kakaoOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                email = userInfo.getEmail();
            }
            case NAVER -> {
                NaverUserInfo userInfo = naverOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                email = userInfo.getEmail();
            }
            case GOOGLE -> {
                GoogleUserInfo userInfo = googleOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                email = userInfo.getEmail();
            }
            case SSAFY -> {
                SsafyUserInfo userInfo = ssafyOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                email = userInfo.getEmail();
            }
            default -> throw new GeneralException(ErrorStatus.INVALID_SOCIAL_PROVIDER);
        }

        if (email == null) {
            throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }

        boolean isNew = userRepository.findBySocialLoginId(socialLoginId).isEmpty();

        if (isNew) {
            userRepository.findByEmail(email).ifPresent(user -> {
                throw new GeneralException(ErrorStatus.ALREADY_JOIN, user.getSocialLoginType());
            });
        }

        User user = findOrCreateUser(email, socialLoginId, socialLoginType);
        log.info("user id: {}", user.getId());

        UserTokens userTokens = jwtUtil.createLoginToken(isNew, user.getId().toString());
        RefreshToken refreshToken = new RefreshToken(user.getId(), userTokens.getRefreshToken());
        redisService.setValue(redisPrefix + "::refresh-token::" + user.getId(), userTokens.getRefreshToken(), Duration.ofDays(7));

        return userTokens;
    }

    public UserTokens reissueAccessToken(String refreshToken, String authHeader) {
        String accessToken = authHeader.split(" ")[1];

        boolean isAccessTokenValid = jwtUtil.validateAccessToken(accessToken);
        boolean isRefreshTokenValid = jwtUtil.validateRefreshToken(refreshToken);

        String userId = null;

        if (isAccessTokenValid) {
            userId = jwtUtil.getSubject(accessToken);
        } else if (isRefreshTokenValid) {
            userId = jwtUtil.getSubject(refreshToken);
        }

        if (userId == null) {
            throw new GeneralException(ErrorStatus.FAILED_TO_VALIDATE_TOKEN);
        }

        String savedToken = (String) redisService.getValue(redisPrefix + "::refresh-token::" + userId);
        if (!isRefreshTokenValid || savedToken == null || !savedToken.equals(refreshToken)) {
            throw new GeneralException(ErrorStatus.INVALID_REFRESH_TOKEN);
        }

        String reissuedAccessToken = isAccessTokenValid ? accessToken : jwtUtil.reissueAccessToken(userId);

        return new UserTokens(false, userId, null, reissuedAccessToken);
    }


    public Long logout(User user) {
        redisService.deleteValue(redisPrefix + "::refresh-token::" + user.getId());
        return user.getId();
    }

    @Transactional
    public User findOrCreateUser(String email, String socialLoginId, SocialLoginType socialLoginType) {
        return userRepository.findBySocialLoginId(socialLoginId)
                .orElseGet(() -> createUser(email, socialLoginId, socialLoginType));
    }

    @Transactional
    public User createUser(String email, String socialLoginId, SocialLoginType socialLoginType) {
        for (int i = 0; i < 10; i++) {
            String nickname = nicknameWordProvider.getRandomNickname();

            if (userRepository.findByNickname(nickname).isEmpty()) {
                return userRepository.save(User.builder()
                        .nickname(nickname)
                        .email(email)
                        .emailVerified(false)
                        .socialLoginId(socialLoginId)
                        .socialLoginType(socialLoginType)
                        .build());
            }
        }

        throw new GeneralException(ErrorStatus.FAILED_TO_GENERATE_NICKNAME);
    }
}