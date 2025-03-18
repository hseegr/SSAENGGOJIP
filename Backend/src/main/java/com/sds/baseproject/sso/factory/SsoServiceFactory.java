package com.sds.baseproject.sso.factory;

import com.sds.baseproject.sso.enums.SsoProvider;
import com.sds.baseproject.sso.service.SsafySsoServiceImpl;
import com.sds.baseproject.sso.service.SsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * SSO 로그인 Provider 서비스 팩토리
 *
 * 이 로직은 다양한 SSO 로그인 Provider에 대한 서비스를 동적으로 생성하고,
 * 사용자가 선택한 Provider에 맞는 서비스를 반환하는 역할을 합니다.
 *
 * 현재는 SSAFY만 지원하도록 구현되어 있습니다.
 */
@Component
@RequiredArgsConstructor
public class SsoServiceFactory {

    private final SsafySsoServiceImpl ssafySsoService;

    /**
     * SSO 서비스 객체를 제공하는 팩토리 메서드
     *
     * 입력받은 providerType 값에 따라 적절한 SSO 서비스 객체를 반환합니다.
     * providerType이 비어 있거나 지원하지 않는 값일 경우 예외를 발생시킵니다.
     *
     * @param providerType 제공자 유형을 나타내는 문자열 (현재는 'ssafy'만 지원)
     * @return providerType에 해당하는 SsoService 구현체.
     *
     */
    public SsoService getSsoService(String providerType) {
        if (StringUtils.isEmpty(providerType)) {
            throw new IllegalArgumentException("Provider cannot be null");
        }

        // SsoProvider 열거형의 fromType 메서드를 호출하여 providerType 문자열을 SsoProvider로 변환
        // 변환된 provider 값을 기준으로 switch 구문을 사용하여 적절한 SsoService 객체 반환
        SsoProvider provider = SsoProvider.fromType(providerType);
        return switch (provider) {
            case SSAFY -> ssafySsoService;
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        };
    }
}
