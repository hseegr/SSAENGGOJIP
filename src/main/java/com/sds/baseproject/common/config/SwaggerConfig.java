package com.sds.baseproject.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.customizers.RouterOperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI openAPI() {
        String swaggerDescription = """
                ※ JWT 토큰을 설정하지 않으면, 권한이 필요한 API 요청 시 `403 Forbidden` 오류가 발생할 수 있습니다.<br/>
                ※ API를 정상적으로 실행하려면 먼저 인증을 완료해야 합니다.

                1. 아래 사용자 인증의 **사용자 로그인 API**에서 아이디와 비밀번호를 입력하여 로그인합니다.
                2. 응답으로 반환된 **JWT 토큰**을 복사합니다.
                3. Swagger UI 상단의 **Authorize** 버튼을 클릭하고 JWT 토큰을 입력합니다.
                4. 설정된 JWT 토큰은 이후 모든 API 요청의 **Authorization 헤더**에 자동으로 추가됩니다.

                이 과정을 통해 인증된 사용자로 API를 손쉽게 테스트할 수 있습니다.
                """;


        return new OpenAPI()
                .addServersItem(new Server().url(""))
                .info(new Info()
                        .title("Base Project API Documentation")
                        .version("1.0")
                        .description(swaggerDescription))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                        .addSchemas("Pageable",
                                new Schema<>().type("object")
                                        .addProperty("page", new IntegerSchema().example(0))
                                        .addProperty("size", new IntegerSchema().example(10))
                                        .addProperty("sort", new StringSchema().example(""))
                        )

                );
    }

    @Bean
    public OpenApiCustomizer schemaCustomizer() {
        return openApi -> {
            for (Schema<?> schema : openApi.getComponents().getSchemas().values()) {
                for (Object propSchema : schema.getProperties().values()) {
                    if (propSchema instanceof StringSchema stringSchema && (stringSchema.getExample() == null)) {
                        stringSchema.setExample("");
                    }
                }
            }
        };
    }

    @Bean
    public RouterOperationCustomizer routerOperationCustomizer() {
        return (routerOperation, handlerMethod) -> {
            routerOperation.setPath(routerOperation.getPath() + this.getParamString(routerOperation.getParams()));
            return routerOperation;
        };
    }

    private String getParamString(String[] params) {
        if (params == null || params.length == 0) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("?");
        for (String param : params) {
            if (sb.length() != 1) {
                sb.append("&");
            }
            sb.append(param);
            if (!param.contains("=")) {
                sb.append("={}");
            }
        }
        return sb.toString();
    }
}
