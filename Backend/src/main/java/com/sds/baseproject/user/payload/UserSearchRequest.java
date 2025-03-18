package com.sds.baseproject.user.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchRequest {
    private String keyword;
    @Schema(example = "SEOUL")
    private String regionCd;
}
