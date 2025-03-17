package com.sds.baseproject.user.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSummarySimple {
    private String userId;
    private String loginId;
    private String name;
}
