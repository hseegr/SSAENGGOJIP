package com.sds.baseproject.common.security.jwt;

import com.sds.baseproject.common.security.jwt.properties.JwtPropertiesForAttachment;
import org.springframework.stereotype.Component;

/**
 * 파일 다운로드 링크 유효성 여부 검증을 위한 토큰을 담당.
 */
@Component
public class JwtProviderForAttachment extends AbstractJwtProvider {
    public JwtProviderForAttachment(JwtPropertiesForAttachment jwtProperties) {
        super(jwtProperties.getSecret(), jwtProperties.getExpiration());
    }
}
