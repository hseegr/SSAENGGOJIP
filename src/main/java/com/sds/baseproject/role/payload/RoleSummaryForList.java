package com.sds.baseproject.role.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class RoleSummaryForList {
    private String roleId;
    private String description;
    private long userCount;
    private OffsetDateTime modDatetime;
    private UserSummarySimple modUser;
}
