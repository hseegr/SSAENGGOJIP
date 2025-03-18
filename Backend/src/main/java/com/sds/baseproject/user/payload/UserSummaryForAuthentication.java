package com.sds.baseproject.user.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserSummaryForAuthentication {
    private String loginId;
    private String name;
    private List<String> roles;
}
