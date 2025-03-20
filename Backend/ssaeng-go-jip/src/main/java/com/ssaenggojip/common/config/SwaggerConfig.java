package com.ssaenggojip.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "쌩고집 API",
                version = "v1",
                description = "쌩고집 API 문서입니다."
        )
)
public class SwaggerConfig {
}
