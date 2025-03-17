package com.sds.baseproject.accesscontrol.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IpAllowlistRequest {
    @Schema(example = "127.0.0.1")
    private String ipAddr;
    @Schema(example = "local host")
    private String description;
}
