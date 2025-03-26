package com.ssaenggojip.user.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.user.converter.UserConverter;
import com.ssaenggojip.user.dto.UserRequestDto;
import com.ssaenggojip.user.dto.UserResponseDto;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponseDto updateUser(User user, UserRequestDto userRequestDto) {
        if (user.getEmail().equals(userRequestDto.getEmail())) {
            throw new GeneralException(ErrorStatus.SAME_EMAIL);
        }

        user.setEmail(userRequestDto.getEmail());
        user.setEmailVerified(false);
        return UserConverter.toUserResponseDto(user);
    }
}
