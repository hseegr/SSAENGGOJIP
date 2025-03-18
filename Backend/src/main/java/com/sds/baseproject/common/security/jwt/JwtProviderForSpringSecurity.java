package com.sds.baseproject.common.security.jwt;

import com.sds.baseproject.common.security.jwt.properties.JwtPropertiesForSpringSecurity;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class JwtProviderForSpringSecurity extends AbstractJwtProvider {
    public JwtProviderForSpringSecurity(JwtPropertiesForSpringSecurity jwtProperties) {
        super(jwtProperties.getSecret(), jwtProperties.getExpiration());
    }
}
