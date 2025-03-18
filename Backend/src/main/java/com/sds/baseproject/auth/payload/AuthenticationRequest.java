package com.sds.baseproject.auth.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationRequest {
    @Schema(example = "아이디")
    private String username;
    @Schema(example = "패스워드")
    private String password;
}
