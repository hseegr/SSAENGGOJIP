package com.sds.baseproject.common.security.jwt.properties;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@RequiredArgsConstructor
@ConfigurationProperties("jwt.springsecurity")
public class JwtPropertiesForSpringSecurity {
    private final String secret;
    private final long expiration;
}
