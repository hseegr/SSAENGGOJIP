package com.sds.baseproject.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

/**
 * 응답 Json화를 담당하는 설정
 * Page 객체 반환 시 json 형태 간소화를 위한 설정만 추가로 적용되어있다.
 */
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class JacksonConfig {
}
