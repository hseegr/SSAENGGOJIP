package com.sds.baseproject.role.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class RoleRequest {
    @Schema(example = "ROLE_TEST")
    private String description;
    @Schema(example = "[\"SYSTEM_USER\"]")
    private List<String> userIdList = new ArrayList<>();
}
