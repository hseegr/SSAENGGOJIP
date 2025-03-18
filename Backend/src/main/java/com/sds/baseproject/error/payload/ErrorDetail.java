package com.sds.baseproject.error.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class ErrorDetail {
    private Long errorId;
    private String message;
    private String stacktrace;

    private UserSummarySimple regUser;
    private OffsetDateTime regDatetime;
}
