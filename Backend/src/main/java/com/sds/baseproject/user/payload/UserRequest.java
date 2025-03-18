package com.sds.baseproject.user.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserRequest {
    @Schema(example = "test@samsung.com")
    private String loginId;
    @Schema(example = "패스워드")
    private String password;
    @Schema(example = "이름")
    private String name;
    @Schema(example = "SEOUL")
    private String regionCd;
    @Schema(example = "N")
    private String disabledYn;
    @Schema(example = "[\"ROLE_TEST\"]")
    private List<String> roleIds = new ArrayList<>();
}
