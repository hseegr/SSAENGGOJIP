package com.sds.baseproject.error.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class ErrorSummary {
    private Long errorId;
    private String message;
    private UserSummarySimple regUser;
    private OffsetDateTime regDatetime;
}
