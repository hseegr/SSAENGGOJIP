package com.sds.baseproject.auth.controller;

import com.sds.baseproject.auth.payload.AuthenticationRequest;
import com.sds.baseproject.auth.payload.AuthenticationResponse;
import com.sds.baseproject.common.security.jwt.JwtProviderForSpringSecurity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "사용자 인증", description = "사용자의 아이디와 비밀번호로 로그인을 진행할 수 있습니다.")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProviderForSpringSecurity jwtProvider;


    @PostMapping("/login")
    @Operation(summary = "사용자 로그인", description = "사용자의 아이디와 비밀번호를 입력받아 인증 토큰을 반환한다")
    @ApiResponse(description = "로그인 성공, JWT 토큰 반환")
    public AuthenticationResponse login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "로그인을 위한 사용자 인증 정보")
            @RequestBody AuthenticationRequest authenticationRequest) {

        Authentication authentication = this.authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()
                ));

        return new AuthenticationResponse(jwtProvider.generateToken(authentication.getName()));
    }
}
