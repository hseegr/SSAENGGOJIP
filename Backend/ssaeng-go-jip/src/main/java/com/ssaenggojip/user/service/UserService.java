package com.ssaenggojip.user.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.common.service.MailService;
import com.ssaenggojip.common.service.RedisService;
import com.ssaenggojip.user.converter.UserConverter;
import com.ssaenggojip.user.dto.UserRequestDto;
import com.ssaenggojip.user.dto.UserResponseDto;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final MailService mailService;
    private final RedisService redisService;
    private final UserRepository userRepository;

    @Transactional
    public UserResponseDto updateUser(User user, UserRequestDto userRequestDto) {
        if (user.getEmail().equals(userRequestDto.getEmail())) {
            throw new GeneralException(ErrorStatus.SAME_EMAIL);
        }

        checkDuplicatedEmail(userRequestDto.getEmail());
        user.setEmail(userRequestDto.getEmail());
        user.setEmailVerified(false);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Async
    public CompletableFuture<Boolean> sendEmail(User user) {
        String email = user.getEmail();
        log.info("email: {}", email);

        try {
            String title = "[쌩GO집] 이메일 인증 번호 발송";
            String authCode = this.createCode();
            String text = "<h3>" + "요청하신 인증번호입니다." + "</h3>" +
                    "<h1>" + authCode + "</h1>";

            mailService.sendEmail(email, title, text);  // 이메일 전송
            redisService.setValue("AuthCode " + email, authCode, Duration.ofMillis(600000)); // Redis 저장, 만료 기간 10분

            return CompletableFuture.completedFuture(true);  // 성공 시 true 반환
        } catch (Exception e) {
            return CompletableFuture.completedFuture(false);  // 실패 시 false 반환
        }
    }

    @Transactional
    public Boolean verifyEmailCode(User user, String authCode) {
        String email = user.getEmail();
        String storedCode = (String) redisService.getValue("AuthCode " + email);

        if (storedCode != null && storedCode.equals(authCode)) {
            user.setEmailVerified(true);
            return true;
        }

        return false;
    }

    @Transactional(readOnly = true)
    private void checkDuplicatedEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new GeneralException(ErrorStatus.EMAIL_EXIST);
        }
    }

    private String createCode() {
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < 6; i++) {
                builder.append(random.nextInt(10));
            }

            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new GeneralException(ErrorStatus._INTERNAL_SERVER_ERROR);
        }
    }

}
