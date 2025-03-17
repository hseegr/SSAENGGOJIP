package com.sds.baseproject.sso.controller;

import com.sds.baseproject.auth.payload.AuthenticationResponse;
import com.sds.baseproject.common.security.jwt.JwtProviderForSpringSecurity;
import com.sds.baseproject.sso.factory.SsoServiceFactory;
import com.sds.baseproject.sso.payload.SsoAuthToken;
import com.sds.baseproject.sso.service.SsoService;
import com.sds.baseproject.user.payload.UserRequestForSso;
import com.sds.baseproject.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sso")
@RequiredArgsConstructor
@Tag(name = "SSO 로그인", description = "SSO 로그인 과정에 필요한 인가 코드 요청 URL 조회와 SSO 로그인을 할 수 있습니다.")
public class SsoController {

    private final SsoServiceFactory ssoServiceFactory;
    private final UserService userService;
    private final JwtProviderForSpringSecurity jwtProvider;

    /**
     * SSO Provider의 인가 코드 요청 URL 반환 API
     *
     * 이 API는 사용자가 요청한 SSO Provider에 해당하는 인가 코드 요청 URL을 반환합니다.
     * 사용자는 반환된 URL을 사용하여 SSO 인증 절차를 시작할 수 있습니다.
     *
     * @param provider SSO Provider 이름 (현재는 'ssafy'만 지원)
     * @return 요청된 SSO Provider의 인가 코드 요청 URL.
     *
     */
    @Operation(summary = "인가 코드 요청 URL 조회", description = "인가 코드를 획득하기 위한 요청 URL을 조회한다")
    @ApiResponse(description = "인가 코드 요청 URL")
    @GetMapping("/providers/{provider}/authorization-uri")
    public String redirectAuthCodeRequestUrl(
            @Parameter(description = "SSO 로그인 Provider 타입 (현재는 SSAFY만 지원)", example = "ssafy")
            @PathVariable String provider) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        return ssoService.getAuthCodeRequestUrl();
    }

    /**
     * SSO 로그인 처리 메서드
     *
     * @param provider SSO Provider 이름 (현재는 'ssafy'만 지원)
     * @param code     클라이언트에서 전달된 인가 코드
     * @return         인증 토큰을 포함한 응답
     *
     * 이 메서드는 다음과 같은 단계를 수행합니다:
     * 1. provider 값에 따라 적절한 SsoService를 가져옵니다.
     * 2. 전달받은 인증 코드를 사용하여 SSO 인증 토큰을 발급받습니다.
     * 3. SSO 인증 토큰을 바탕으로 사용자 정보를 조회합니다.
     * 4. 조회된 사용자 정보를 시스템에 저장(존재하지 않을 경우)하고 로그인 ID를 반환합니다.
     * 5. 로그인 ID를 바탕으로 JWT 토큰을 생성하여 반환합니다.
     */
    @Operation(summary = "SSO 로그인", description = "인가코드로 토큰을 조회한 뒤, 토큰으로 인증을 진행한 뒤 jwt토큰을 반환한다 (Swagger에서 직접 실행할 수 없음)")
    @ApiResponse(description = "사용자 인증 후 발급되는 JWT token")
    @PostMapping("/providers/{provider}/login")
    public AuthenticationResponse ssoLogin(
            @Parameter(description = "SSO 로그인 Provider 타입 (현재는 SSAFY만 지원)", example = "ssafy")
            @PathVariable String provider,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "SSO 로그인 과정에서 사용되는 토큰을 조회하기 위한 인가코드 (Swagger에서는 인가코드 획득 불가)",
                    content = @Content(
                            examples = @ExampleObject(value = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzeXt12")
                    )
            )
            @RequestBody String code) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        SsoAuthToken ssoAuthToken = ssoService.getSsoAuthToken(code);
        UserRequestForSso userRequest = ssoService.getLoginUserInfo(ssoAuthToken);
        String loginId = this.userService.saveUserIfAbsent(userRequest);

        return new AuthenticationResponse(jwtProvider.generateToken(loginId));
    }

}
