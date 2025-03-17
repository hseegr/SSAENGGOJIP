package com.sds.baseproject.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    private static final long MAX_AGE_SECS = 3600;

    /**
     * cors 설정을 위한 Bean 생성
     * 개발단계에서는 기본적으로 모든 도메인에 대해서 cors를 허용하도록 설정한다.
     * 운영단계에서는 특정 도메인, 특정 메소드, 특정 헤더에 대해서만 cors를 허용하도록 설정을 변경해주어야 한다.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE")
                        .allowedHeaders("*")
                        .maxAge(MAX_AGE_SECS)
                        .allowCredentials(true);
            }
        };
    }
}
