package com.sds.baseproject.error.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;


@Getter
@Setter
public class ErrorSearchRequest {
    private String keyword;
    @Schema(example = "2025-01-01T00:00:00.000Z")
    private OffsetDateTime fromDate;
    @Schema(example = "2025-02-28T23:59:59.000Z")
    private OffsetDateTime toDate;
}
